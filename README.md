# DropCap

Electron app to take and sync screen captures with Dropbox. App will
automatically make shareable links and copy the link to your clipboard for
fast and easy sharing.

![DropCap](/screenshot.png?raw=true)

**Warning:** This is still a work in progress. Use at your own risk!

## Setup

1. First, you must create an app in Dropbox.
2. Copy `config.sample.js` to `config.js`, and add your Dropbox app key to the
   config.
3. Install Electron: `npm install -g electron-prebuilt`

## Running

`electron DropCap`

## Building for Release

`npm run build`

## Copyright

Copyright (c) 2015 David Street

## License

GNU General Public License v3
