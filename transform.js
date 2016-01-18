const staticModule = require('static-module')
const stream = require('readable-stream')
const sheetify = require('./')
const path = require('path')
const fs = require('fs')
const resolve = require('resolve')
const pump = require('pump')
const fromString = require('from2-string')

module.exports = transform

function transform (filename, options) {
  const basedir = path.dirname(filename)
  const vars = {
    __filename: filename,
    __dirname: basedir,
    require: { resolve: resolver }
  }

  options = options || {}
  if (options.vars) {
    Object.keys(options.vars).forEach(function (key) {
      vars[key] = options.vars[key]
    })
  }

  const sm = staticModule(
    { sheetify: staticSheetify },
    { vars: vars, varModules: { path: path } }
  )

  return sm

  function staticSheetify (sheetFilename, sheetOptions) {
    sheetOptions = sheetOptions || {}
    sheetOptions.basedir = sheetOptions.basedir || basedir

    const pts = stream.PassThrough()

    sheetify(sheetFilename, sheetOptions, function (err, css, uuid) {
      if (err) { return sm.emit('error', err) }

      const sheetStream = fromString([
         "((require('insert-css')(" + JSON.stringify(css) + ")",
         " || true) && ",
         JSON.stringify(uuid),
         ")"
      ].join(''))
      pump(sheetStream, pts)
      sm.emit('file', path.join(basedir, sheetFilename))
    })

    return pts
  }

  function resolver (p) {
    return resolve.sync(p, { basedir: path.dirname(filename) })
  }
}
