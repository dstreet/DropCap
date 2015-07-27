/*!
 * Application
 * ~~~~~~~~~~~
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
var React     = require('react')
var Authorize = require('./views/authorize')
var AppShell  = require('./views/app-shell')
var uiIntents = require('./intents/ui')
// var user      = require('./stores/user')()
// var Dropbox   = require('./util/dropbox')()

var h = React.createElement

module.exports = {

	init: function(container) {
		this.container = container
		this.render()

		// Rx.Observable.just(user.getToken())
		// 	.map(function(n) {
		// 		if (n) {
		// 			return Rx.Observable.just(n)
		// 		}
		//
		// 		return Rx.Observable.fromNodeCallback(Dropbox.authorize)()
		// 			.map(function(n) {
		// 				return n['access_token']
		// 			})
		// 	}).mergeAll()
		// 	.subscribe(function(token) {
		// 		user.saveToken(token)
		// 		console.log(this)
		//
		// 		this.render()
		// 	}.bind(this))
	},

	render: function() {
		React.render(h(AppShell), this.container)
	}

}
