const cookieSession = require('cookie-session');
const express = require('express');
const cors = require('cors');
require('./passport');
const passport = require('passport');
const authRoute = require('./routes/auth');
const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 4000;

app.use(cookieSession({
    name: "session",
    keys: ["abc123"],
    maxAge: 24*60*60*1000,
}));

app.use(passport.initialize());
app.use(passport.session());

// app.options('*', cors());
//Middlewares
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}));
app.use("/auth", authRoute);





const uri =
  `mongodb+srv://petter-admin:${process.env.DB_PASSWORD}@cluster0.f7aam.mongodb.net/Presentplaneraren?retryWrites=true&w=majority`;

mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
.then(client => {
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

