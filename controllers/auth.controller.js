const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../models/admin.js");

function throwError(errorText, statusCode) {
  const error = new Error(errorText);
  error.statusCode = statusCode;
  throw error;
}

exports.register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    const user = await Admin.findOne({ email: email });

    if (user) throwError("An account with that email exists!", 409);

    const hashedPass = await bcrypt.hash(password, 12);

    const newUser = new Admin({
      name: name,
      email: email,
      password: hashedPass,
      role: role || "moderator",
    });

    await newUser.save();
    res.status(201).json({ msg: "successfully registered!" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  let loadedUser;

  try {
    const user = await Admin.findOne({ email: email });
    if (!user) throwError("That user does not exist!", 404);

    loadedUser = user;

    const passwordMatch = await bcrypt.compare(password, loadedUser.password);
    if (!passwordMatch) throwError("Wrong password!", 401);

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
