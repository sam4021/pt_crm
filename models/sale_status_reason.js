const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcryptjs');
const config = require ('../config/database');

//SaleStatusReason Schema
const SaleStatusReasonSchema = mongoose.Schema({
  sale: {
    type: ObjectId,
    ref: 'Sale'
  },
  reason: {
    type: String,
    required: true
  }
});


const SaleStatusReason = module.exports = mongoose.model('sale_status_reason', SaleStatusReasonSchema);
