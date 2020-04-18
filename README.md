# @cfware/mpm

Mapped Package Manager Experiment

## Usage

Enter the `demo` directory and run `node ../install.js`.  This will create a `node_modules`
directory in the proposed layout.

### Environment

The `install.js` script responds to `process.env.DO_FETCH === '0'`.  Setting this will
prevent download of actual packages, only generating `node_modules/mappings.json`.
