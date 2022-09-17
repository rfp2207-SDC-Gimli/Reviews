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

const getReviewsByProductID = (productID, callback) => {
  // if(!req.query.sort) {
    pool.query(`SELECT * FROM reviews WHERE product_id=${productID} AND reported=false;`, (err, response) => {
      callback(err, response);
    })
  // } else if(req.query.sort === "newest") {
  //   pool.query(`SELECT * FROM reviews WHERE product_id=${req.query.product_id} AND reported=false ORDER BY date DESC;`, (err, response) => {
  //     if(err) {
  //       throw err
  //     } else {
  //       res.json(response.rows)
  //     }
  //   })
  // } else if (req.query.sort === "helpful") {
  //   pool.query(`SELECT * FROM reviews WHERE product_id=${req.query.product_id} AND reported=false ORDER BY helpfulness DESC;`, (err, response) => {
  //     if(err) {
  //       throw err
  //     } else {
  //       res.json(response.rows)
  //     }
  //   })
  // } else if (req.query.sort === "relevant") {
  //   pool.query(`SELECT * FROM reviews WHERE product_id=${req.query.product_id} AND reported=false ORDER BY rating DESC;`, (err, response) => {
  //     if(err) {
  //       throw err
  //     } else {
  //       res.json(response.rows)
  //     }
  //   })
  // }
}

module.exports = {getReviewsByProductID};
