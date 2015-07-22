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
var PhotoList = require('./views/photo-list')
var uiIntents = require('./intents/ui')
var user      = require('./stores/user')()
var Dropbox   = require('./util/dropbox')()

var h = React.createElement

module.exports = {

	init: function(container) {
		this.container = container
		this.render()
		uiIntents.get('doAuth')
			.map(function() {
				return Rx.Observable.fromNodeCallback(Dropbox.authorize)()
			}).mergeAll()
			.subscribe(function(n) {
				user.saveToken(n['access_token'])
				this.render()
			}.bind(this))
	},

	render: function() {
		if (user.getToken()) {
			React.render(h(PhotoList), this.container)
		} else {
			React.render(h(Authorize), this.container)
		}
	}

}
