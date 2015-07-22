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

var app           = require('app')
var BrowserWindow = require('browser-window')
var querystring   = require('querystring')
var https         = require('https')

var mainWindow = null;

app.commandLine.appendSwitch('enable-experimental-web-platform-features')

app.on('window-all-closed', function() {
	app.quit();
})

app.on('ready', function() {
	mainWindow = new BrowserWindow({
		width: 400,
		height: 450,
		transparent: true,
		frame: false,
		resizable: false,
		'web-preferences': {
			'experimental-features': true
		}
	})

	mainWindow.loadUrl('file://' + __dirname + '/index.html')
	mainWindow.openDevTools()

	mainWindow.on('closed', function() {
		mainWindow = null;
	})
})
