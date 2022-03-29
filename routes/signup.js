const router = require('express').Router();
const User = require('../mongoose');
const bcrypt = require('bcrypt');

router.post("/", (req, res) => {
    console.log(req.body);
    User.findOne({email: req.body.email}, async (err, user) => {
        if(err){
          throw new Error('Something went wrong when querrying the database');
        }
        if(!user) {
            const plainPsw = req.body.password;
            const saltRounds = 10;
            const encryptedPsw = await bcrypt.hash(plainPsw, saltRounds);

            user = new User({
                nameFirst: req.body.nameFirst,
                nameLast: req.body.nameLast,
                googleId: null,
                email: req.body.email,
                password: encryptedPsw,
            });
            user.save(err => {
                if(err){
                    console.log(err);
                }
                res.status(200).json({
                    nameFirst: req.body.nameFirst,
                    nameLast: req.body.nameLast,
                    email: req.body.email,
                })
            });
        } else {
            console.log("User taken!");
            res.sendStatus(409);
        }
      });
});

module.exports = router;