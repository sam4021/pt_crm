const mongoose = require('mongoose');
const config = require ('../config/database');

//Products Brands Schema
const ProductBrandSchema = mongoose.Schema({
  title: {
    type: String,
    unique:true,
    required: true
  },
  url:{
    type:String,
    unique: true,
    default: ''
  }
});

const ProductBrand = module.exports = mongoose.model('product_brand', ProductBrandSchema);
