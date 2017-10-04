var fs = require('fs');
var path = require('path');
var babel = require('babel-core');
var v1WebComponent = require('./babel-plugin-transform-es2015-V1wc/lib/index.js');

// read the filename from the command line arguments
var srcFileName = process.argv[2];
var ext = path.extname(srcFileName)
var baseName = srcFileName.slice(0,-ext.length);
var dstFileName = `${baseName}.es5${ext}`;

console.log('Reading from file:', srcFileName);

// read the code from this file
fs.readFile(srcFileName, function(err, data) {
  if(err) throw err;

  // convert from a buffer to a string
  var src = data.toString();

  // use our plugin to transform the source
  var out = babel.transform(src, {
    plugins: [
      v1WebComponent
    ],
    presets: [
      ["es2015", {"loose": true,"modules": false}]
    ]
  });


  console.log('Writing to file:', dstFileName);
  fs.writeFileSync(dstFileName, out.code);

  // print the generated code to screen
  //console.log(out);
});
