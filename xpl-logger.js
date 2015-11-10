var Xpl = require("xpl-api");
var commander = require('commander');
var os = require('os');
var DateFormat = require('dateformat');
var debug = require('debug')('xpl-logger');

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

  xpl.on("message", function(message, address, packet) {
    if (debug.enabled) {
      debug("message=", message);
    }

    var msg = DateFormat(new Date(), dateFormat);

    msg += " [" + message.headerName + "/" + message.bodyName + ": " +
        message.header.source + " -> " + message.header.target;

    var order = message.$order;
    if (order) {
      msg += " ";
      for (var i = 0; i < order.length; i++) {
        if (i) {
          msg += "/";
        }

        msg += message.body[order[i]];
      }
    }

    msg += "]";

    console.log(msg);

    if (commander.head) {
      console.log(message.headerName + ' {');
      for ( var n in message.header) {
        var v = message.header[n];
        console.log("  " + n + "=" + v);
      }
      console.log('}');
    }

    if (commander.body && order) {
      console.log(message.bodyName + ' {');
      for (var i = 0; i < order.length; i++) {
        console.log("  " + order[i] + "=" + message.body[order[i]]);
      }
      console.log('}');
    }
  });
});
if (commander.headDump) {
  var heapdump = require("heapdump");
  console.log("***** HEAPDUMP enabled **************");
}
