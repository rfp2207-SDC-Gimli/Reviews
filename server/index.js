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

app.get('/reviews/meta', (req, res) => {
  const params = req.query;
  const reviewsMeta = {
    product_id: params.product_id,
    ratings: '',
    recommended: '',
    characteristics: '',
  }

  db.getRatingsMetaData(params, (err, results) => {
    if(err) {
      throw err
    } else {
      reviewsMeta.ratings = results.rows[0].ratings;
      console.log("Got reviews data");
      db.getRecommendedMetaData(params, (err, results) => {
        if(err) {
          throw (err);
        } else {
          reviewsMeta.recommended = results.rows[0].recommended;
          console.log("got recommended data");
          db.getCharacteristicsMetaData(params, (err, results) => {
            if(err) {
              throw err;
            } else {
              const resultsArray = results.rows;
              const charObject = {};
              resultsArray.forEach((row) => {
                for (var key in row.json_build_object) {
                  charObject[key] = row.json_build_object[key];
                }
              });
              reviewsMeta.characteristics = charObject;
              // reviewsMeta.characteristics = results.rows;
              res.json(reviewsMeta)
            }
          })
        }
      })
    }
  })
})


app.post('/reviews', (req, res) => {
  params = req.query; //{product_id, rating, summary, body, recommend, gracie, email, photos, characteristic}
  let lastPhotoID;
  let date = Date.now();
  db.getLastPhotoID((err, results) => {
    if(err) {
      throw err;
    } else {
      lastPhotoID = results.rows[0].photos[results.rows[0].photos.length - 1].id;
      console.log('Got last photo ID');
      db.postReview(params, lastPhotoID, date, (err, results) => {
        if(err) {
          throw err;
        } else {
          console.log('posted new review to reviews table');
          db.postReviewMeta(params, (err, results) => {
            if(err) {
              throw err;
            } else {
              console.log('Added new review to review meta data');
              res.sendStatus(201);
            }
          })
        }
      })
    }
  })
});

//routes for the '/reviews/meta' endpoint


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