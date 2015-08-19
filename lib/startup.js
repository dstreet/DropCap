/*!
 * Startup Utility
 * ~~~~~~~~~~~~~~~
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

var plist   = require('plist')
var fs      = require('fs')
var exec    = require('child_process').exec
var path    = require('path')
var config  = require('../config')

module.exports = function(app) {

	var exePath = app.getPath('exe')
	var homePath = app.getPath('home')

	return {

		/**
		 * Enagle launch at login
		 */
		enable: function() {
			console.log('enabled Startup')
			switch(process.platform) {
				case 'darwin':
					this._enableDarwin()
					break
				default:
					break
			}
		},

		/**
		 * Disable launch at login
		 */
		disable: function() {
			switch(process.platform) {
				case 'darwin':
					this._disableDarwin()
					break
				default:
					break;
			}
		},

		/**
		 * Enable launch at login for Darwin
		 * 
		 * @private
		 */
		_enableDarwin: function() {
			var plistPath = path.join(homePath, '/Library/LaunchAgents/' + config.app.identifier + '.plist')
			var plistFile = fs.openSync(plistPath, 'w')
			var agentPlist = plist.build({
				Label:            config.app.identifier,
				ProgramArguments: [exePath],
				ProcessType:      'interactive',
				RunAtLoad:        true
			})

			fs.writeSync(plistFile, agentPlist)
		},

		/**
		 * Disable launch at login for Darwin
		 * 
		 * @private
		 */
		_disableDarwin: function() {
			exec('launchctl remove ' + config.app.identifier)
		}

	}

}