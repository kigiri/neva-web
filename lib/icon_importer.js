var path = require("path");
var fs = require("fs");
var dir = path.resolve(__dirname, "..");
var toDir = path.join.bind(path, dir);
var libDir = toDir("app/lib/icon");
var svgPattern = "^ic_(.+)_48px\.svg$";

function mkdirp(dir, cb) {
  fs.stat(dir, function (err, struct) {
    if (!err) { return cb(null) }
    if (err.code === 'ENOENT') {
      return fs.mkdir(dir, cb);
    }
    return console.error(err);
  });
}

function copy(source, target, cb) {
  var rd, wr;

  rd = fs.createReadStream(source);
  rd.on("error", cb);

  wr = fs.createWriteStream(target);
  wr.on("error", cb);
  return rd.pipe(wr);
}

function copyAllSvg(svgDir) {
  fs.readdir(svgDir, function (err, files) {
    if (err) { return console.error(err) }
    files.forEach(function (file) {
      var newName = (file.match(svgPattern) || [])[1];
      if (!newName) { return }
      copy(path.join(svgDir, file), path.join(libDir, newName +".svg"),
        console.error.bind(console, "Error with file :"+ file));
    })
  })
}

mkdirp(libDir, function (err) {
  if (err) { return console.log(err) }
  var base = toDir("node_modules/material-design-icons");
  fs.readdir(base, function (err, files) {
    files.forEach(function (file) {
      file = path.resolve(base, file, "svg/production");
      fs.stat(file, function (err, stats) {
        if (stats && stats.isDirectory()) {
          copyAllSvg(file);
        }
      })
    })
  })
});
