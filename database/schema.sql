DROP DATABASE IF EXISTS reviews;

CREATE DATABASE reviews;

\c reviews

DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS characteristics CASCADE;
DROP TABLE IF EXISTS characteristic_reviews CASCADE;

CREATE TABLE products (
  id serial PRIMARY KEY,
  name text,
  slogan text,
  description text,
  category text,
  default_price integer
);

--Main table for /reviews queries
CREATE TABLE reviews (
  id serial PRIMARY KEY,
  product_id integer REFERENCES products(id),
  rating integer,
  date BIGINT,
  summary text,
  body text,
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name text,
  reviewer_email text,
  response text,
  helpfulness integer,
  photos json
);

CREATE TABLE photos (
  id serial PRIMARY KEY,
  review_id integer REFERENCES reviews(id),
  url text
);

CREATE TABLE characteristics (
  id serial PRIMARY KEY,
  product_id integer REFERENCES products(id),
  name text
);

CREATE TABLE characteristic_reviews (
  id serial PRIMARY KEY,
  characteristic_id integer REFERENCES characteristics(id),
  review_id integer REFERENCES reviews(id),
  value integer
);

CREATE TABLE ratings (
  product_id integer REFERENCES products(id),
  stars integer,
  value integer DEFAULT 0
);

CREATE TABLE recommended (
  product_id integer REFERENCES products(id),
  recommends boolean,
  value integer DEFAULT 0
);

CREATE TABLE characteristics_meta (
  id serial PRIMARY KEY,
  product_id integer REFERENCES products(id),
  characteristic_id integer,
  characteristic text,
  value numeric DEFAULT 0,
  sum numeric DEFAULT 0,
  count numeric DEFAULT 0
);

CREATE TABLE star_options (
  stars integer
);

CREATE TABLE recommended_options (
  recommend boolean
);

INSERT INTO ratings_2 SELECT id AS product_id, stars, 0 AS value FROM products cross join star_options ORDER BY id, stars;
INSERT INTO recommended_2 SELECT id AS product_id, recommend AS recommends, 0 AS value FROM products cross join recommended_options ORDER BY id, recommend;
-- IF YOU NEED TO DROP THE TABLE AND RECREATE IT, REPLACE (SELECT * FROM RATINGS) TO BE (SELECT product_id, stars, COUNT(*) FROM reviews GROUP BY product_id, stars)
-- UPDATE ratings_2 SET value = subquery.value FROM (SELECT * FROM ratings) AS subquery WHERE ratings_2.product_id = subquery.product_id AND ratings_2.stars = subquery.stars;

UPDATE recommended_2 SET value = subquery.value FROM (SELECT * FROM recommended) AS subquery WHERE recommended_2.product_id = subquery.product_id AND recommended_2.recommends = subquery.recommends;

/*

1. Create new table (recommended_2)
2. Create a recommended option table with values true and false
3. INSERT INTO recommended_2 the cross join between products and recommended_option

*/


--Queries to populate new joined/organized tables
INSERT INTO ratings SELECT product_id, rating, COUNT(*) AS value FROM reviews GROUP BY product_id, rating;

INSERT INTO recommended SELECT product_id, recommend, COUNT(*) AS value FROM reviews GROUP BY product_id, recommend;

INSERT INTO characteristics_meta(product_id, characteristic_id, characteristic, value, sum, count) SELECT product_id, characteristics.id, name, AVG(value) AS value, SUM(value) AS sum, COUNT(value) AS count FROM characteristics LEFT JOIN characteristic_reviews ON characteristics.id = characteristic_reviews.characteristic_id GROUP BY product_id, name, characteristics.id, characteristic_reviews.characteristic_id;



\COPY products(id, name, slogan, description, category, default_price) FROM '/Users/graciefogarty/Desktop/HackReactorSEI/Reviews/data/product.csv' DELIMITER ',' CSV HEADER;

\COPY reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '/Users/graciefogarty/Desktop/HackReactorSEI/Reviews/data/reviews.csv' DELIMITER ',' CSV HEADER;

\COPY photos(id, review_id, url) FROM '/Users/graciefogarty/Desktop/HackReactorSEI/Reviews/data/reviews_photos.csv' DELIMITER ',' CSV HEADER;

\COPY characteristics(id, product_id, name) FROM '/Users/graciefogarty/Desktop/HackReactorSEI/Reviews/data/characteristics.csv' DELIMITER ',' CSV HEADER;

\COPY characteristic_reviews(id, characteristic_id, review_id, value) FROM '/Users/graciefogarty/Desktop/HackReactorSEI/Reviews/data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;



-- Query to format review photos as an array of photo objects
WITH photos_organized AS (
SELECT review_id, json_agg(JSON_BUILD_OBJECT('id', photos.id, 'url', photos.url)) FROM photos GROUP BY review_id
) UPDATE reviews SET photos = photos_organized.json_agg FROM photos_organized WHERE reviews.id = photos_organized.review_id;

-- Query to get transformed ratings data
-- ***********************************************************************************************************************
SELECT product_id, json_object_agg(ratings.stars, ratings.value) FROM products JOIN ratings ON products.id = ratings.product_id GROUP BY product_id LIMIT 20;


--Query to get a single product's rating meta data;
SELECT json_object_agg(ratings.stars, ratings.value order by ratings.stars) from ratings WHERE product_id = 2;

--Query to get a single product's recommended meta data;
SELECT json_object_agg(recommended.recommends, recommended.value) from recommended WHERE product_id = 2;

--Query to get a single product's characteristics meta data;
SELECT json_build_object(characteristics_meta.characteristic, json_build_object('id', characteristics_meta.id, 'value', characteristics_meta.value)) from characteristics_meta WHERE product_id = 4;

--Query to get the last set of photos in the database
SELECT photos FROM reviews WHERE photos IS NOT NULL ORDER BY id DESC LIMIT 1; --Get last id by selecting (array.length-1)[id]


WITH photos_organized AS (
SELECT review_id, json_agg(JSON_BUILD_OBJECT('id', photos.id, 'url', photos.url)) FROM photos GROUP BY review_id
) UPDATE reviews SET photos = photos_organized.json_agg FROM photos_organized WHERE reviews.id = photos_organized.review_id;

CREATE TABLE test AS SELECT review_id, json_agg(JSON_BUILD_OBJECT('id', photos.id, 'url', photos.url)) AS test_column FROM photos GROUP BY review_id;

UPDATE reviews SET photos = test.test_column FROM test WHERE reviews.id = test.review_id;
UPDATE reviews_2 SET photos = test.test_column FROM test WHERE reviews_2.id = test.review_id;
-- Query the db to select product_id and ratings
--Query the db to select product_id and recommendations

-- Query the db to select product_id characteristic reviews and characteristics

SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews)+1);

-- To import data run > psql postgres -f /Users/graciefogarty/Desktop/HackReactorSEI/Reviews/database/schema.sql
-- To connect to the database run > psql postgres \c reviews