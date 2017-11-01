const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const timestamps = require('mongoose-timestamp');

//Sale Schema
const SaleSchema = mongoose.Schema({
  status: {
    type: String,
    default:''
  },
  client:{
    first_name:{type: String,required:true},
    last_name:{type: String,default:''},
    phone:{type: String,default:''},
    email:{type: String,default:''}
  },
  user: {
    type: ObjectId,
    ref: 'User'
  }
});

SaleSchema.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
const Sale = module.exports = mongoose.model('sale', SaleSchema);
