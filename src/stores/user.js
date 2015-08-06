/*!
 * User Store
 * ~~~~~~~~~~
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


var Rx        = require('rx')
var uiIntents = require('../intents/ui')
var Dropbox   = require('../util/dropbox')()

var authSubject = new Rx.Subject()

uiIntents.get('authorize')
	.flatMap(function() {
		return Rx.Observable.fromNodeCallback(Dropbox.authorize)()
	})
	.subscribe(function(res) {
		authSubject.onNext(res['access_token'])
		localStorage.setItem('token', res['access_token'])
	})

uiIntents.get('deauthorize')
	.subscribe(function() {
		localStorage.removeItem('token')
		authSubject.onNext(null)
	})

module.exports = {

	authorize: authSubject.startWith(localStorage.getItem('token')),

}
