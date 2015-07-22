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

var Dropbox   = require('../util/dropbox')()
var Rx        = require('rx')
var uiIntents = require('../intents/ui')

var fetchSubject = new Rx.Subject()

exports.fetch = function() {
	fetchSubject.onNext()
}

exports.photoStream =
	fetchSubject.map(function() {
		// Get sequence of files from root directory metadata
		return Rx.Observable.fromCallback(Dropbox.getMetaData)()
	}).mergeAll()
	.map(function(n) {
		return Rx.Observable.from(n.contents)
	}).mergeAll()

	// Get file data for each file
	.map(function(n) {
		return Rx.Observable.fromCallback(Dropbox.getFile)(n.path)
	}).mergeAll()

	// Get base64 string and metadata for photo
	.map(function(n){
		return {
			data: 'data:' + n.meta['mime_type'] + ';base64,' + btoa(n.data),
			meta: n.meta
		}
	})

exports.deleteStream =
	// Observe photo deletion UI event
	uiIntents.get('deletePhoto')

	// Send delete to Dropbox
	.map(function(d) {
		return Rx.Observable.fromCallback(Dropbox.deleteFile)(d.data.path)
	}).mergeAll()
