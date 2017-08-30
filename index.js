var utils = require("belty");
var mkdirp = require("mkdirp");
var path = require("path");
var convertSourceMap = require("convert-source-map");
var fs = require("fs");

function extractSourcemaps(options) {
  options = options || {};

  function extractit(bundle) {
    var settings = options[bundle.name] || options;
    settings = settings.options || settings;

    var filename = bundle.dest;
    var directory = path.dirname(filename);
    var basename = path.basename(filename);
    var sourceMapUrl = settings.sourceMapUrl || basename + ".map";
    var sourceMapDest = filename + ".map";
    var sourceMap = splitSourcemap(bundle);

    if (sourceMap.map) {
      mkdirp.sync(directory);
      fs.writeFileSync(sourceMapDest, sourceMap.map);

      var sourceMapComment = convertSourceMap.generateMapFileComment(sourceMapUrl);

      return bundle
        .setSourcemap(sourceMap.map)
        .setContent(sourceMap.code + sourceMapComment);
    }
  }

  function splitSourcemap(bundle) {
    var sourceMap = bundle.sourcemap;
    var bundleContent = bundle.content.toString();
    var converter = convertSourceMap.fromSource(bundleContent, true);

    if (converter) {
      sourceMap = converter.toJSON();
      bundleContent = convertSourceMap.removeComments(bundleContent);
    }

    return {
      map: sourceMap,
      code: bundleContent
    };
  }

  function postbundle(bundler, context) {
    return context.visitBundles(extractit);
  }

  return {
    postbundle: postbundle
  };
}


module.exports = extractSourcemaps;
