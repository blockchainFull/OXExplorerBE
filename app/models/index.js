const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.oxchains = require("./oxchain.model.js")(mongoose);
db.oxtrans = require("./oxchain.transmodel.js")(mongoose);

module.exports = db;
