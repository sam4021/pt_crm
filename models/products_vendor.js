const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcryptjs');
const config = require ('../config/database');

//ProductsVendor Schema
const ProductsVendorSchema = mongoose.Schema({
  products: {
    type: ObjectId,
    ref: 'Products',
    unique: true
  },
  vendor: {
    type: ObjectId,
    ref: 'Vendor'
  }
});

const ProductsVendor = module.exports = mongoose.model('products_vendor', ProductsVendorSchema);
