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
var uiIntents    = require('../intents/ui')
var extend       = require('extend')
var IconButton   = require('./icon-button')
var shell        = require('shell')

var h = React.createElement

module.exports = React.createClass({

	displayName: 'Photo',

	isDragging: false,
	dragStart: 0,
	deletePos: 75,
	willDelete: false,

	getInitialState: function() {
		return {
			left: 0
		}
	},

	componentDidMount: function() {
		uiIntents.set('deletePhoto', React.findDOMNode(this.refs.delete), 'click', this.props.meta)
		uiIntents.set('share', React.findDOMNode(this.refs.share), 'click', this.props.meta)
		uiIntents.set('preview', React.findDOMNode(this.refs.preview), 'click', this.props.meta)
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
				height:              50,
				position:            'relative',
				overflow:            'hidden',
				borderBottom:        '1px solid #fff',
				WebkitUserSelect:    'none',
				color:               '#847e79'
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
				background:          'linear-gradient(to right, #ed4559 90%, #a22134 100%)',
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
				width:               140,
				height:              '100%',
				display:             'inline-block',
				cursor:              'pointer'
			},

			meta: {
				height:              '100%',
				display:             'inline-block',
				position:            'absolute',
				top:                 0,
				paddingTop:          10,
				boxSizing:           'border-box',
				marginLeft:          -10
			},

			metaLabel: {
				display:             'inline-block',
				width:               30,
				fontWeight:          'bold'
			}
		}

		return (
			h('div', {
				style: styles.container,
				onMouseMove: this.onMouseMove,
				onMouseUp: this.onMouseUp
			}, [

				// Delete button
				h('button', {
					style: styles.delete,
					ref: 'delete'
				}, [
					h('img', { src: 'img/icon-trash.svg', width: 20 })
				]),

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
						h('div', null, [
							h('span', { style: styles.metaLabel }, 'Size'),
							h('span', null, this.props.meta.size)
						]),
						h('div', null, [
							h('span', { style: styles.metaLabel }, 'Date'),
							h('span', null, this.props.meta.modified.replace(/\s[0-9]+:[0-9]+:[0-9]+\s\+[0-9]+/, ''))
						])
					]),

					h('div', { style: {position: 'absolute', right: 10, top: 17} }, [
						h(IconButton, { img: 'img/icon-share.svg', hover: 'img/icon-share-active.svg', ref: 'share' }),
						h(IconButton, { img: 'img/icon-browser.svg', hover: 'img/icon-browser-active.svg', ref: 'preview' })
					])

				])
			])
		)
	}

})
