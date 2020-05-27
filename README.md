# @coreyfarrell/mpm

Mapped Package Manager Experiment


## Usage

Run `npm install` to install dependencies and build the ESM/CJS loader bundles.

Run `npm test` to use `mpm` to install dependencies for the `demo` directory and test it.


## Why not import maps?

### Inheritance of scopes

Node.js should not allow any package to directly import/require dependencies unless they are
declared in the local package.json.

Import Maps explicitly call for [inheritance of scopes](https://github.com/WICG/import-maps#scope-inheritance).
This means the local package.json could have a dependency which masks the error which should occur when a
deep dependency is missing.  For example:

* you locally depend on `package1@2.0.0` and `package2@1.0.0`.
* `package2@1.0.0` uses and is tested against `package1@1.0.0` but does not declare any `package1` dependency

`mpm` calls for this situation to produce a resolution error when `package2` tries to import `package1`.
Import maps would cause `package2@1.0.0` to incorrectly inherit the `package1 => package1@2.0.0` resolution
and potentially produce unclear runtime errors caused by use of an incompatible version.


### Conditional exports

Node.js supports conditional exports where import maps do not.  This is an essential feature
to some modules and the condition to use determined per `import` or `require` at runtime.
I don't believe import maps can support dynamic conditions.


### Decentralized mapping

Import maps are declared at the application level only.  I believe that to actually be
compliant with what is proposed for import maps would require the package manager to
compile a complete import map for the entire application.  This is somewhat related to
conditional exports but even for non-conditional exports I believe the global import map
would need to provide mappings for every `exports` declaration of every package in the
dependency tree.

The goal of this proposed scheme is that `mappings.json` only provides a link to package
level mappings.  Once the package directory is found the normal node.js resolution would
continue by reading `exports` or `main` from `package.json` of the target package.


## Environment

The `install.js` script responds to `process.env.DO_FETCH === '0'`.  Setting this will
prevent download of actual packages, only generating `node_modules/mappings.json`.  This
is left over from earlier experimentation and should not be used as it does not produce a
functional install


## Known issues / limitations

* The `--experimental-loader` flag needs to be specified manually
* `node_modules/.bin` is not created
* Bundled dependencies have not been tested, some broken edges likely exist in this area.

The goal is not to create a fully functional package manager but to show a proof of
concept for `node_modules` to never contain multiple copies of any package version.
