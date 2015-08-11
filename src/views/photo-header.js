/*!
 * Photo Header
 * ~~~~~~~~~~~~
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

var React      = require('react/addons')
var IconButton = require('../components/icon-button')
var uiIntents  = require('../intents/ui')
var navIntents = require('../intents/navigation')

var h = React.createElement

module.exports = React.createClass({

	displayName: 'PhotoHeader',

	componentDidMount: function() {
		uiIntents
			.set('capture', React.findDOMNode(this.refs.capture), 'click')
	},

	onClickMenu: function() {
		navIntents.route('settings')
	},

	render: function() {

		var styles = {
			capture: {
				width:      34,
				height:     34,
				marginLeft: 0,
				marginTop:  12
			},

			menu: {
				width:      20,
				height:     20,
				marginLeft: 0,
				position:   'absolute',
				right:      10,
				top:        20
			},
		}

		return (
			h('div', null, [
				h(IconButton, {
					img: 'img/icon-capture.svg',
					style: styles.capture,
					ref: 'capture',
					key: 'capture-btn',
				}),

				h(IconButton, {
					img: 'img/icon-menu.svg',
					style: styles.menu,
					ref: 'menu',
					key: 'menu-btn',
					onClick: this.onClickMenu
				})
			])
		)

	}
})