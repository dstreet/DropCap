/*!
 * User Interface Intents
 * ~~~~~~~~~~~~~~~~~~~~~~
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

module.exports = {

	/**
	 * Create a new event stream and enable the
	 * subject to subscribe to it
	 *
	 * @param  {String}     name
	 * @param  {DOMElement} el
	 * @param  {String}     type
	 * @param  {*}          data
	 * @return {Observable}
	 */
	set: function(name, el, type, data) {
		var eventStream = Rx.Observable
			.fromEvent(el, type)
			.map(function(e) {
				return {
					name: name,
					type: type,
					el: el,
					data: data,
					event: e
				}
			})

		eventStream.subscribe(subject)

		return subject.subscribe()
	},

	/**
	 * Get an event stream with the given name
	 *
	 * @param  {String}     name
	 * @return {Observable}
	 */
	get: function(name) {
		return subject.filter(function(n) {
			return n.name == name
		})
	},

	/**
	 * Unfiltered event stream
	 *
	 * @type {Observable}
	 */
	stream: subject

}
