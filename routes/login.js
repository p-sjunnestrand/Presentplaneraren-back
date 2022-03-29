const router = require('express').Router();
const passport = require('passport');
const cors = require("cors");

router.post("/local", cors(), passport.authenticate("local"), (req, res) => {
    console.log("authenticate!");
    // res.redirect("http://localhost:3000")
});


module.exports = router;