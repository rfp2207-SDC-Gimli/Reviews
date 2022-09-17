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
      pool.query(`SELECT id AS review_id, rating, summary, recommend, response, body, to_timestamp(date/1000) AS date, reviewer_name, helpfulness, photos FROM reviews WHERE product_id=${params.product_id} AND reported=false ORDER BY id OFFSET ${page * count} ROWS FETCH NEXT ${count} ROWS ONLY;`, (err, response) => {
        callback(err, response);
      })
    } else if(params.sort === "newest") {
      pool.query(`SELECT id AS review_id, rating, summary, recommend, response, body, to_timestamp(date/1000) AS date, reviewer_name, helpfulness, photos FROM reviews WHERE product_id=${params.product_id} AND reported=false ORDER BY date DESC OFFSET ${page * count} ROWS FETCH NEXT ${count} ROWS ONLY;`, (err, response) => {
        callback(err, response);
      })
    } else if (params.sort === "helpful") {
      pool.query(`SELECT id AS review_id, rating, summary, recommend, response, body, to_timestamp(date/1000) AS date, reviewer_name, helpfulness, photos FROM reviews WHERE product_id=${params.product_id} AND reported=false ORDER BY helpfulness DESC OFFSET ${page * count} ROWS FETCH NEXT ${count} ROWS ONLY;`, (err, response) => {
        callback(err, response);
      })
    } else if (params.sort === "relevant") {
      pool.query(`SELECT id AS review_id, rating, summary, recommend, response, body, to_timestamp(date/1000) AS date, reviewer_name, helpfulness, photos FROM reviews WHERE product_id=${params.product_id} AND reported=false ORDER BY rating DESC OFFSET ${page * count} ROWS FETCH NEXT ${count} ROWS ONLY;`, (err, response) => {
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

  postReview: function(params, lastPhotoID, callback) {
    pool.query(``, (err, response) => {
      callback(err, response);
    })
  },

  getRatingsMetaData: function(params, callback) {
    pool.query(`SELECT json_object_agg(ratings.stars, ratings.value order by ratings.stars) AS ratings from ratings WHERE product_id = ${params.product_id};`, (err, response) => {
      callback(err, response);
    })
  },

  getRecommendedMetaData: function(params, callback) {
    pool.query(`SELECT json_object_agg(recommended.recommends, recommended.value) AS recommended from recommended WHERE product_id = ${params.product_id};`, (err, response) => {
      callback(err, response);
    })
  },

  getCharacteristicsMetaData: function(params, callback) {
    pool.query(`SELECT json_build_object(characteristics_meta.characteristic, json_build_object('id', characteristics_meta.id, 'value', characteristics_meta.value)) from characteristics_meta WHERE product_id = ${params.product_id};`, (err, response) => {
      console.log(response.rows)
      callback(err, response);
    })
  },



}

