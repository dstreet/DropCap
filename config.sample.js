module.exports = {

	dropbox: {
		auth: {
			endpoint:          'https://www.dropbox.com/1/oauth2/authorize',
			type:              'token',
			redirectUri:       'http://localhost',
			appKey:            'your-app-key'
		},

		win: {
			width:              800,
			height:             600,
			show:               false,
			'node-integration': false
		}
	}

}
