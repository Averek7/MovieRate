const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

router.get("/getmovie", fetchuser, async (req, res) => {
  try {
    const movies = await Movie.find({ user: req.user.id });
    res.json({ movies });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error Occured");
  }
});

router.post(
  "/addMovie",
  fetchuser,
  [body("rating", "Rating must be under 5").isFloat({ min: 0.0, max: 5.0 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { moviename, genre, rating } = req.body;
    try {
      const movies = new Movie({
        moviename,
        genre,
        rating,
        user: req.user.id,
      });
      const savedMovie = await movies.save();
      res.json(savedMovie);
    } catch (error) {
      console.error(err.message);
      res.status(500).send("Error Occurred");
    }
  }
);

router.get("/getAverageRating", fetchuser, [], async (req, res) => {
  try {
    const movies = await Movie.find({ user: req.user.id });
    res.json({ movies });
    let movie = [];
    let rating = [],
      sum = 0,
      average;
    for (var i = 0; i < movies.length; i++) {
      movie.push(movies[i]["moviename"]);
      rating.push(movies[i]["rating"]);
    }
    console.log("\n");
    for (var i = 0; i < movies.length; i++) {
      sum = sum + rating[i];
      console.log(`Movie: ${movie[i]}(${rating[i]}/5)`);
    }
    console.log("\n");

    average = sum / movies.length;
    console.log(`Overall average rating of movie collection: ${average}`);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error Occured");
  }
});

router.post("/searchBy", fetchuser, [], async (req, res) => {
  const { moviename } = req.body;
  try {
    let movie,
      result = {};
    const movies = await Movie.find({ user: req.user.id });
    for (movie in movies) {
      if (moviename === movies[movie]["moviename"]) {
        result = movies[movie];
        res.json({ result });
      }
      res.status(400).send("No Movie Found");
    }
    res.json({ movies });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error Occured");
  }
});

module.exports = router;
