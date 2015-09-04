/*!
 * Photos Store
 * ~~~~~~~~~~~~
 *
 * Copyright (C) 2015  David Street
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var Rx            = require('rx')
var nativeImage   = require('native-image')
var uiIntents     = require('../intents/ui')
var User          = require('./user')
var Dropbox       = require('../util/dropbox')()
var ScreenCapture = require('../util/screen-capture')()
var clipboard     = require('clipboard')
var shell         = require('shell')
var settings      = require('./settings')
var ipc           = require('ipc')

var fetchSubject = new Rx.Subject()
var shareSubject = new Rx.Subject()

var deltaSubject = new Rx.Subject()
var changesSubject = new Rx.Subject()
var entriesSubject = new Rx.Subject()
var shortcutSubject = new Rx.Subject()

deltaSubject.subscribe(function(res) {
	if (res.has_more) {
		attachToDelta(deltaSubject)
	} else {
		attachToPoll(changesSubject)
	}
})

changesSubject.subscribe(function(res) {
	if (res.changes) {
		attachToDelta(deltaSubject)
	} else {
		attachToPoll(changesSubject)
	}
})

var entries = deltaSubject
	.map(function(res) {
		return res.entries
	})
	.filter(function(arr) {
		return arr.length
	})
	.flatMap(function(arr) {
		return Rx.Observable.from(arr)
	})

var additions = entries
	.filter(function(entry) {
		return entry[1] != null
	})

var deletions = entries
	.filter(function(entry) {
		return entry[1] == null
	})

exports.fetch = function(token) {
	Dropbox.setToken(token)
	attachToDelta(deltaSubject)
}

var captured = uiIntents.get('capture')
	// Merge the shortcut stream
	.merge(Rx.Observable.fromEventPattern(
		function add(h) {
			ipc.on('shortcut-capture', h)
		}
	))

	// Hide the window
	.do(function() {
		ipc.send('hide-window')
	})

	// Take a screen capture
	.flatMap(function() {
		return Rx.Observable.onErrorResumeNext(
			Rx.Observable.fromNodeCallback(ScreenCapture.take)()
		)
	})

	// Show the window once the screen capture has been taken
	.do(function() {
		ipc.send('show-window')
	})

	// Upload the file data
	.flatMap(function(imageData) {

		var time = (new Date()).getTime()
		var name = 'capture_' + time + '.png'
		var img = imageData.toPng()

		return Rx.Observable.fromNodeCallback(Dropbox.uploadFile, undefined, function(body) {
			return {
				meta: body,
				file: imageData
			}
		})(name, img)
	})

	// Map file data and metadata to an object for consumption. Yum!
	.map(function(n) {

		// Trigger sharing if enabled
		if (settings.get('autoShare')) {
			shareSubject.onNext(n.meta.path)
		}

		return {
			data: n.file.toDataUrl(),
			meta: n.meta
		}
	})

// This is needed to ensure the shortcut capture
// stream is merged
captured.subscribe(function() {})

shareSubject
	.merge(uiIntents.get('share').map(function(e) { return e.data.path }))
	.flatMap(function(path) {
		return Rx.Observable.fromNodeCallback(Dropbox.shareFile)(path)
	})
	.subscribe(function(n) {
		clipboard.writeText(n.url)
		new Notification('Public url copied to your clipboard')
	})

var preview = uiIntents.get('preview')
	.flatMap(function(e) {
		return Rx.Observable.fromNodeCallback(Dropbox.shareFile)(e.data.path)
	})
	.subscribe(function(n) {
		shell.openExternal(n.url)
	})

exports.photoStream = additions
	// Get file data for each file
	.flatMap(function(entry) {
		return Rx.Observable.fromNodeCallback(Dropbox.getThumbnail)(entry[0])
	})

	// Get base64 string and metadata for photo
	.map(function(n){
		return {
			data: 'data:' + n.meta['mime_type'] + ';base64,' + btoa(n.data),
			meta: n.meta
		}
	})

	// Merge the captured image stream
	.merge(captured)

// Observe photo deletion UI event
uiIntents.get('deletePhoto')

	// Send delete to Dropbox
	.flatMap(function(d) {
		return Rx.Observable.fromNodeCallback(Dropbox.deleteFile)(d.data.path)
	})
	.subscribe(function(n) {
		console.log('Deleted:', n)
	})

exports.deleteStream = uiIntents.get('deletePhoto')
	.map(function(d) {
		return d.data.path
	})
	.merge(deletions.map(function(file) { return file[0] }))


function attachToDelta(subject) {
	return Rx.Observable
		.fromNodeCallback(Dropbox.getDelta)()
		.subscribe(function(res) {
			subject.onNext(res)
		})
}

function attachToPoll(subject) {
	return Rx.Observable
		.fromNodeCallback(Dropbox.doPoll)()
		.subscribe(function(res) {
			subject.onNext(res)
		})
}