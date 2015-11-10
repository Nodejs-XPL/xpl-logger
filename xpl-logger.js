var Xpl = require("xpl-api");
var commander = require('commander');
var os = require('os');

commander.version(require("./package.json").version);
commander.option("--head", "Describe header");
commander.option("--body", "Describe body");

commander.option("--heapDump", "Enable heap dump (require heapdump)");

Xpl.fillCommander(commander);

commander.parse(process.argv);

if (commander.headDump) {
  var heapdump = require("heapdump");
  console.log("***** HEAPDUMP enabled **************");
}

if (!commander.xplSource) {
  var hostName = os.hostname();
  if (hostName.indexOf('.') > 0) {
    hostName = hostName.substring(0, hostName.indexOf('.'));
  }

  commander.xplSource = "logger." + hostName;
}

commander.promiscuousMode = true;
commander.keepMessageOrder = true;

var dateFormat = "dd/mm/yyyy HH:MM:ss.l";

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

  console.log("Xpl bind succeed ");
});

xpl.on("message", function(message, address, packet) {
  var msg = DateFormat(dateFormat, new Date());

  msg += " [" + +"/" + message.bodyName + ": " + message.head.source + " -> " +
      message.head.target;

  var order = message.body.$order;
  if (order) {
    msg += " ";
    for (var i = 0; i < order.length; i++) {
      if (i) {
        msg += "/";
      }

      msg += message.body[order[i]];
    }
  }

  console.log(msg);
});

if (commander.headDump) {
  var heapdump = require("heapdump");
  console.log("***** HEAPDUMP enabled **************");
}
