/*!
 * Icon Button Component
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

var React  = require('react')
var extend = require('extend')

var h = React.createElement

var DEFAULT_STYLES = {
	width:      15,
	height:     15,
	border:     'none',
	outline:    'none',
	marginLeft: 10,
	cursor:     'pointer'
}

module.exports = React.createClass({

	displayName: 'IconButton',

	propTypes: {
		img: React.PropTypes.string.isRequired,
		hover: React.PropTypes.string
	},

	getInitialState: function() {
		return {
			hovered: false
		}
	},

	onMouseEnter: function() {
		this.setState({ hovered: true })
	},

	onMouseLeave: function() {
		this.setState({ hovered: false })
	},

	render: function() {

		var img = this.props.hover && this.state.hovered ? this.props.hover : this.props.img

		var style = extend(true, {}, DEFAULT_STYLES, {
			background: 'transparent url(' + img + ') no-repeat'
		}, this.props.style)

		return (
			h('button', { style: style, onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave })
		)
	}

})