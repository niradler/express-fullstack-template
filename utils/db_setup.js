const mongoose = require("mongoose");

module.exports = () => {
  mongoose.connect(process.env.DB_URI || "mongodb://localhost:32768/express");
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function() {
    console.log("Connection Successful!");
  });
};
