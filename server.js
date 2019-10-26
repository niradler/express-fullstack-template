require("dotenv").config();
const express = require("express");
const middleware = require("./middleware");
const dbSetup = require("./utils/db_setup");
const app = express();

dbSetup();
middleware(app);

const port = process.env.PORT || 3055;

app.listen(port, async () => {
  console.log(`running on port ${port}!`);
});
