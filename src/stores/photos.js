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

var fetchSubject = new Rx.Subject()
var shareSubject = new Rx.Subject()

exports.fetch = function(token) {
	Dropbox.setToken(token)
	fetchSubject.onNext()
}

var captured = uiIntents.get('capture')
	// Take a screen capture
	.flatMap(function() {
		return Rx.Observable.fromNodeCallback(ScreenCapture.take)()
	})

	// Upload the file data
	.flatMap(function(data) {
		var time = (new Date()).getTime()
		var name = 'capture_' + time + '.png'

		return Rx.Observable.fromNodeCallback(Dropbox.uploadFile)(name, data)
	})

	// Map file data and metadata to an object for consumption. Yum!
	.map(function(n) {

		// Trigger sharing
		shareSubject.onNext(n.meta.path)

		return {
			data: n.file.toDataUrl(),
			meta: n.meta
		}
	})

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

exports.photoStream = fetchSubject
	// Get sequence of files from root directory metadata
	.flatMap(function() {
		return Rx.Observable.fromCallback(Dropbox.getMetaData)()
	})

	// Convert the resulting array of files to a sequence
	.flatMap(function(n) {
		return Rx.Observable.from(n.contents)
	})

	// Get file data for each file
	.flatMap(function(n) {
		return Rx.Observable.fromCallback(Dropbox.getFile)(n.path)
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

exports.deleteStream =
	// Observe photo deletion UI event
	uiIntents.get('deletePhoto')

	// Send delete to Dropbox
	.flatMap(function(d) {
		return Rx.Observable.fromCallback(Dropbox.deleteFile)(d.data.path)
	})
	.subscribe(function(n) {
		console.log('Deleted:', n)
	})
