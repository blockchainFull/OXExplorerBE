module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        blockHash: String,
        blockNumber:  Number,
        from:  String, 
        gas:  Number,
        gasPrice:  String,
        hash:  String,
        input:  String,
        nonce:  String,
        to:  String,
        transactionIndex: Number,
        value:  Number,
        v: String,
        r: String,
        s: String
      },
      { timestamps: true }
    );

    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });

    const oxchaintrans = mongoose.model("oxchaintrans", schema);
    return oxchaintrans;
  };

