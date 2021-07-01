const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const mySchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author: { type: Schema.Types.ObjectId, ref: "User" },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

mySchema.post("findOneAndDelete", async (post) => {
  if (post) {
    await Review.deleteMany({
      _id: {
        $in: post.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Spot", mySchema);
