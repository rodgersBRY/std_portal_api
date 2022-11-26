const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("morgan");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

require("dotenv").config();

const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

// session store
var store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "mySessions",
});

// connect to mongoDB using mongoose
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongoDB connected");
  });

app.use(
  session({
    secret: process.env.SESSION_SECRET_TOKEN,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// api endpoints
app.use("/admin", adminRoutes);
app.use("/", userRoutes);

// error handling middleware
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});

app.get("/", (req, res) => {
  req.session.isAUth = true;
  console.log(req.session);

  res.status(200).send("hello there");
});

app.listen(process.env.PORT, () => {
  console.log("app running on port 4000");
});
