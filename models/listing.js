
const mongoose = require("mongoose");
const Schema = mongoose.Schema; //barbar mongoosh.schema na lhnna padde es ly usse schmena ke andr dal denge
const review = require("./review.js");
const listingSchema = new mongoose.Schema({  //setting the schema
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews:[
  {
    type:Schema.Types.ObjectId,
    ref:"Review",
  },
],
owner:
{
  type:Schema.Types.ObjectId,
  ref:"User",
},
category: {
  type: String,
  enum: ["beach", "mountain", "city", "cabin", "luxury", "treehouse", "ski", "safari", "island", "historical", "rooms"],
  default: "city",
},
});

listingSchema.post("findOneAndDelete", async function (doc) {  //middleware to delete all the reviews of a listing when the listing is deleted
  if (doc) {
    await review.deleteMany({
      _id: { $in: doc.reviews }
    });
  }
});


const Listing = mongoose.model("Listing", listingSchema); //creating model usiing the schema
module.exports = Listing; //exporting modles in app.js
