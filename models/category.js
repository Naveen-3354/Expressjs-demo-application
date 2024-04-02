const mongoose = require("mongoose");

const Category = mongoose.model(
  "category",
  new mongoose.Schema({
    categoryName: {
      type: String,
    },
    categoryCode: {
      type: String,
    },
    // userid:{
    //   type:mongoose.Schema.Types.ObjectId,
    //   ref: "users"
    // }
  })
);

module.exports = Category;