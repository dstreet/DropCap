DropCap
=======

Electron app to take and sync screen captures with Dropbox. App will
automatically make shareable links and copy the link to your clipboard for fast
and easy sharing.

![DropCap](/screenshot.png?raw=true)

## Usage

Download the [latest release](https://github.com/dstreet/DropCap/releases) for
your OS. Unpackage the app, and run!

## Contributing and/or Redistributing

Please read the
[contributing guidelines](/CONTRIBUTING.md)
prior to submitting an issue or pull request

### Setup

1. First, you must
   [create an app](https://www.dropbox.com/developers/apps/create) in Dropbox.
2. Copy `config.sample.js` to `config.js`, and add your Dropbox app key to the
   config.
3. Install dependencies: `npm install`

### Running

`npm start`

### Building for Release

`npm run build`

## Copyright

Copyright (c) 2015 David Street

## License

GNU General Public License v3
