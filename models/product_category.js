const mongoose = require('mongoose');
const config = require ('../config/database');

//ProductCategory Schema
const ProductCategorySchema = mongoose.Schema({
  title: {
      type: String,
      unique: true,
      required: true
  },
  parent: {
    type: String,
    default: 0
  }
});

const ProductCategory = module.exports = mongoose.model('product_category', ProductCategorySchema);
