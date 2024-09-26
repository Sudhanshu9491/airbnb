const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required:true,
  },
  description: String,
  image: {
    type:String,
    default:"https://www.shutterstock.com/shutterstock/photos/2316352307/display_1500/stock-vector-photo-coming-soon-picture-frame-no-website-photos-yet-logo-sign-symbol-image-not-available-yet-2316352307.jpg",
    set:(v)=> v==="" ?
    "https://www.shutterstock.com/shutterstock/photos/2316352307/display_1500/stock-vector-photo-coming-soon-picture-frame-no-website-photos-yet-logo-sign-symbol-image-not-available-yet-2316352307.jpg":v
  },
  price: Number,
  location: String,
  country: String,
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
