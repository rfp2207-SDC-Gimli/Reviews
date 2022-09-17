const Pool = require('pg').Pool
require("dotenv").config();


const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: process.env.DB_NAME,
  password: '',
  port: process.env.DB_PORT
})
// pool.connect();

//Query to get all reviews by ID
module.exports = {

  getReviewsByProductID: function(params, page, count, callback) {
    if(!params.sort) {
      pool.query(`SELECT id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness, photos FROM reviews WHERE product_id=${params.product_id} AND reported=false ORDER BY id OFFSET ${page * count} ROWS FETCH NEXT ${count} ROWS ONLY;`, (err, response) => {
        callback(err, response);
      })
    } else if(params.sort === "newest") {
      pool.query(`SELECT id, rating, date, summary, body, recommend, response, reviewer_name, helpfulness, photos FROM reviews WHERE product_id=${params.product_id} AND reported=false ORDER BY date DESC OFFSET ${page * count} ROWS FETCH NEXT ${count} ROWS ONLY;`, (err, response) => {
        callback(err, response);
      })
    } else if (params.sort === "helpful") {
      pool.query(`SELECT id, rating, date, summary, body, recommend, response, reviewer_name, helpfulness, photos FROM reviews WHERE product_id=${params.product_id} AND reported=false ORDER BY helpfulness DESC OFFSET ${page * count} ROWS FETCH NEXT ${count} ROWS ONLY;`, (err, response) => {
        callback(err, response);
      })
    } else if (params.sort === "relevant") {
      pool.query(`SELECT id, rating, date, summary, body, recommend, response, reviewer_name, helpfulness, photos FROM reviews WHERE product_id=${params.product_id} AND reported=false ORDER BY rating DESC OFFSET ${page * count} ROWS FETCH NEXT ${count} ROWS ONLY;`, (err, response) => {
        callback(err, response)
      })
    }
  },

  //Query to get last photo id
  getLastPhotoID: function(callback) {
    pool.query('SELECT photos FROM reviews WHERE photos IS NOT NULL ORDER BY id DESC LIMIT 1;', (err, response) => {
      callback(err, response);
    })
  },





}

