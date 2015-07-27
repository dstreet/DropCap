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
			width:      400,
			height:     450,
			background: 'url(img/frame.svg) no-repeat',
			boxSizing:  'border-box',
			paddingTop: 20
		}

		var contentView = this.state.authorized ? h(PhotoList, { token: this.state.token }) : h(Authorize)

		return (
			h('div', {
				style: style
			}, [

				h(Header),

				contentView

			])
		)

	}

})
