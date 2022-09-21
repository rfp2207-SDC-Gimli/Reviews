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
  params = req.body; //{product_id, rating, summary, body, recommend, gracie, email, photos, characteristic}
  let lastPhotoID;
  let date = Date.now();
  let photosArray = [];
  let photos = params.photos;
  if(photos) {
    db.getLastPhotoID((err, results) => {
      if(err) {
        console.log("error getting last photoID");
        throw err
      } else {
        lastPhotoID = results.rows[0].photos[results.rows[0].photos.length - 1].id;
        photos.forEach((photoURL) => {
          photoObject = {};
          photoObject.id = lastPhotoID.toString();
          photoObject.url = photoURL;
          photosArray.push(photoObject);
          lastPhotoID++;
        })
        db.postReview(params, photosArray, date, (err, results) => {
          if(err) {
            console.log("error posting review");
            throw err
          }  else {
            db.updateRatings(params, (err, results) => {
              if (err) {
                throw err
                console.log('error updating ratings meta table')
              } else {
                db.updateRecommends(params, (err, results) => {
                  if (err) {
                    throw err
                    console.log('error updating recommended meta table')
                  } else {
                    if(params.characteristics) {
                      db.updateCharacteristics(params, (err, results) => {
                        if (err) {
                          console.log('error updating characteristics meta table')
                        } else {
                          console.log("posting review complete");
                          res.sendStatus(201);
                        }
                        })
                    } else {
                      console.log("posting review complete!");
                      res.sendStatus(201);
                    }
                  }
                })
              }
            })
          }
         })
      }
      });
    } else {
      db.postReview(params, photosArray, date, (err, results) => {
        if(err) {
          console.log("error posting review");
          throw err
        } else {
          db.updateRatings(params, (err, results) => {
            if (err) {
              throw err
              console.log('error updating ratings meta table')
            } else {
              db.updateRecommends(params, (err, results) => {
                if (err) {
                  throw err
                  console.log('error updating recommended meta table')
                } else {
                  if(params.characteristics) {
                    db.updateCharacteristics(params, (err, results) => {
                      if (err) {
                        console.log('error updating characteristics meta table')
                      } else {
                        console.log("posting review complete");
                        res.sendStatus(201);
                      }
                      })
                  } else {
                    console.log("posting review complete!")
                    res.sendStatus(201);
                  }
                }
              })
            }
          })
        }
       })
    }
});

//routes for the '/reviews/meta' endpoint
app.put('/reviews/:review_id/helpful', (req, res) => {
  const review_id = req.params.review_id;
  db.updateHelpfulness(review_id, (err, results) => {
    if(err) {
      throw err;
    } else {
      res.sendStatus(204);
    }
  })
});

app.put('/reviews/:review_id/report', (req, res) => {
  const review_id = req.params.review_id;
  db.updateReported(review_id, (err, results) => {
    if(err) {
      throw err;
    } else {
      res.sendStatus(204);
    }
  })
});



var PORT = `${process.env.PORT}` || 3000;
app.listen(PORT, () => {
  console.log(`Listening at localhost:${PORT}`);
  console.log(`Database: ${process.env.DB_NAME}`);
});