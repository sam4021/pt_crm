const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Payment Vendor Schema
const PaymentVendorSchema = mongoose.Schema({
  sale: {
    type: ObjectId,
    ref: 'Sale'
  },
  amount:{
    type:Number,
    required: true
  },
  balance: {
    type: Number,
    required:true
  },
  user: {
    type: ObjectId,
    ref: 'User'
  }
});

PaymentVendorSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
const PaymentVendor = module.exports = mongoose.model('payment_vendor', PaymentVendorSchema);
