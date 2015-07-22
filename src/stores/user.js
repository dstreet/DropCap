module.exports = function() {

	var api = {

		getToken: function() {
			return localStorage.getItem('token')
		},

		saveToken: function(token) {
			localStorage.setItem('token', token)
		},

		destroy: function() {

		}

	}

	return api

}
