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

var React      = require('react/addons')
var uiIntents  = require('../intents/ui')
var IconButton = require('./icon-button')

var h = React.createElement

module.exports = React.createClass({

	displayName: 'Header',

	getInitialState: function() {
		return {
			view: 'capture',
			prevView: null
		}
	},

	componentDidMount: function() {
		this.setIntents()
	},

	componentDidUpdate: function() {
		this.setIntents()
	},

	setIntents: function() {
		if (this.refs.capture) {
			uiIntents.set('capture', React.findDOMNode(this.refs.capture), 'click')
		}

		if (this.refs.menu) {
			uiIntents.set('menu', React.findDOMNode(this.refs.menu), 'click')
		}

		if (this.refs.back) {
			uiIntents.set('back', React.findDOMNode(this.refs.back), 'click')
		}
	},

	onClickMenu: function() {
		this.setState({ view: 'settings', prevView: this.state.view })
	},

	onClickBack: function() {
		if (!this.state.prevView) return

		this.setState({ view: this.state.prevView, prevView: null })
	},

	render: function() {

		var styles = {

			container: {
				height:     60,
				background: 'rgba(47, 208, 158, 0.9)',
				textAlign:  'center',
				position:   'relative'
			},

			capture: {
				width:      34,
				height:     34,
				marginLeft: 0,
				marginTop:  12
			},

			back: {
				width:      20,
				height:     20,
				marginLeft: 0,
				position:   'absolute',
				left:       10,
				top:        20
			},

			menu: {
				width:      20,
				height:     20,
				marginLeft: 0,
				position:   'absolute',
				right:      10,
				top:        20
			},

			heading: {
				color:      '#fff',
				fontSize:   16,
				marginTop:  17,
				display:    'inline-block'
			}

		}

		var items = []

		if (this.state.view != 'capture') {
			items.push(
				h(IconButton, {
					img: 'img/icon-arrow-left.svg',
					style: styles.back,
					ref: 'back',
					key: 'back-btn',
					onClick: this.onClickBack
				})
			)
		}

		if (this.state.view == 'settings') {
			items.push(
				h('span', {
					style: styles.heading,
					key: 'heading',
				}, 'Settings')
			)
		} else {
			items.push(
				h(IconButton, {
					img: 'img/icon-capture.svg',
					style: styles.capture,
					ref: 'capture',
					key: 'capture-btn',
				})
			)
		}

		if (this.state.view == 'capture') {
			items.push(
				h(IconButton, {
					img: 'img/icon-menu.svg',
					style: styles.menu,
					ref: 'menu',
					key: 'menu-btn',
					onClick: this.onClickMenu
				})
			)
		}

		return (
			h('div', {
				style: styles.container
			}, items)
		)

	}

})
