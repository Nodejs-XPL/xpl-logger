var Xpl = require("xpl-api");
var commander = require('commander');
var os = require('os');

commander.version(require("./package.json").version);

commander.option("--command <command>", "Command");
commander.option("--device <device>", "Device");
commander.option("--current <current>", "Current");
commander.option("--bodyName <name>", "Body name");
commander.option("--target <target>", "Target");

Xpl.fillCommander(commander);

commander.parse(process.argv);

var xpl = new Xpl(commander);

xpl.on("error", function(error) {
  console.error("XPL error", error);
});

xpl.bind(function(error) {
  if (error) {
    console.error("Can not open xpl bridge ", error);
    process.exit(2);
    return;
  }

  console.log("Xpl-cmnd bind succeed ");
  
  xpl.sendXplCmnd({
    command: commander.command,
    device: commander.device,
    current: commander.current
    
  }, commander.bodyName || "delabarre.command", commander.target || "*", (error) => {
    
    if (error) {
      console.error("Command is not sent",error);
      return;
    }
    console.log("Command sent !");
  });
});
