/*!
 * Public/Private Toggle
 * ~~~~~~~~~~~~~~~~~~~~~
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

var React = require('react')

var h = React.createElement

module.exports = React.createClass({

	displayName: 'PublicToggle',

	onClick: function(which) {
		console.log(which, 'pressed')
	},

	render: function() {
		var styles = {

			container: {
				width:           75,
				height:          32,
				display:         'inline-block',
				borderRadius:    16,
				backgroundColor: 'rgba(255, 255, 255, 0.75)'
			},

			switch: {
				width:           22,
				height:          22,
				borderRadius:    '50%',
				backgroundColor: 'green',
				color:           '#fff',
				border:          'none'
			}

		}

		return (
			h('span', { style: styles.container }, [

				h('button', {
					key: 'private',
					style: styles.switch,
					onClick: this.onClick.bind(this, 'private')
				})

			])
		)
	}

})
