/*!
 * Application Shell View
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

var React            = require('react/addons')
var Header           = require('../components/header')
var PhotoList        = require('./photo-list')
var Authorize        = require('./authorize')
var User             = require('../stores/user')
var StateStreamMixin = require('rx-react').StateStreamMixin

var h = React.createElement

module.exports = React.createClass({

	displayName: 'Application Shell',

	mixins: [StateStreamMixin],

	getInitalState: function() {
		return {
			token: null,
			authorized: false
		}
	},

	getStateStream: function() {
		return User.authorize
			.map(function(token) {
				return {
					token: token,
					authorized: token ? true : false
				}
			})
	},

	render: function() {

		var style = {
			width:        300,
			height:       450,
			marginLeft:   10,
			marginTop:    10,
			background:   'rgba(255, 255, 255, 0.9)',
			boxSizing:    'border-box',
			boxShadow:    '0 0 10px rgba(0, 0, 0, 0.6)',
			borderRadius: 10,
			overflow:     'hidden'
		}

		var photosStyle = {
			height:       390,
			overflowY:    'scroll'
		}

		var pointStyle = {
			position:     'absolute',
			top:          0,
			left:         '50%',
			marginLeft:   -10
		}

		var contentView = this.state.authorized ? h(PhotoList, { style: photosStyle, token: this.state.token }) : h(Authorize)

		return (
			h('div', {
				style: style
			}, [
				h('img', { src: 'img/point.svg', width: 20, height: 10, style: pointStyle }),

				h(Header),

				h(PhotoList, { style: photosStyle, token: this.state.token })

			])
		)

	}

})
