var path     = require('path')
var packager = require('electron-packager')
var config   = require('../config')

var opts = {
	'dir':       process.cwd(),
	'name':      config.app.name,
	'platform':  'darwin',
	'arch':      'x64',
	'version':   '0.30.2',
	'out':       path.join(process.cwd(), 'release'),
	'icon':      path.join(process.cwd(), 'icon.icns'),
	'bundle-id': config.app.identifier,
	'prune':     true,
	'overwrite': true,
	'asar':      true
}

console.log('==> Building release package...')
packager(opts, function(err, appPath) {
	if (err) {
		return console.error('Failed to package application')
	}

	console.log('Wrote package to', appPath)
})
