const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

const multiThread = (fn) => {
  if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    console.log(`Worker ${process.pid} started - ${new Date()}`);
    fn();
  }
};

module.exports = multiThread;
