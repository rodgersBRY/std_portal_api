const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("morgan");

require("dotenv").config();

const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");

// const students = require("./students.json");
// const instructors=require('./inst.json')
// const User = require("./models/user");


const app = express();

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

// app.get("/", async (_, res) => {
//   for (stud of instructors) {
//     const user = await User.findOne({ email: stud.email });
//     if (user) {
//       console.log("user already exists in the system");
//     } else {
//       const newUser = new User({
//         code: stud.code,
//         name: stud.name,
//         email: stud.email,
//         role: stud.role,
//         gender: stud.gender,
//         phone: stud.phone,
//         age: stud.age,
//       });

//       await newUser.save();
//     }
//   }
//   res.status(201).send({msg: 'successfully saved!'})
// });

const port = process.env.PORT;

// connect to mongoDB using mongoose
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log("app running on port " + port);
    });
  })
  .catch((err) => {
    console.error(err);
  });
