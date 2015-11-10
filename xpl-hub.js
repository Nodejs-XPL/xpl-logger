var Xpl = require("xpl-api");
var commander = require('commander');
var os = require('os');

commander.version(require("./package.json").version);

commander.option("--heapDump", "Enable heap dump (require heapdump)");

Xpl.fillCommander(commander);

commander.parse(process.argv);

configuration.hubSupport = true;

var xpl = new Xpl(commander);

xpl.on("error", function(error) {
  console.log("XPL error", error);
});

xpl.bind(function(error) {
  if (error) {
    console.error("Can not open xpl bridge ", error);
    process.exit(2);
    return;
  }

  console.log("Xpl-hub bind succeed ");
});

if (commander.headDump) {
  var heapdump = require("heapdump");
  console.log("***** HEAPDUMP enabled **************");
}
