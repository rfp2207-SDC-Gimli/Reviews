const mongoose = require("mongoose");

const { Schema } = mongoose;

const reviewsSchema = new Schema({
  product_id: Number,
  rating: Number,
  date: Date,
  summary: String,
  body: String,
  recommend: Boolean,
  reported: Boolean,
  reviewer_name: String,
  reviewer_email: String,
  response: String,
  photos: Array
})

const reviewsMetaSchema = new Schema({
  product_id: Number,
  ratings: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number
  },
  recommended: {
    true: Number,
    false: Number
  }
  characteristics: {
    Size: {
      id: Number,
      value: Number
    }
    Width: {
      id: Number,
      value: Number
    }
    Comfort: {
      id: Number,
      value: Number
    }
    Quality: {
      id: Number,
      value: Number
    }
    Length: {
      id: Number,
      value: Number
    }
    Fit: {
      id: Number,
      value: Number
    }
  }
})

const Review = mongoose.model('Review', reviewsSchema);
const ReviewMeta = mongoose.model('ReviewMeta', reviewsMetaSchema);

mongoose.connect('mongodb://localhost:____');
