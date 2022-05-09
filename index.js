const express = require("express");
const connectToMongo = require("./db");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

connectToMongo();
const port = 5001;

app.use("/api/auth", require("./routes/auth"));
app.use("/api/movie", require("./routes/movie"));

app.listen(port, () => {
  console.log(`Listening at ${port}....`);
});
