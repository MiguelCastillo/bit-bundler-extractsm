var mkdirp = require("mkdirp");
var path = require("path");
var convertSourceMap = require("convert-source-map");
var fs = require("fs");

function extractSourcemaps(options) {
  options = options === false ? options : (options || {});

  function extractit(bundle) {
    if (!bundle.content) {
      return;
    }

    var settings = options === false || options[bundle.name] === false ? false : Object.assign({}, options[bundle.name] || options);
    var sourceMapResult = splitSourcemap(bundle);

    if (sourceMapResult.map) {
      if (settings === false) {
        return bundle.setContent(sourceMapResult.code);
      }
      else if (bundle.dest && typeof bundle.dest === "string") {
        var fileName = bundle.dest;
        var directory = path.dirname(fileName);
        var sourceMapUrl = (settings.sourceMapUrl || path.basename(fileName)) + ".map";
        var sourceMapDest = fileName + ".map";

        mkdirp.sync(directory);
        fs.writeFileSync(sourceMapDest, sourceMapResult.map);
        return bundle.setContent(sourceMapResult.code + convertSourceMap.generateMapFileComment(sourceMapUrl) + "\n");
      }
    }
  }

  function splitSourcemap(bundle) {
    var sourceMap;
    var bundleContent = bundle.content.toString();
    var converter = convertSourceMap.fromSource(bundleContent);

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
    return context.updateBundles(extractit);
  }

  return {
    postbundle: postbundle
  };
}


module.exports = extractSourcemaps;
