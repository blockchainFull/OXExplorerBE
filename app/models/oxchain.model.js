module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        number: Number,
        hash: String,
        parentHash : String,
        nonce : String,
        sha3Uncles : String,
        logsBloom: String,
        transactionsRoot  : String,
        stateRoot  : String,
        miner : String,
        difficulty  : String,
        totalDifficulty  : String,
        extraData  : String,
        size  : Number,
        gasLimit  : Number,
        gasUsed  : Number,
        timestamp  : Number,
        transactions  : Array,
        uncles  : Array
      },
      { timestamps: true }
    );

    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });

    const oxchain = mongoose.model("oxchainblock", schema);
    return oxchain;
  };

