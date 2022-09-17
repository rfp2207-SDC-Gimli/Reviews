require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const db = require('../database/postgresDB.js');

app.use(express.json());

//routes for the '/reviews' endpoint
app.get('/reviews', (req, res) => {
  const params = req.query;
  const page = params.page || 0;
  const count = params.count || 5;
  const reviews = {
    product: params.product_id,
    page: page,
    count: count,
    results: [],
  }
  db.getReviewsByProductID(params, page, count, (err, results) => {
    if(err) {
      throw err
    } else {
      reviews.results = results.rows;
      res.json(reviews);
    }
  })
})

app.post('/reviews', (req, res) => {
  let lastPhotoID;
  db.getLastPhotoID((err, results) => {
    if(err) {
      throw err;
    } else {
      lastPhotoID = results.rows[0].photos[results.rows[0].photos.length - 1].id;
      console.log(lastPhotoID);
      res.sendStatus(201);
    }
  })
});

app.put('/reviews', (req, res) => {

});

app.delete('/reviews', (req, res) => {

});


//routes for the '/reviews/meta' endpoint
app.get('/reviews/meta', (req, res) => {

});

app.post('/reviews/meta', (req, res) => {

});

app.put('/reviews/meta', (req, res) => {

});

app.delete('/reviews/meta', (req, res) => {

});




var PORT = `${process.env.PORT}` || 3000;
app.listen(PORT, () => {
  console.log(`Listening at localhost:${PORT}`);
  console.log(`Database: ${process.env.DB_NAME}`);
});