/*!
 * Settings Store
 * ~~~~~~~~~~~~~~
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

var extend = require('extend')

var DEFAULTS = {
	relativeTime: true,
	autoShare:    true,
	launch:       false
}

var cache = {}

module.exports = {

	/**
	 * Generate the settings cache, and save to localStorage
	 * if settings key did not exist
	 */
	init: function() {
		var keyVal = localStorage.getItem('settings')

		cache = extend(true, {}, DEFAULTS, keyVal)

		if (!keyVal) {
			localStorage.setItem('settings', JSON.stringify(cache))
		}
	},

	/**
	 * Get all properties from the settings object
	 * 
	 * @return {*}
	 */
	getAll: function() {
			return cache
	},

	/**
	 * Get a single property from the settings object
	 * 
	 * @param  {String} item 
	 * @return {*}      
	 */
	get: function(item) {
		return cache[item]
	},

	/**
	 * Set the settings object cache, and persist to localStorage
	 * 
	 * @param {Object} obj 
	 */
	setAll: function(obj) {
		cache = obj
		localStorage.setItem('settings', JSON.stringify(cache))
	},

	/**
	 * Set a single property in the settings cache, and persist
	 * to localStorage
	 * 
	 * @param {String} item 
	 * @param {*} val  
	 */
	set: function(item, val) {
		cache[item] = val
		localStorage.setItem('settings', JSON.stringify(cache))
	}

}