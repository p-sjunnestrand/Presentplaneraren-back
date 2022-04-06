const router = require('express').Router();
const passport = require('passport');

//Is called whenever front is loaded. Checks if user is logged in. So is also called when authentication below succeedes.
router.get("/login/success", (req, res) => {
    if(req.user){
        res.status(200).json({
            success: true,
            message: "Login succeeded",
            // user: req.user,
            user: {
                _id: req.user._id,
                email: req.user.email,
                groups: req.user.groups,
                lists: req.user.lists,
                nameFirst: req.user.nameFirst,
                nameLast: req.user.nameLast
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
        // user: req.user,
        user: {
            _id: req.user._id,
            email: req.user.email,
            groups: req.user.groups,
            lists: req.user.lists,
            nameFirst: req.user.nameFirst,
            nameLast: req.user.nameLast
        }
    })
})


module.exports = router;
