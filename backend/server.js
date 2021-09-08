const express = require("express");
const bodyParser = require("body-parser");
const contant = require("./app/config/constatnt");

const app = express();
const cors = require('cors')

app.use(cors())

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//This is the middleware function which will be called before any routes get hit which are defined after this point, i.e. in your index.js
app.use(function (req, res, next) {
  //Here we would check for the user being authenticated
  //Unsure how we're actually checking this, so some psuedo code below
  if ((req.headers['admintoken'] &&
    req.headers['admintoken'] == contant.adminUserName + contant.adminPassword)) {
    //Carry on with the request chains
    next();
  } else {
    //Stop the user progressing any further
    return res.status(403).send("Unauthorised!");
  }
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Test Success" });
});

require("./app/routes/routes.js")(app);

// set port, listen for requests
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
