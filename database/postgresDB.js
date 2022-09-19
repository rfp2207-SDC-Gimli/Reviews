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

module.exports = {

//Query to get all reviews by ID
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

  //Queries for getting meta data...
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

  //The following queries should be used for every review posted...
  getLastPhotoID: function(callback) {
    pool.query('SELECT photos FROM reviews WHERE photos IS NOT NULL ORDER BY id DESC LIMIT 1;', (err, response) => {
      callback(err, response);
    })
  },

  postReview: function(params, photosArray, date, callback) {
    if (photosArray && photosArray.length > 0) {
      pool.query(`INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, helpfulness, photos) VALUES ('${params.product_id}', '${params.rating}', '${date}', '${params.summary}', '${params.body}', '${params.recommend}', DEFAULT, '${params.name}', '${params.email}', DEFAULT, '${JSON.stringify(photosArray)}');`, (err, response) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, response);
        }
      })
    } else {
      pool.query(`INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, helpfulness) VALUES ('${params.product_id}', '${params.rating}', '${date}', '${params.summary}', '${params.body}', '${params.recommend}', DEFAULT, '${params.name}', '${params.email}', DEFAULT);`, (err, response) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, response);
        }
      })
    }
  },

  updateRatings: function(params, callback) {
    pool.query(`UPDATE ratings SET value = value + 1 WHERE (product_id = ${params.product_id} AND stars = ${params.rating});`, (err, response) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, response);
      }
    })
  },

  updateRecommends: function(params, callback) {
    pool.query(`UPDATE recommended SET value = (value + 1) WHERE (product_id = ${params.product_id} AND recommends = ${params.recommend});`, (err, response) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, response);
      }
    })
  },

  updateCharacteristics: function(params, callback) {
    characteristics = params.characteristics;
    for (charID in characteristics) {
      pool.query(`SELECT * FROM characteristics_meta WHERE characteristic_id = ${charID};`, (err, selectResponse) => {
        if(err) {
          throw err;
        } else if (selectResponse.rows.count > 0) {
          pool.query(`UPDATE characteristics_meta SET value = (sum + ${characteristics[charID]}) / (count + 1), sum = sum + ${characteristics[charID]}, count = count + 1 WHERE characteristic_id = ${charID};`, (err, firstResponse) => {
            console.log('ERROR UPDATING CHARACTERISTICS');
            if (err) {
              callback(err, null);
            } else {
              callback(null, firstResponse);
            }
          })
        } else {
          pool.query(`UPDATE characteristics_meta SET value = ${characteristics[charID]}, sum = ${characteristics[charID]}, count = 1 WHERE characteristic_id = ${charID};`, (err, secondResponse) => {
            if (err) {
              callback(err, null);
            } else {
              callback(null, secondResponse);
            }
          })
        }
      })
    }
  },

//query for marking review helpful
  updateHelpfulness: function(review_id, callback) {
    pool.query(`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${review_id};`, (err, response) => {
      callback(err, response);
    })
  },

//query for reporting a review
  updateReported: function(review_id, callback) {
    pool.query(`UPDATE reviews SET reported = true WHERE id = ${review_id};`, (err, response) => {
      callback(err, response);
    })
  },

}

