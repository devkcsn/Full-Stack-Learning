const { log } = require("console");
const os = require("os");

//System Architecture------
console.log("Architecture:" ,os.arch());
//Platform os -------
console.log("Platform:" ,os.platform());
//Host name ---- 
console.log("Host Name" ,os.hostname());
//Total Memory -----
console.log("Total Memory" ,os.totalmem());
//Free memory ----
console.log("Free Memory" , os.freemem());
//Home Directory 
console.log("Home Directory" , os.homedir());
//System uptime
console.log("System Update" , os.uptime());
//CPU details-----
console.log("CPU information" ,os.cpus());
//Network interface 
console.log("Network Interface" , os.networkInterfaces());






