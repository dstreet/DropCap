/*!
 * Screen Capture Utility
 * ~~~~~~~~~~~~~~~~~~~~~~
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

var exec      = require('child_process').exec
var clipboard = require('clipboard')

module.exports = function() {

	var api = {
		
		take: function(cb) {
			switch (process.platform) {
				case 'darwin':
					api._takeDarwin(cb)
					break;
				case 'linux':
				case 'win32':
				default:
					break;
			}
		},

		_takeDarwin: function(cb) {
			var child = exec('screencapture -ic', function(err) {
				if (err) {
					return cb(err)
				}

				var img = clipboard.readImage()

				cb(null, img)
			})
		}

	}

	return api

}
