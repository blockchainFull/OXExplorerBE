const db = require("../models");
const oxchain = db.oxchains;
const oxchaintras = db.oxtrans;

// Create and Save a new oxchain
exports.createblock = (req, res) => {
    // console.log(req.body)
    // Validate request

    // Hash Duplicate Confirm
    // oxchain.findOne({hash: req.body.hash})
    //     .then(data => {
    //       if(data) {
    //         return "duplicate";
    //       } else {
            const newOxchain = new oxchain({
              number : req.body.number ,
              hash : req.body.hash ,
              parentHash : req.body.parentHash,
              nonce : req.body.sinonceze,
              sha3Uncles : req.body.sha3Uncles,
              logsBloom : req.body.logsBloom,
              transactionsRoot : req.body.transactionsRoot,
              stateRoot : req.body.stateRoot,
              miner : req.body.miner,
              difficulty : req.body.difficulty,
              totalDifficulty  : req.body.totalDifficulty,
              extraData : req.body.extraData,
              size : req.body.size,
              gasLimit: req.body.gasLimit,
              gasUsed : req.body.gasUsed,
              timestamp : req.body.timestamp,
              transactions : req.body.transactions,
              uncles : req.body.uncles
            });

            newOxchain
            .save()
            .then(data => {
                console.log("block added successfully!");
                return "success";
            })
            .catch(err => {
                // res.status(500).send({
                // message:
                //     err.message || "Some error occurred while creating the oxchain."
                // });
            });

          // }
        // })
        // .catch(err => {
        //   console.log(err);
        // });
};

// Create and Save a new oxchaintransaction
exports.createtransaction = (req, res) => {
  console.log("createtransaction called");
  // Validate request

  // // Hash Duplicate Confirm
  // oxchaintras.findOne({hash: req.body.hash})
  //     .then(data => {
  //       if(data) {
  //         return "duplicate";
  //       } else {
          const newOxchaintras = new oxchaintras({
            blockHash: req.body.blockHash,
            blockNumber:  req.body.blockNumber,
            from:  req.body.from, 
            gas:  req.body.gas,
            gasPrice:  req.body.gasPrice,
            hash:  req.body.hash,
            input:  req.body.input,
            nonce:  req.body.nonce,
            to:  req.body.to,
            transactionIndex: req.body.transactionIndex,
            value:  req.body.value,
            v: req.body.v,
            r: req.body.r,
            s: req.body.s
          });

          newOxchaintras
          .save()
          .then(data => {
            console.log("success");
              return "success";
          })
          .catch(err => {
              // res.status(500).send({
              // message:
              //     err.message || "Some error occurred while creating the oxchain."
              // });
          });
        // }
      // })
      // .catch(err => {
      //   console.log(err);
      // });
};

// Retrieve all oxchains from the database.

exports.getBlockCount = async () => {
  const result = (await oxchain.find());
  // console.log(result.length, "Here");
  return result.length;
};

exports.findAll = (req, res) => {
  const account = req.query.account;
  var condition = account ? { account: { $regex: new RegExp(account), $options: "i" } } : {};

  oxchain.find(condition)
    .then(data => {
    res.send(data);
    })
    .catch(err => {
    res.status(500).send({
        message:
        err.message || "Some error occurred while retrieving oxchains."
    });
    });
};

exports.findSearcResult = async (req, res) => {
  const searchinfo = req.params.searchinfo;
  var blockResult, transactionResult, t;
  if(!isNaN(searchinfo))
    blockResult = await oxchain.findOne({number: searchinfo});
  t = await oxchain.findOne({hash: searchinfo});
  if(t)
    blockResult = t;
  if(!blockResult)
    blockResult = [];
  transactionResult = await oxchaintras.findOne({hash: searchinfo});
  if(transactionResult)
    transactionResult = [transactionResult];
  t = await oxchaintras.find( { $or: [ {from : searchinfo } ,{ to: searchinfo } ] }).sort({createdAt: "desc"}).limit(10);
  if(Object.keys(t).length > 0){
    transactionResult = t;
    console.log(t);
  }

  if(!transactionResult)
    transactionResult = [ ];
  result = { "block_result" : blockResult,
              "transaction_result" : transactionResult
            };
  res.send(result);
};

exports.findLatestBlocks = (req, res) => {
  oxchain.find().sort({number: "desc"}).limit(10)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
          message:
          err.message || "Some error occurred while retrieving oxchains."
      });
    });
};

exports.findLatestTransactions = (req, res) => {
  oxchaintras.find().sort({createdAt: "desc"}).limit(10)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
          message:
          err.message || "Some error occurred while retrieving oxchains."
      });
    });
};

// Find a single oxchain with an id
exports.findBlock = (req, res) => {
    const blocknumber = req.params.blocknumber;
    oxchain.findOne({number: blocknumber})
        .then(data => {
        if (!data)
            res.status(404).send({ message: "Not found oxchain with id " + id });
        else res.send(data);
        })
        .catch(err => {
        res
            .status(500)
            .send({ message: "Error retrieving oxchain with id=" + id });
    });
};

// Find a single oxchain with an id
exports.findTrans = (req, res) => {
  const transhash = req.params.transhash;

  oxchaintras.findOne({hash: transhash})
      .then(data => {
      if (!data)
          res.status(404).send({ message: "Not found oxchain with id " + id });
      else res.send(data);
      })
      .catch(err => {
      res
          .status(500)
          .send({ message: "Error retrieving oxchain with id=" + id });
      });
  };


// Update a oxchain by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }

    const id = req.params.id;

    oxchain.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update oxchain with id=${id}. Maybe oxchain was not found!`
          });
        } else res.send({ message: "oxchain was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating oxchain with id=" + id
        });
      });
  };

// Delete a oxchain with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    oxchain.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete oxchain with id=${id}. Maybe oxchain was not found!`
          });
        } else {
          res.send({
            message: "oxchain was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete oxchain with id=" + id
        });
      });
  };
// Delete all oxchains from the database.
exports.deleteAll = (req, res) => {
    oxchain.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} oxchains were deleted successfully!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all oxchains."
        });
      });
  };

// Find all published oxchains
exports.findAllPublished = (req, res) => {
    oxchain.find({ published: true })
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving oxchains."
        });
        });
};
