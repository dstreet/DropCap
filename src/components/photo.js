/*!
 * Photo Component
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

var React        = require('react')
var PublicToggle = require('../components/public-toggle')
var uiIntents    = require('../intents/ui')

var h = React.createElement

module.exports = React.createClass({

	displayName: 'Photo',

	isDragging: false,
	dragStart: 0,
	deletePos: 100,
	willDelete: false,

	getInitialState: function() {
		return {
			left: 0
		}
	},

	componentDidMount: function() {
		uiIntents.set('deletePhoto', React.findDOMNode(this.refs.delete), 'click', this.props.meta)
	},

	onMouseDown: function(e) {
		this.isDragging = true
		this.dragStart = e.clientX - this.state.left

		document.addEventListener('mouseout', this.onMouseOut)
	},

	onMouseMove: function(e) {
		if (!this.isDragging) return

		var delta = e.clientX - this.dragStart

		this.setState({
			left: delta * 0.5
		})

		if (delta < this.deletePos) {
			this.willDelete = false
		} else {
			this.willDelete = true
		}
	},

	onMouseUp: function(e) {
		var state = {}

		if (this.willDelete) {
			state.left = this.deletePos
		} else {
			state.left = 0
		}

		this.isDragging = false
		this.setState(state)

		document.removeEventListener('mouseout', this.onMouseOut)
	},

	onMouseOut: function(e) {
		if (e.clientX >= window.outerWidth || e.clientX <= 0) {
			this.onMouseUp()
		}
	},

	render: function() {
		var styles = {
			container: {
				width:               '100%',
				height:              92,
				position:            'relative',
				overflow:            'hidden'
			},

			photo: {
				position:            'absolute',
				left:                this.state.left,
				width:               '100%',
				height:              '100%'
			},

			delete: {
				position:            'absolute',
				width:               this.state.left,
				height:              '100%',
				backgroundColor:     'tomato',
				color:               '#fff',
				border:              'none',
				WebkitUserSelect:    'none',
				cursor:              'pointer'
			},

			thumb: {
				backgroundImage:     'url(' + this.props.src + ')',
				backgroundColor:     '#fff',
				backgroundSize:      'cover',
				backgroundRepeat:    'norepeat',
				backgroundPositionY: '50%',
				WebkitMask:          'url(img/mask.svg) top left / cover',
				maskSourceType:      'alpha',
				width:               230,
				height:              '100%',
				display:             'inline-block',
				cursor:              'pointer'
			},

			meta: {
				height:              '100%',
				display:             'inline-block',
				position:            'absolute',
				top:                 0
			}
		}

		return (
			h('div', {
				style: styles.container,
				onMouseMove: this.onMouseMove,
				onMouseUp: this.onMouseUp }, [

				// Delete button
				h('button', {
					style: styles.delete,
					ref: 'delete'
				}, 'Delete'),

				// Photo wrapper
				h('div', {
					style: styles.photo
				}, [

					// Thumbnail
					h('div', {
						style: styles.thumb,
						onMouseDown: this.onMouseDown
					}),

					// Metadata
					h('div', {
						style: styles.meta
					}, [
						h(PublicToggle)
					])

				])
			])
		)
	}

})
