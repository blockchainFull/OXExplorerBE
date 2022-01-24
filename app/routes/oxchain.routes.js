// module.exports = app => {
    const oxchainstrans = require("../controllers/oxchain-transaction.controller.js");

    var router = require("express").Router();

    // Create a new oxchain
    router.post("/", oxchainstrans.createblock);

    // Retrieve all oxchainstrans
    router.get("/", oxchainstrans.findAll);

    // Retrieve all published oxchainstrans
    router.get("/published", oxchainstrans.findAllPublished);

    // Retrieve latest oxchain blocks
    router.get("/latestBlocks", oxchainstrans.findLatestBlocks);
    
    // Retrieve latest oxchain transactions
    router.get("/latestTransactions", oxchainstrans.findLatestTransactions);

    router.get("/getBlock/:blocknumber", oxchainstrans.findBlock);
    router.get("/getTrans/:transhash", oxchainstrans.findTrans);
    router.get("/getSearchResult/:searchinfo", oxchainstrans.findSearcResult);
    // app.use('/api/oxchainstrans', router);
//   };
module.exports = router;