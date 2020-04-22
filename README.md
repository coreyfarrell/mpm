# @coreyfarrell/mpm

Mapped Package Manager Experiment


## Usage

Run `npm install` to install dependencies and build the ESM/CJS loader bundles.

Enter the `demo` directory then run:
```sh
npm run install
npm test
```

Note `npm run install`, not `npm install`.

The `--experimental-loader` flag needs to be specified manually and `bin` executables are
not linked to `node_modules/.bin` by the `install.js` script.  The goal is not to provide
a fully functional package manager but to show a proof of concept for `node_modules`
to never duplicate any modules.  Bundled dependencies have not been tested, some broken
edges likely exist in this area.


### Environment

The `install.js` script responds to `process.env.DO_FETCH === '0'`.  Setting this will
prevent download of actual packages, only generating `node_modules/mappings.json`.
