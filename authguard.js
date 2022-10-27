const jwt=require('jsonwebtoken')

require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized!" });

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, user) => {
    if (err) return res.status(403).json({ error: "token expired" });
    req.user = user;
    next();
  });
};

module.exports = authenticateToken