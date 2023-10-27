const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  description:{ type: String, required: true },
  image: {
    type: String,
    default:"https://www.theflexnest.com/cdn/shop/products/1_26f7cabd-aa5a-4256-9c47-24833f009086_500x500.jpg?v=1635230112",
    set: (v) =>
      v === "https://www.theflexnest.com/cdn/shop/products/1_26f7cabd-aa5a-4256-9c47-24833f009086_500x500.jpg?v=1635230112"
        ? ""
        : v,
  },
  price:{
  type:Number,
  } ,
  type:{type:String,required: true},
  availability:{type:String,required: true} ,
  review: {type:String,required: true} ,
  rating:[
    {
      commment:String,
      rat:Number,
      type:Schema.Types.ObjectId,
      ref:"Rating",
    },
  ]
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;