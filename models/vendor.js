const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require ('../config/database');

//Vendor Schema
const VendorSchema = mongoose.Schema({
  name: {
      type: String,
      default:''
  },
  url:{
    type:String,
    unique: true,
    default: ''
  },
  phone: {
      type: Number,
      default:''
  },
  email: {
    type: String,
    unique:true,
    lowercase: true,
    required: true
  },
  location:{
    type: String,
    required: true
  },
  is_active:
  {
    type: Number,
    default: 0
  }
});

const Vendor = module.exports = mongoose.model('vendor', VendorSchema);
