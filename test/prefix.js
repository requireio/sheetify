const browserify = require('browserify')
const concat = require('concat-stream')
const test = require('tape')
const path = require('path')
const fs = require('fs')
const vm = require('vm')

const transform = require('../transform')
const sheetify = require('..')

test('prefix', function (t) {
  t.test('should return a prefix when called in Node', function (t) {
    t.plan(1)
    const prefix = sheetify('.foo { color: blue; }')
    t.equal(prefix, '_d1b3f246', 'prefix is equal')
  })

  t.test('should prefix and inline template strings', function (t) {
    t.plan(3)

    const expath = path.join(__dirname, 'fixtures/prefix-inline-expected.css')
    const expected = fs.readFileSync(expath, 'utf8').trim()

    const ws = concat(function (buf) {
      const res = String(buf).trim()
      t.equal(res, expected, 'css is equal')
    })

    const bOpts = { browserField: false }
    const bpath = path.join(__dirname, 'fixtures/prefix-inline-source.js')
    browserify(bpath, bOpts)
      .transform(transform)
      .plugin('css-extract', { out: outFn })
      .bundle(parseBundle)

    function outFn () {
      return ws
    }

    function parseBundle (err, src) {
      t.ifError(err, 'no error')
      const c = { console: { log: log } }
      vm.runInNewContext(src.toString(), c)

      function log (msg) {
        t.equal(msg, '_0081131d', 'echoes prefix')
      }
    }
  })

  t.test('should prefix and inline imported files', function (t) {
    t.plan(3)

    const expath = path.join(__dirname, 'fixtures/prefix-import-expected.css')
    const expected = fs.readFileSync(expath, 'utf8').trim()

    const ws = concat(function (buf) {
      const res = String(buf).trim()
      t.equal(res, expected, 'css is equal')
    })

    const bOpts = { browserField: false }
    const bpath = path.join(__dirname, 'fixtures/prefix-import-source.js')
    browserify(bpath, bOpts)
      .transform(transform)
      .plugin('css-extract', { out: outFn })
      .bundle(parseBundle)

    function outFn () {
      return ws
    }

    function parseBundle (err, src) {
      t.ifError(err, 'no error')
      const c = { console: { log: log } }
      vm.runInNewContext(src.toString(), c)

      function log (msg) {
        t.equal(msg, '_c284eb7d', 'echoes prefix')
      }
    }
  })

  t.test('should disable prefixing when global:true', function (t) {
    t.plan(1)

    const expath = path.join(__dirname, 'fixtures/prefix-global-expected.css')
    const expected = fs.readFileSync(expath, 'utf8').trim()

    const ws = concat(function (buf) {
      const res = String(buf).trim()
      t.equal(res, expected, 'css is equal')
    })

    const bOpts = { browserField: false }
    const bpath = path.join(__dirname, 'fixtures/prefix-global-source.js')
    browserify(bpath, bOpts)
      .transform(transform)
      .plugin('css-extract', { out: outFn })
      .bundle()

    function outFn () {
      return ws
    }
  })
})
