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
var Rx               = require('rx')
var Header           = require('../components/header')
var PhotoList        = require('./photo-list')
var PhotoHeader      = require('./photo-header')
var SettingsHeader   = require('./settings-header')
var Settings         = require('./settings')
var Authorize        = require('./authorize')
var User             = require('../stores/user')
var StateStreamMixin = require('rx-react').StateStreamMixin
var uiIntents        = require('../intents/ui')
var navIntents       = require('../intents/navigation')

window.nav = navIntents

var h = React.createElement

var navMap = {
	'photos':   [PhotoHeader, PhotoList],
	'settings': [SettingsHeader, Settings],
	'auth':     [PhotoHeader, Authorize]
}

module.exports = React.createClass({

	displayName: 'Application Shell',

	mixins: [StateStreamMixin],

	getStateStream: function() {
		return navIntents.stream.startWith('photos')
			.combineLatest(
				User.authorize,
				function(nav, token) {
					if (!token) {
						nav = 'auth'
					}

					return {
						token: token,
						authorized: token ? true : false,
						headerView: navMap[nav][0],
						contentView: navMap[nav][1]
					}
				}
			)
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

		var contentStyle = {
			height:       390,
			overflowY:    'scroll'
		}

		var pointStyle = {
			position:     'absolute',
			top:          0,
			left:         '50%',
			marginLeft:   -10
		}

		var headerStyle = {
			height:       60,
			background:   'rgba(47, 208, 158, 0.9)',
			textAlign:    'center',
			position:     'relative'
		}

		return (
			h('div', {
				style: style
			}, [
				h('img', {
					src: 'img/point.svg',
					width: 20,
					height: 10,
					style: pointStyle
				}),

				h('div', {
					style: headerStyle
				}, h(this.state.headerView)),

				h('div', {
					style: contentStyle
				}, h(this.state.contentView, { token: this.state.token }))

			])
		)

	}

})
