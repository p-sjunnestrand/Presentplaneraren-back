const router = require('express').Router();
const passport = require('passport');

//Is called whenever front is loaded. Checks if user is logged in. So is also called when authentication below succeedes.
router.get("/login/success", (req, res) => {
    if(req.user){
        res.status(200).json({
            success: true,
            message: "Login succeeded",
            user: {
                _id: req.user._id,
                email: req.user.email,
                groups: req.user.groups,
                lists: req.user.lists,
                nameFirst: req.user.nameFirst,
                nameLast: req.user.nameLast,
                invites: req.user.invites,
            }
        })
    } else {
        res.status(401).json("Unauthorized");
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

// The google routes are not called as of now, since they cause conflicts with the local auth. This needs to be adressed in the future!
router.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}));

router.get("/google/callback", passport.authenticate("google", {
    successRedirect: "http://localhost:3000",
    failureRedirect: "/login/failed",
}));

router.post("/local", passport.authenticate("local", {
    passReqToCallback: true,
}), (req,res) => {
    res.status(200).json({
        success: true,
        message: "Login succeeded",
        user: {
            _id: req.user._id,
            email: req.user.email,
            groups: req.user.groups,
            lists: req.user.lists,
            nameFirst: req.user.nameFirst,
            nameLast: req.user.nameLast,
            invites:req.user.invites,
        }
    })
})


module.exports = router;
