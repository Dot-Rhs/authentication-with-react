const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");

const privateRouter = require("./routes/private");
const loginRouter = require("./routes/login");
const usersRouter = require("./routes/users");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/test", { useNewUrlParser: true });

const app = express();

const authenticate = (req, res, next) => {
  const token = req.query.token;
  //const {token} = req.query;
  // decode token
  console.log("token", token);
  if (token) {
    // verifies secret and checks exp
    return jwt.verify(token, "superSecret", (err, decoded) => {
      console.log("in verify");
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Failed to authenticate token."
        });
      }
      // if everything is good, save to request for use in other routes
      req.decoded = decoded;
      console.table(decoded);
      return next();
    });
  }
  res.status(401).json({ message: "No token provided" });
};

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.

app.use(function(req, res, next) {
  console.log("req received");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.use("/login", loginRouter);
app.use("/users", usersRouter);
app.use("/private", authenticate, privateRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;
