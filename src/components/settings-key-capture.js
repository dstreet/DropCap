/*!
 * Settings Key Capture Input
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~
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

var keymap = {
	'alt':   { display: 'Alt',       accel: 'Alt' },
	'shift': { display: 'Shift',     accel: 'Shift' },
	'ctrl':  { display: 'Ctrl',      accel: 'Ctrl' },
	'meta':  { display: 'Cmd',       accel: 'Cmd' },

	187:     { display: 'Plus',      accel: 'Plus' },
	32:      { display: 'Space',     accel: 'Space' },
	8:       { display: 'Backspace', accel: 'Backspace' },
	46:      { display: 'Delete',    accel: 'Delete' },
	13:      { display: 'Return',    accel: 'Return' },
	38:      { display: 'Up',        accel: 'Up' },
	40:      { display: 'Down',      accel: 'Down' },
	37:      { display: 'Left',      accel: 'Left' },
	39:      { display: 'right',     accel: 'right' },
}

module.exports = React.createClass({

	displayName: 'Settings Key Capture',

	propTypes: {
		label: React.PropTypes.string.isRequired,
		defaultValue: React.PropTypes.string,
		onChange: React.PropTypes.func
	},

	getInitialState: function() {
		return {
			sequence: [],
			inFocus: false
		}
	},

	getDefaultProps: function() {
		return {
			defaultValue: '',
			onChange: function() {}
		}
	},

	componentDidMount: function() {
		this.setState({
			sequence: this.sequenceFromAccel(this.props.defaultValue)
		})
	},

	onFocus: function() {
		this.setState({ inFocus: true })
	},

	onBlur: function() {
		this.setState({ inFocus: false }, function() {
			this.props.onChange(this.getAccelerator())
		}.bind(this))
	},

	onKeyDown: function(e) {
		e.preventDefault()
		var sequence = []

		if (e.altKey) {
			sequence.push(keymap['alt'])
		}
		if (e.shiftKey) {
			sequence.push(keymap['shift'])
		}
		if (e.ctrlKey) {
			sequence.push(keymap['ctrl'])
		}
		if (e.metaKey) {
			sequence.push(keymap['meta'])
		} 
		if (e.keyCode) {
			if ((e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 48 && e.keyCode <= 57)) {
				sequence.push({
					display: String.fromCharCode(e.keyCode).toUpperCase(),
					accel: String.fromCharCode(e.keyCode).toUpperCase(),
				})
			}
		}

		this.setState({ sequence: sequence })
	},

	onKeyUp: function(e) {
		e.preventDefault()
		this.setState({ inFocus: false })
	},

	onChange: function() {
		this.props.onChange(!this.props.enabled)
	},

	getAccelerator: function() {
		return this.state.sequence.reduce(function(prev, cur) {
			if (prev != '') {
				return prev += '+' + cur.accel
			} else {
				return cur.accel
			}
		}, '')
	},

	sequenceFromAccel: function(accel) {
		var accelItems = accel.split('+')
		var sequence = []

		return accelItems.map(function(item) {
			return this.keyFromAccel(item)
		}.bind(this))
	},

	keyFromAccel: function(accel) {
		var foundKey = null
		for (var i = 0; i < keymap.length; i++) {
			var key = keymap[i]

			if (key.accel == accel) {
				foundKey = key
			}
		}

		if (foundKey) {
			return foundKey
		} else {
			return {
				display: accel,
				accel: accel
			}
		}
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

			input: {
				border:           '1px solid',
				borderColor:      this.state.inFocus ? '#2fd09e' : '#ccc3bc',
				width:            140,
				height:           25,
				boxSizing:        'border-box',
				WebkitAppearance: 'none',
				outline:          'none',
				borderRadius:     4,
				position:         'absolute',
				right:            0,
				padding:          5,
				display:          'inline-block'
			},

			sequenceItem: {
				backgroundColor: '#2fd09e',
				color:           '#fff',
				borderRadius:    2,
				padding:         '2px 5px',
				marginRight:     5
			}

		}

		var sequence = this.state.sequence.map(function(item) {
			return h('span', { style: styles.sequenceItem }, item.display)
		})

		return (
			h('div', {
				style: styles.container
			}, [

				h('span', {
					style: styles.label
				}, this.props.label),

				h('span', {
					tabIndex: 1,
					style: styles.input,
					onFocus: this.onFocus,
					onBlur: this.onBlur,
					onKeyDown: this.onKeyDown,
					onKeyUp: this.onKeyUp
				}, sequence)
			])
		)

	}

})