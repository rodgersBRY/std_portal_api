const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../models/admin");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // check if user exists
    const user = await Admin.findOne({ email: email });
    if (!user) {
      const hashedPass = await bcrypt.hash(password, 12);

      const newUser = new Admin({
        name: name,
        email: email,
        password: hashedPass,
      });

      await newUser.save();

      res.status(201).json({ msg: "successfully registered!" });
    } else {
      res.status(401).json({ msg: "user already exists" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = {
    email: email,
    password: password,
  };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_TOKEN);
  res
    .status(201)
    .json({ accessToken: accessToken, refreshToken: refreshToken });
};
 
function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_ACCESS_TOKEN, { expiresIn: "15s" });
}

module.exports = {
  registerUser,
  login,
};
