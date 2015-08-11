/*!
 * Navigation Intents
 * ~~~~~~~~~~~~~~~~~~
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

var Rx = require('rx')

var subject = new Rx.Subject()
var navHistory = [null]
var popped = null

subject.startWith = function(navItem) {
	navHistory.push(navItem)
	return Rx.Subject.prototype.startWith.call(subject, navItem)
}

module.exports = {

	initial: function(navItem) {
		navHistory.push(navItem)
	},

	route: function(navItem) {
		navHistory.push(navItem)
		subject.onNext(navItem)
	},

	back: function() {
		popped = navHistory.pop()
		subject.onNext(navHistory[navHistory.length - 1])
	},

	forward: function() {
		this.route(popped)
		popped = null
	},

	get: function(navItem) {
		return subject.filter(function(item) {
			return navItem == item
		})
	},

	stream: subject

}