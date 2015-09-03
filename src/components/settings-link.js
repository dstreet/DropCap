/*!
 * Settings Link
 * ~~~~~~~~~~~~~~~~~~~~~~~
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

var React = require('react/addons')

var h = React.createElement

module.exports = React.createClass({

	displayName: 'Settings Checkbox',

	propTypes: {
		label: React.PropTypes.string.isRequired,
		enabled: React.PropTypes.bool,
		onChange: React.PropTypes.func
	},

	getDefaultProps: function() {
		return {
			enabled: false,
			onChange: function() {}
		}
	},

	render: function() {

		var styles = {

			container: {
				borderBottom:    '1px solid #ccc3bc',
				padding:         '15px 0',
				marginLeft:      10,
				position:        'relative',
				cursor:          'pointer'
			},

			label: {
				color:           '#2fd09e',
				fontSize:        14,
				marginLeft:      -10
			},

		}

		return (
			h('div', {
				style: styles.container,
				onClick: this.props.onClick
			}, [

				h('span', {
					style: styles.label
				}, this.props.label),
			])
		)

	}

})