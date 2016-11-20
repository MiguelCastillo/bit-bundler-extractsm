# bit-bundler-extractsm
[bit-bundler](https://github.com/MiguelCastillo/bit-bundler) plugin for extracting and writing source maps into their own file

# usage

## install

```
$ npm install bit-bundler-extractsm
```

## bit-bundler example with bit-bundler-minifyjs

``` javascript
var Bitbundler = require("bit-bundler");
var jsPlugin = require("bit-loader-js");
var minifyjs = require("bit-bundler-minifyjs");
var extractsm = require("bit-bundler-extractsm");

var bitbundler = new Bitbundler(
  loader: {
    plugins: [
      jsPlugin()
    ]
  },
  bundler: {
    plugins: [
      minifyjs(),
      extractsm()
    ]
  }
});

bitbundler.bundle({
  src: "in.js",
  dest: "out.js"
});
```
