DROP DATABASE IF EXISTS reviews;

CREATE DATABASE reviews;

USE reviews;

CREATE TABLE reviews (
  id bigserial,
  rating integer,
  date timestamp,
  summary text,
  body text,
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name text,
  reviewer_email text,
  response text,
  product_id integer,
  FOREIGN KEY (product_id)
    REFERENCES products(id);
);

CREATE TABLE photos (
  id bigserial,
  url text,
  review_id integer,
  FOREIGN KEY (review_id)
    REFERENCES reviews(id);
);

CREATE TABLE characteristics (
  id bigserial,
  product_id integer,
  name text,
  FOREIGN KEY (product_id)
    REFERENCES products(id)
);

CREATE TABLE characteristic_reviews (
  id bigserial,
  characteristic_id integer,
  review_id integer,
  value integer,
  FOREIGN KEY (characteristic_id)
    REFERENCES characteristics(id),
  FOREIGN KEY (review_id)
    REFERENCES reviews (id)
);