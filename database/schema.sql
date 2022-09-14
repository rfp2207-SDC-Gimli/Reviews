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
  response text
);

CREATE TABLE photos (
  id bigserial,
  url text
);

CREATE TABLE characteristics (
  id bigserial,
  name text
);

CREATE TABLE characteristic_reviews (
  id bigserial,
  value integer
);