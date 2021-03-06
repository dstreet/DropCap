/*!
 * Settings View
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

var React            = require('react/addons')
var SettingsCheckbox = require('../components/settings-checkbox')
var SettingsLink     = require('../components/settings-link')
var uiIntents        = require('../intents/ui')
var navIntents       = require('../intents/navigation')
var settings         = require('../stores/settings')

var h = React.createElement

module.exports = React.createClass({

	displayName: 'Settings',

	componentWillMount: function() {
		this.setState(settings.getAll())
	},

	componentDidMount: function() {
		uiIntents.set('quit',        React.findDOMNode(this.refs.quit),        'click')
		uiIntents.set('deauthorize', React.findDOMNode(this.refs.deauthorize), 'click')
	},

	onChange: function(item, val) {
		var state = {}

		state[item] = val
		this.setState(state, function() {
			settings.set({
				item: item,
				value: val
			})
		}.bind(this))
	},

	onLinkClick: function(view) {
		navIntents.route(view)
	},

	render: function() {

		var styles = {

			deauthorize: {
				border:          '1px solid #ed4559',
				borderRadius:    4,
				fontSize:        12,
				color:           '#ed4559',
				backgroundColor: 'transparent',
				width:           '100%',
				height:          35,
				display:         'block',
				marginTop:       25,
				cursor:          'pointer'
			}

		}

		return (
			h('div', {
				style: {
					padding: 25,
					boxSizing: 'border-box'
				}
			}, [
				h(SettingsCheckbox, {
					label: 'Create share link automatically',
					enabled: this.state.autoShare,
					onChange: this.onChange.bind(this, 'autoShare'),
					key: 'autoShare'
				}),

				h(SettingsCheckbox, {
					label: 'Display relative time labels',
					enabled: this.state.relativeTime,
					onChange: this.onChange.bind(this, 'relativeTime'),
					key: 'relativeTime'
				}),

				h(SettingsCheckbox, {
					label: 'Launch at login',
					ref: 'launch',
					enabled: this.state.launch,
					onChange: this.onChange.bind(this, 'launch'),
					key: 'launch'
				}),

				h(SettingsLink, {
					label: 'Gobal Shortcuts',
					onClick: this.onLinkClick.bind(this, 'shortcuts'),
					key: 'shortcuts'
				}),

				h('button', {
					style: styles.deauthorize,
					ref: 'quit'
				}, 'Quit'),

				h('button', {
					style: styles.deauthorize,
					ref: 'deauthorize'
				}, 'Deauthorize Account')
			])
		)

	}

})