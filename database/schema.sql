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

-- CREATE TABLE ratings (
--   product_id integer REFERENCES products(id),
--   stars integer,
--   value integer
-- )

-- CREATE TABLE recommended (
--   product_id integer REFERENCES products(id),
--   recommend boolean,
--   value integer
-- )

-- CREATE TABLE characteristics_meta (
--   id serial PRIMARY KEY,
--   characteristic text,
--   value integer,
--   product_id integer REFERENCES products(id)
-- )


-- Query to format review photos as an array of photo objects
-- WITH photos_organized AS (
-- SELECT review_id, json_agg(JSON_BUILD_OBJECT('id', photos.id, 'url', photos.url)) FROM photos GROUP BY review_id
-- ) UPDATE reviews SET photos = photos_organized.json_agg FROM photos_organized WHERE reviews.id = photos_organized.review_id;

-- Query to update reviews table to add transformed photos data



\COPY products(id, name, slogan, description, category, default_price) FROM '/Users/graciefogarty/Desktop/HackReactorSEI/Reviews/data/product.csv' DELIMITER ',' CSV HEADER;

\COPY reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '/Users/graciefogarty/Desktop/HackReactorSEI/Reviews/data/reviews.csv' DELIMITER ',' CSV HEADER;

\COPY photos(id, review_id, url) FROM '/Users/graciefogarty/Desktop/HackReactorSEI/Reviews/data/reviews_photos.csv' DELIMITER ',' CSV HEADER;

\COPY characteristics(id, product_id, name) FROM '/Users/graciefogarty/Desktop/HackReactorSEI/Reviews/data/characteristics.csv' DELIMITER ',' CSV HEADER;

\COPY characteristic_reviews(id, characteristic_id, review_id, value) FROM '/Users/graciefogarty/Desktop/HackReactorSEI/Reviews/data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;

-- Query the db to select product_id and ratings
--Query the db to select product_id and recommendations
-- Query the db to select product_id characteristic reviews and characteristics



-- To import data run > psql postgres -f /Users/graciefogarty/Desktop/HackReactorSEI/Reviews/database/schema.sql
-- To connect to the database run > psql postgres \c reviews