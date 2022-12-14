const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect("mongodb://0.0.0.0:27017/UsersManagementDB");
(err) => {
  if (err) {
    console.log(err.message);
    console.log("error connecting MongoDB");
  } else {
    console.log("Connected to MongoDB");
  }
};
mongoose.set("strictQuery", true);
