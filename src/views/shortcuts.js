/*!
 * Shorcuts View
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

var React               = require('react/addons')
var SettingsCheckbox    = require('../components/settings-checkbox')
var SettingsKeyCapture  = require('../components/settings-key-capture')
var uiIntents           = require('../intents/ui')
var navIntents          = require('../intents/navigation')
var settings            = require('../stores/settings')

var h = React.createElement

module.exports = React.createClass({

	displayName: 'Shorcuts',

	componentWillMount: function() {
		this.setState(settings.getAll())
	},

	onChange: function(item, val) {
		var state = {}

		state[item] = val
		this.setState(state, function() {
			console.log(this.state)
		}.bind(this))
	},

	onSave: function(view) {
		settings.set({
			item: 'shortcutOpen',
			value: this.state.shortcutOpen
		})

		settings.set({
			item: 'shortcutCapture',
			value: this.state.shortcutCapture
		})

		navIntents.back()
	},

	render: function() {

		var styles = {
			save: {
				border:          '1px solid #2fd09e',
				borderRadius:    4,
				fontSize:        12,
				color:           '#2fd09e',
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
				h(SettingsKeyCapture, {
					label: 'Open Window',
					defaultValue: this.state.shortcutOpen,
					onChange: this.onChange.bind(this, 'shortcutOpen'),
					key: 'shortcutOpen'
				}),

				h(SettingsKeyCapture, {
					label: 'Capture',
					defaultValue: this.state.shortcutCapture,
					onChange: this.onChange.bind(this, 'shortcutCapture'),
					key: 'shortcutCapture'
				}),

				h('button', {
					style: styles.save,
					ref: 'save',
					onClick: this.onSave.bind(this)
				}, 'Save'),
			])
		)

	}

})