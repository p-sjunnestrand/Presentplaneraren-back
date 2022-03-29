const router = require('express').Router();
const passport = require('passport');
const cors = require("cors");

//Is called whenever front is loaded. Checks if user is logged in. So is also called when authentication below succeedes.
router.get("/login/success", (req, res) => {
    if(req.user){
        res.status(200).json({
            success: true,
            message: "Login succeeded",
            user: req.user,
        })
    } 
});

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "Login failed",
    });
});



router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("http://localhost:3000");
});

router.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}));

router.get("/google/callback", passport.authenticate("google", {
    successRedirect: "http://localhost:3000",
    failureRedirect: "/login/failed",
}));

router.post("/local", (req,res, next) => {
    console.log("local!");
    passport.authenticate("local", (err, user, info) => {
        if(err) throw err;
        if(!user) res.json("No user!");
        else {
            req.logIn(user, err => {
                if(err) throw err;
                res.json("Success!");
            })
        }
    })(req,res,next)
})
// router.post("/local", passport.authenticate("local"), (req, res) => {
//     console.log("authenticate!");
//     res.json({message: "Ok"})
// });


module.exports = router;