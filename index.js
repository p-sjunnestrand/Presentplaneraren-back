const express = require('express');
const cors = require('cors');
const {MongoClient} = require('mongodb');
require('dotenv').config();

const app = express();
const port = 4000;

app.use(cors());

const uri =
  `mongodb+srv://petter-admin:${process.env.DB_PASSWORD}@cluster0.f7aam.mongodb.net/Presentplaneraren?retryWrites=true&w=majority`;

MongoClient.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
.then(client => {
    console.log("Database connected");
    const db = client.db('Presentplaneraren');
    app.locals.db = db;
})

app.get('/', async (req, res) => {
    console.log('get');
    const results = await app.locals.db.collection('lists').find().toArray();
    console.log(results);
    res.json(results);
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});