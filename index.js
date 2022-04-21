const cookieSession = require('cookie-session');
const express = require('express');
const cors = require('cors');
require('./passport');
const passport = require('passport');
const authRoute = require('./routes/auth');
const signupRoute = require('./routes/signup');
const listsRoute = require('./routes/lists');
const groupsRoute = require('./routes/groups');
const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');

require('dotenv').config();


const app = express();
const port = 4000;
const uri =
`mongodb+srv://petter-admin:${process.env.DB_PASSWORD}@cluster0.f7aam.mongodb.net/Presentplaneraren?retryWrites=true&w=majority`;

app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24*60*60*1000
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

app.use(cookieParser(process.env.SESSION_SECRET));

app.use("/auth", authRoute);
app.use("/signup", signupRoute);
app.use("/lists", listsRoute);
app.use("/groups", groupsRoute);

mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
.then(() => {
    console.log("Database connected");
})
.catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});

