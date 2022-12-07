const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../models/admin.js");

exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const user = await Admin.findOne({ email: email });

    if (user) {
      const error = new Error("User already exists. Log in");
      error.statusCode = 409;
      throw error;
    }

    const hashedPass = await bcrypt.hash(password, 12);

    const newUser = new Admin({
      name: name,
      email: email,
      password: hashedPass,
    });

    await newUser.save();

    res.status(201).json({ msg: "successfully registered!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  let loadedUser;

  try {
    const user = await Admin.findOne({ email: email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    loadedUser = user;

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      userId: loadedUser._id.toString(),
      loadedUser,
      token,
    });
  } catch (err) {
    next(err);
  }
};
