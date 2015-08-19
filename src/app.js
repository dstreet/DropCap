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
var ipc       = require('ipc')
var uiIntents = require('./intents/ui')
var Authorize = require('./views/authorize')
var AppShell  = require('./views/app-shell')
var settings  = require('./stores/settings')

var h = React.createElement

if (process.env.NODE_ENV == 'development') {
	Rx.config.longStackSupport = true
}

uiIntents.get('quit')
	.subscribe(function() {
		ipc.send('quit-app')
	})

module.exports = {

	init: function(container) {
		this.container = container
		settings.init()
		this.render()
	},

	render: function() {
		React.render(h(AppShell), this.container)
	}

}
