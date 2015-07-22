module.exports = {

	index: function() {
		return views.index({ title: 'index' })
	},

	foo: function() {
		return views.foo({ title: 'foo' })
	}

}