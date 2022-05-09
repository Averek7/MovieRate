const mongoose = require("mongoose");
const mongoURI =
  "mongodb://localhost:27017/UserMovie?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connected To Database !");
  });
};

module.exports = connectToMongo;
