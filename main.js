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

var ipc      = require('ipc')
var menubar  = require('menubar')
var shortcut = require('global-shortcut')
var fs       = require('fs')
var path     = require('path')
var startup  = require('./lib/startup')

var mb = menubar({
	width:                    320,
	height:                   460,
	transparent:              true,
	frame:                    false,
	resizable:                false,
	icon:                     __dirname + '/IconTemplate.png',
	show:                     false,
	preloadWindow:            true,
	'show-on-all-workspaces': true,
	'always-on-top':          process.env.NODE_ENV == 'development' ? true : false,
	index:                    'file://' + __dirname + '/index.html',
	'web-preferences':        { 'experimental-features': true }
})

var settings = { shortcuts: {} }
var wc = null
var settingsFile = path.join(mb.app.getPath('userData'), 'settings.json')

mb.app.commandLine.appendSwitch('enable-experimental-web-platform-features')

mb.app.on('ready', function() {
	console.log('Loading settings from', settingsFile)

	wc = mb.window.webContents

	fs.readFile(settingsFile, { encoding: 'utf8' }, function(err, data) {
		if (err) {
			return console.error('Failed to read settings file')
		}

		settings = JSON.parse(data)
		initShortcuts()
	})
})

mb.app.on('window-all-closed', function() {
	mb.app.quit()
})

mb.app.on('will-quit', function() {
	shortcut.unregisterAll()
	writeSettings()
})

mb.on('show', function() {
	if (process.env.NODE_ENV == 'development') {
		mb.window.openDevTools()
	}
})

ipc.on('hide-window', function() {
	mb.window.hide()
})

ipc.on('show-window', function(e) {
	mb.window.show()
})

ipc.on('enable-startup', function() {
	startup(mb.app).enable()
})

ipc.on('disable-startup', function() {
	startup(mb.app).disable()
})

ipc.on('register-shortcut', function(e, cacheKey, accel, message) {
	
	console.log('registering shortcut', accel, 'to send message:', message)

	if (settings.shortcuts.hasOwnProperty(cacheKey)) {
		shortcut.unregister(settings.shortcuts[cacheKey].accelerator)
	}

	settings.shortcuts[cacheKey] = {
		accelerator: accel,
		message: message
	}

	shortcut.register(accel, triggerShortcut(message))
	writeSettings()
})

ipc.on('quit-app', function() {
	mb.app.quit()
})

function initShortcuts() {
	var shortcuts = settings.shortcuts

	for (var s in shortcuts) {
		if (!shortcuts.hasOwnProperty(s)) {
			continue
		}

		shortcut.register(shortcuts[s].accelerator, triggerShortcut(shortcuts[s].message))
	}
}

function triggerShortcut(message) {
	return function() {
		wc.send(message)
	}
}

function writeSettings() {
	fs.writeFileSync(settingsFile, JSON.stringify(settings))
}