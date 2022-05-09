const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "secret_token_user";
// const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

const app = express();

const limiter = rateLimit({
  max: 4, //4 attempts
  windowMs: 30 * 60 * 1000, //30 minutes
});

app.use(limiter);

router.post(
  "/newuser",
  [
    body("name", "Enter a valid name").isLength({ min: 5 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password length must be at least 8 characters").isLength({
      min: 8,
    }),
    body("age", "Enter a valid age").isNumeric().isLength({ min: 2, max: 3 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let success;
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success = false;
        return res.status(400).json({ success, error: "User Already Exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
        age: req.body.age,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Error Occurred");
    }
  }
);

router.post(
  "/signin",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password length must be at least 8 characters").isLength({
      min: 8,
    }),
  ],
  limiter,
  async (req, res) => {
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ error: "User Not Found" });
      }
      let success;
      const compPassword = await bcrypt.compare(password, user.password);
      if (!compPassword) {
        res.status(400).json({ success, error: "Please verify credentials" });
        success = false;
      }

      const payLoad = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(payLoad, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Some error occurred");
    }
  }
);

module.exports = router;
