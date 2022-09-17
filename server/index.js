require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const db = require('../database/postgresDB.js');

app.use(express.json());

//routes for the '/reviews' endpoint
app.get('/reviews', (req, res) => {
  const productID = req.query.product_id;
  db.getReviewsByProductID(productID, (err, results) => {
    if(err) {
      throw err
    } else {
      res.json(results.rows);
    }
  })
})

app.post('/reviews', (req, res) => {

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