const mongoose = require("mongoose");
const { Schema } = mongoose;

const MovieSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  moviename: {
    type: String,
    unique: true,
    required: true,
  },
  genre: {
    type: String,
    requried: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const Movie = mongoose.model("movies", MovieSchema);
module.exports = Movie;
