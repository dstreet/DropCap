/*!
 * Authorize View
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

var React     = require('react/addons')
var uiIntents = require('../intents/ui')

var h = React.createElement

module.exports = React.createClass({

	displayName: 'Authorize',

	componentDidMount: function() {
		uiIntents.set('authorize', React.findDOMNode(this.refs.auth), 'click')
	},

	render: function() {

		var styles = {

			container: {
				textAlign:       'center',
				padding:         20,
				marginTop:       100
			},

			heading: {
				color:           '#a8a198',
				fontSize:        20,
				marginBottom:    20
			},

			btn: {
				border:          '1px solid #2fd09e',
				borderRadius:    4,
				fontSize:        12,
				color:           '#2fd09e',
				backgroundColor: 'transparent',
				width:           '100%',
				height:          35,
				display:         'block',
				marginTop:       25,
				cursor:          'pointer',
			}

		}

		return (
			h('div', {
				style: styles.container
			}, [

				h('span', {
					style: styles.heading
				}, 'Welcome, Friend!'),

				h('button', {
					ref: 'auth',
					style: styles.btn
				}, 'Login to Dropbox and get started')

			])
		)
	}

})
