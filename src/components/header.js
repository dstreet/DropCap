/*!
 * Header Component
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

var React     = require('react/addons')
var uiIntents = require('../intents/ui')

var h = React.createElement

module.exports = React.createClass({

	displayName: 'Header',

	componentDidMount: function() {
		uiIntents.set('capture', React.findDOMNode(this.refs.capture), 'click')
		uiIntents.set('settings', React.findDOMNode(this.refs.settings), 'click')
	},

	render: function() {

		var styles = {

			container: {
				height:     60,
				background: 'rgba(255, 255, 255, 0.9)'
			}

		}

		return (
			h('div', {
				style: styles.container
			}, [
				h('button', { ref: 'capture' }, 'Capture'),
				h('button', { ref: 'settings' }, 'Settings')
			])
		)

	}

})
