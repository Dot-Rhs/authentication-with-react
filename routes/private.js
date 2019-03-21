var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  console.log("in private");
  res.json({ success: true, message: "this should be a secret" });
});

module.exports = router;
