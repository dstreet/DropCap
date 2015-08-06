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
var uiIntents        = require('../intents/ui')

var h = React.createElement
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

var photosCache = []

module.exports = React.createClass({

	displayName: 'PhotoList',

	mixins: [StateStreamMixin],

	getInitialState: function() {
		return {
			photos: []
		}
	},

	componentWillMount: function() {
		if (!photosCache.length) {
			require('../stores/photos').fetch(this.props.token)
		} else {
			this.setState({
				photos: photosCache
			})
		}
	},

	getStateStream: function() {
		return photoStream
			.scan(photosCache, function(acc, p) {
				return acc.concat(p)
			})
			// Strip out any photos that have been deleted
			.combineLatest(
				uiIntents.get('deletePhoto').map(function(n) { return n.data }).startWith(null),
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
				return photos.sort(function(a, b) {
					var aDate = new Date(a.meta.modified)
					var bDate = new Date(b.meta.modified)

					return bDate - aDate
				})
			})
			.map(function(photos) {
				photosCache = photos

				return {
					photos: photos
				}
			})
	},

	render: function() {

		var photos = this.state.photos.map(function(p, i) {
			return h(Photo, { key: p.meta.rev, src: p.data, meta: p.meta })
		})

		return (
			h('div', {
				style: this.props.style
			}, [
				h(ReactCSSTransitionGroup, { transitionName: 'photo' }, photos)
			])
		)
	}

})
