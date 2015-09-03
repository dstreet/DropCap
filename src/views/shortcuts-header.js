/*!
 * Shortcuts Header
 * ~~~~~~~~~~~~~~~~
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
var navIntents = require('../intents/navigation')

var h = React.createElement

module.exports = React.createClass({

	displayName: 'Shortcuts Header',

	onClickBack: function() {
		navIntents.back()
	},

	render: function() {

		var styles = {
			back: {
				width:      20,
				height:     20,
				marginLeft: 0,
				position:   'absolute',
				left:       10,
				top:        20
			},

			heading: {
				color:      '#fff',
				fontSize:   16,
				marginTop:  17,
				display:    'inline-block'
			}
		}

		return (
			h('div', null, [
				h(IconButton, {
					img: 'img/icon-arrow-left.svg',
					style: styles.back,
					ref: 'back',
					key: 'back-btn',
					onClick: this.onClickBack
				}),

				h('span', {
					style: styles.heading,
					key: 'heading',
				}, 'Shortcuts')
			])
		)

	}
})