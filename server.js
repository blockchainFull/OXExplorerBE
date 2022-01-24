const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const oxchains = require("./app/controllers/oxchain-transaction.controller.js");


// require("./app/routes/oxchain.routes")(app);

var corsOptions = {
  origin: "http://127.0.0.1:8081"
};

// simple route
app.use('/api/oxchains', require('./app/routes/oxchain.routes'));


app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to oxbackend." });
});

// set port, listen for requests
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const db = require("./app/models");
const { resourceLimits } = require("worker_threads");
const { clearInterval } = require("timers");

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

const Web3 = require("web3");
const web3 = new Web3('http://34.230.139.41:8545');

var countofdbblocks = -1;
var intervalVar =  setInterval(buildDatabase, 5000);

async function buildDatabase() {
  clearInterval(intervalVar)
  blockcount = await web3.eth.getBlockNumber();
  if(countofdbblocks == -1)
    countofdbblocks = await oxchains.getBlockCount();
  console.log(blockcount+1 + "/" + countofdbblocks);
  if(blockcount > countofdbblocks)
  {
    blockinfo = await web3.eth.getBlock(countofdbblocks);
    // console.log(blockinfo);
    var req = [];
    req.body = blockinfo;
    const res = await oxchains.createblock(req);
    console.log("Transaction count:" + blockinfo.transactions.length);
  // console.log(blockinfo.transactions);
    for(let iter in blockinfo.transactions) {
      // console.log(blockinfo.transactions[iter]);
      var trans = await web3.eth.getTransaction(blockinfo.transactions[iter]);
      console.log(trans);
      var req = [];
      req.body = trans;
      await oxchains.createtransaction(req);
    }
    countofdbblocks ++;
  }
  intervalVar =  setInterval(buildDatabase, 5000);
}

function isJson(str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}
