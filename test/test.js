var cluster = require('cluster');
var http = require('http');
var numReqs = 0;

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < 4; i++) {
    var worker = cluster.fork();

    worker.on('message', function(msg) {
      if (msg.cmd && msg.cmd == 'notifyRequest') {
        numReqs++;
        console.log(msg.id);
      }
    });
  }
/*
  setInterval(function() {
    console.log("numReqs =", numReqs);
  }, 1000); */
} else {
  // Worker processes have a http server.
  http.Server(function(req, res) {
    console.log(this);
    res.writeHead(200);
    res.end("hello world\n");
    // Send message to master process
    process.send({ cmd: 'notifyRequest', id: process.pid });
  }).listen(8000);
}