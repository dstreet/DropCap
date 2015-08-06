/*!
 * Settings Item
 * ~~~~~~~~~~~~~
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

	displayName: 'Setting Item',

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

	onChange: function() {
		this.props.onChange(!this.props.enabled)
	},

	render: function() {

		var styles = {

			container: {
				borderBottom:    '1px solid #ccc3bc',
				padding:         '15px 0',
				marginLeft:      10,
				position:        'relative'
			},

			label: {
				color:           '#a8a198',
				fontSize:        14,
				marginLeft:      -10
			},

			checkbox: {
				border:           '1px solid',
				borderColor:      this.props.enabled ? '#2fd09e' : '#ccc3bc',
				width:            15,
				height:           15,
				WebkitAppearance: 'none',
				outline:          'none',
				borderRadius:     4,
				position:         'absolute',
				right:            0,
				background:       this.props.enabled ? '#2fd09e url(img/check.svg) no-repeat' : null
			}

		}

		return (
			h('div', {
				style: styles.container
			}, [

				h('span', {
					style: styles.label
				}, this.props.label),

				h('input', {
					type: 'checkbox',
					style: styles.checkbox,
					onChange: this.onChange,
					defaultChecked: this.props.enabled
				})
			])
		)

	}

})