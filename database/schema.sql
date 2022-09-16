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
  helpfulness integer
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


\COPY products(id, name, slogan, description, category, default_price) FROM '/Users/graciefogarty/Desktop/HackReactorSEI/Reviews/data/product.csv' DELIMITER ',' CSV HEADER;

\COPY reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '/Users/graciefogarty/Desktop/HackReactorSEI/Reviews/data/reviews.csv' DELIMITER ',' CSV HEADER;

\COPY photos(id, review_id, url) FROM '/Users/graciefogarty/Desktop/HackReactorSEI/Reviews/data/reviews_photos.csv' DELIMITER ',' CSV HEADER;

\COPY characteristics(id, product_id, name) FROM '/Users/graciefogarty/Desktop/HackReactorSEI/Reviews/data/characteristics.csv' DELIMITER ',' CSV HEADER;

\COPY characteristic_reviews(id, characteristic_id, review_id, value) FROM '/Users/graciefogarty/Desktop/HackReactorSEI/Reviews/data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;

-- Run psql postgres -f /Users/graciefogarty/Desktop/HackReactorSEI/Reviews/database/schema.sql