/*!
 * Photo List View
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

var React            = require('react/addons')
var Photo            = require('../components/photo')
var photoStream      = require('../stores/photos').photoStream
var deleteStream     = require('../stores/photos').deleteStream
var StateStreamMixin = require('rx-react').StateStreamMixin

var h = React.createElement

module.exports = React.createClass({

	displayName: 'PhotoList',

	mixins: [StateStreamMixin],

	getInitialState: function() {
		return {
			photos: []
		}
	},

	componentWillMount: function() {
		require('../stores/photos').fetch()
	},

	getStateStream: function() {
		return photoStream
			.scan([], function(acc, p) {
				return acc.concat(p)
			})
			// Strip out any photos that have been deleted
			.combineLatest(
				deleteStream.startWith(null),
				function(photos, d) {
					if (d) {
						var index = -1

						photos.forEach(function(photo, i) {
							if (photo.meta.path == d.path) {
								index = i
							}
						})

						if (index >= 0) {
							photos.splice(index, 1)
						}
					}

					return photos
				}
			)
			.map(function(photos) {
				return {
					photos: photos
				}
			})
	},

	componentDidMount: function() {

	},

	componentWillUnmount: function() {

	},

	render: function() {
		return h('div', null, this.state.photos.map(function(p, i) {
			return h(Photo, { key: p.meta.rev, src: p.data, meta: p.meta })
		}))
	}

})
