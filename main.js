/*!
 * Main Process
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

var ipc     = require('ipc')
var menubar = require('menubar')

var mainWindow = null
var mb = menubar({
	width:                    320,
	height:                   460,
	transparent:              true,
	frame:                    false,
	resizable:                false,
	icon:                     'IconTemplate.png',
	show:                     true,
	'show-on-all-workspaces': true,
	'always-on-top':          process.env.NODE_ENV == 'development' ? true : false,
	index:                    'file://' + __dirname + '/index.html',
	'web-preferences':        { 'experimental-features': true }
})

mb.app.commandLine.appendSwitch('enable-experimental-web-platform-features')

mb.app.on('window-all-closed', function() {
	mb.app.quit()
})

mb.on('show', function() {
	if (process.env.NODE_ENV == 'development') {
		mb.window.openDevTools()
	}
})

ipc.on('hide-window', function() {
	mb.window.hide()
})

ipc.on('show-window', function() {
	mb.window.show()
})
