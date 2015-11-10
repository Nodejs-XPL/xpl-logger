var Xpl = require("xpl-api");
var commander = require('commander');
var os = require('os');

commander.version(require("./package.json").version);

commander.option("--heapDump", "Enable heap dump (require heapdump)");

Xpl.fillCommander(commander);

commander.parse(process.argv);

if (commander.headDump) {
  var heapdump = require("heapdump");
  console.log("***** HEAPDUMP enabled **************");
}
