# sheetify
<img
  alt="sheetify logo"
  height="100"
  style="max-width: 100%"
  data-canonical-src="https://github.com/sheetify/logo"
  src="https://raw.githubusercontent.com/sheetify/logo/master/512v6.png">

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![Downloads][downloads-image]][downloads-url]
[![js-standard-style][standard-image]][standard-url]

Modular CSS bundler for browserify. Works with [npm](http://npmjs.org/) modules
like [browserify](http://browserify.org/) does.

## Features
- rich plugin ecosystem
- namespaced CSS modules using browserify
- tiny API surface

## Example
Given some inline CSS:
```js
const vdom = require('virtual-dom')
const hyperx = require('hyperx')
const sf = require('sheetify')
const hx = hyperx(vdom.h)

const prefix = sf`
  h1 {
    text-align: center;
  }
`

const tree = hx`
  <section className=${prefix}>
    <h1>My beautiful, centered title</h1>
  </section>
`

document.body.appendChild(vdom.create(tree))
```

Compile with browserify using `-t sheetify`:
```sh
$ browserify -t sheetify/transform index.js > bundle.js
```

## External files
To include an external CSS file you can pass a path to sheetify as
`sheetify('./my-file.css')`:
```js
const vdom = require('virtual-dom')
const hyperx = require('hyperx')
const sf = require('sheetify')
const hx = hyperx(vdom.h)

const prefix = sf('./my-styles.css')

const tree = hx`
  <section className=${prefix}>
    <h1>My beautiful, centered title</h1>
  </section>
`

document.body.appendChild(vdom.create(tree))
```

Compile with browserify using `-t [ sheetify/transform -u sheetify-cssnext ]`:
```sh
$ browserify -t [ sheetify/transform -u sheetify-cssnext ] index.js > bundle.js
```

## Write to separate file on disk
To write the compiled CSS to a separate file, rather than keep it in the
bundle:
```sh
$ browserify -t [ sheetify/transform -o bundle.css ] index.js > bundle.js
```

## Write to stream
To write the compiled CSS to a stream:
```js
const browserify = require('browserify')
const fs = require('fs')

const b = browserify(path.join(__dirname, 'transform/source.js'))
b.transform('sheetify', { out: fs.createWriteStream('/bundle.css') })
b.bundle().pipe(fs.createWriteStream('./bundle.js'))
```

## Plugins
Sheetify supports [plugins](#plugins) that take CSS and apply a transform.
For example include
[sheetify-cssnext](https://github.com/sheetify/sheetify-cssnext) to support
autoprefixing, variables and more:
```js
const vdom = require('virtual-dom')
const hyperx = require('hyperx')
const sf = require('sheetify')
const hx = hyperx(vdom.h)

const prefix = sf`
  h1 {
    transform: translate(0, 0);
  }
`

const tree = hx`
  <section className=${prefix}>
    <h1>My beautiful, centered title</h1>
  </section>
`

document.body.appendChild(vdom.create(tree))
```
Transforms the CSS into:
```css
h1 {
  -webkit-transform: translate(0, 0);
          transform: translate(0, 0);
}
```

The following plugins are available:
- [sheetify-cssnext](https://github.com/sheetify/sheetify-cssnext) - use
  tomorrow's CSS syntax today

## API
Browserify transforms accept either flags from the command line using
[subargs](https://github.com/substack/subarg):
```sh
$ browserify -t [ sheetify/transform -o bundle.css ] index.js > bundle.js
```
Or the equivalent options by passing in a configuration object in the
JavaScript API:
```js
const browserify = require('browserify')

const b = browserify(path.join(__dirname, 'transform/source.js'))
b.transform('sheetify', { out: __dirname + '/bundle.css' })
b.bundle().pipe(process.stdout)
```
The following options are available:
```txt
Options:
  -o, --out    Specify an output file
  -u, --use    Consume a sheetify plugin
```

## Installation
```sh
$ npm install sheetify
```

## License
[MIT](https://tldrlegal.com/license/mit-license)

[npm-image]: https://img.shields.io/npm/v/sheetify.svg?style=flat-square
[npm-url]: https://npmjs.org/package/sheetify
[travis-image]: https://img.shields.io/travis/sheetify/sheetify/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/sheetify/sheetify
[codecov-image]: https://img.shields.io/codecov/c/github/sheetify/sheetify/master.svg?style=flat-square
[codecov-url]: https://codecov.io/github/sheetify/sheetify
[downloads-image]: http://img.shields.io/npm/dm/sheetify.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/sheetify
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
