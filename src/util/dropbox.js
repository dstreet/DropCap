/*!
 * Dropbox Utility
 * ~~~~~~~~~~~~~~~
 *
 * Copyright (C) 2015 David Street
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

var https         = require('https')
var querystring   = require('querystring')
var remote        = require('remote')
var BrowserWindow = remote.require('browser-window');
var config        = remote.require('./config').dropbox

var token = null

module.exports = function() {

	var api = {

		/**
		 * Wrapper for Node's HTTPS request
		 *
		 * @param  {Object}   opts
		 * @param  {String}   enc
		 * @param  {*}        data
		 * @param  {Function} cb
		 * @private
		 */
		_sendRequest: function(opts, enc, data, cb) {
			data = data || ''

			var req = https.request(opts, function(res) {
				var data = ''

				res.setEncoding(enc)

				res.on('data', function(chunk) {
					data += chunk
				})

				res.on('end', function() {
					cb(null, {
						headers: res.headers,
						body: data
					})
				})
			})

			req.on('error', function(err) {
				cb(err)
			})

			req.write(data)
			req.end()
		},

		/**
		 * Build the authorization query
		 *
		 * @return {String}
		 * @private
		 */
		_getAuthQuery: function() {
			return '?' + querystring.stringify({
				'response_type': config.auth.type,
				'redirect_uri':  config.auth.redirectUri,
				'client_id':     config.auth.appKey,
			})
		},

		setToken: function(t) {
			token = t
		},

		/**
		 * Get the meta data for the root directory
		 *
		 * @param  {Function} cb [description]
		 */
		getMetaData: function(cb) {
			var opts = {
				hostname: 'api.dropbox.com',
				path: '/1/metadata/auto',
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + token
				}
			}

			api._sendRequest(opts, 'utf8', null, function(err, res) {
				if (err) {
					return cb(err)
				}

				cb(null, JSON.parse(res.body))
			})
		},

		/**
		 * Get the binary data and metadata of a particular file
		 *
		 * @param  {String}   path
		 * @param  {Function} cb
		 */
		getFile: function(path, cb) {
			var opts = {
				hostname: 'api-content.dropbox.com',
				path: '/1/files/auto' + path ,
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + token
				}
			}

			api._sendRequest(opts, 'binary', null, function(err, res) {
				if (err) {
					return cb(err)
				}

				cb(null, {
					meta: JSON.parse(res.headers['x-dropbox-metadata']),
					data: res.body
				})
			})
		},

		/**
		 * Delete a file
		 *
		 * @param  {String}   path
		 * @param  {Function} cb
		 */
		deleteFile: function(path, cb) {
			var data = querystring.stringify({
				root: 'auto',
				path: path
			})

			var opts = {
				hostname: 'api.dropbox.com',
				path: '/1/fileops/delete',
				method: 'POST',
				headers: {
					'Authorization': 'Bearer ' + token,
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': data.length
				}
			}

			api._sendRequest(opts, 'utf8', data, function(err, res) {
				if (err) {
					return cb(err)
				}

				cb(null, JSON.parse(res.body))
			})
		},

		/**
		 * Upload a file
		 *
		 * @param  {String}        path
		 * @param  {NativeImage}   fileData
		 * @param  {Function} cb
		 */
		uploadFile: function(path, file, cb) {
			var opts = {
				hostname: 'api-content.dropbox.com',
				path: '/1/files_put/auto/' + path ,
				method: 'PUT',
				headers: {
					'Authorization': 'Bearer ' + token,
					'Content-Type': 'image/png'
				}
			}

			api._sendRequest(opts, 'utf8', file, function(err, res) {
				if (err) {
					return cb(err)
				}

				cb(null, JSON.parse(res.body))
			})
		},

		/**
		 * Get a share link for a file
		 *
		 * @param  {String}   path
		 * @param  {Function} cb
		 */
		shareFile: function(path, cb) {
			var opts = {
				hostname: 'api.dropbox.com',
				path: '/1/shares/auto/' + path,
				method: 'POST',
				headers: {
					'Authorization': 'Bearer ' + token
				}
			}

			api._sendRequest(opts, 'utf8', null, function(err, res) {
				if (err) {
					return cb(err)
				}

				cb(null, JSON.parse(res.body))
			})
		},

		/**
		 * Start the OAuth2 flow
		 *
		 * @param  {Function} cb
		 */
		authorize: function(cb) {
			var win = new BrowserWindow(config.win)
			var url = config.auth.endpoint + api._getAuthQuery()

			win.loadUrl(url)
			win.show()

			win.webContents.on('crashed', function(e, code, desc) {
				cb(new Error('Render process crashed'))
			})

			win.webContents.on('did-get-redirect-request', function(e, oldUrl, newUrl) {
				var url = newUrl.replace(config.auth.redirectUri + '/#', '')
				var resObj = querystring.parse(url)

				cb(null, resObj)
				win.close()
			}.bind(this))
		}

	}

	return api
}
