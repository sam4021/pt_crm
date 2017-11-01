const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcryptjs');
const config = require ('../config/database');

//Products Schema
const ProductsSchema = mongoose.Schema({
  category: {
    type: ObjectId,
    ref: 'ProductCategory'
  },
  brand: {
    type: ObjectId,
    ref: 'ProductBrand'
  },
  title: {
      type: String,
      default:''
  },
  url:{
    type:String,
    unique: true,
    default: ''
  },
  price:{
      type:Number,
      required: true
  },
  cost: {
    type: Number,
    required: true
  },
  warranty:{
    type: Number,
    default: 0
  },
  is_active:{
    type: Number,
    default: 0
  },
  created_date: { type: Date, default: Date.now },
  update_date: { type: Date, default: Date.now },
});

const Products = module.exports = mongoose.model('products', ProductsSchema);
