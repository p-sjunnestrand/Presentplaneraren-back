const cookieSession = require('cookie-session');
const express = require('express');
const cors = require('cors');
require('./passport');
const passport = require('passport');
const authRoute = require('./routes/auth');
const signupRoute = require('./routes/signup');
const listsRoute = require('./routes/lists');
const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');

require('dotenv').config();


const app = express();
const port = 4000;
// app.options("/auth/local", cors());
const uri =
`mongodb+srv://petter-admin:${process.env.DB_PASSWORD}@cluster0.f7aam.mongodb.net/Presentplaneraren?retryWrites=true&w=majority`;

app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
}));
// app.use(cookieSession({
//     name: "session",
//     keys: [process.env.COOKIE_SESSION_KEYS],
//     maxAge: 24*60*60*1000,
// }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // store: MongoStore.create({ mongoUrl: uri, collectionName: "sessions"}),
    cookie: {
        maxAge: 24*60*60*1000
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// app.options('/auth/local', cors({
//     origin: "http://localhost:3000",
//     methods: "GET,POST,PUT,DELETE,OPTIONS",
//     credentials: true,
// }));
//Middlewares


app.use(cookieParser(process.env.SESSION_SECRET));

app.use("/auth", authRoute);
app.use("/signup", signupRoute);
app.use("/lists", listsRoute);


// app.get("/user", (req, res) => {
//     console.log(req.user);
//     res.send(req.user);
// })

mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
.then(() => {
    console.log("Database connected");
    // const db = client.db('Presentplaneraren');
    // app.locals.db = db;
})
.catch(err => console.log(err));

// app.get('/', async (req, res) => {
//     const results = await app.locals.db.collection('lists').find().toArray();
//     console.log(results);
//     res.json(results);
// });

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});

