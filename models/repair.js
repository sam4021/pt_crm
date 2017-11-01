const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcryptjs');
const config = require ('../config/database');

//Repair Schema
const RepairSchema = mongoose.Schema({
  cost:{
    amount:{type:Number,required:true},
    amount_paid:{type:Number,default:0},
    balance:{type:Number,default:0},
  },
  product:{
    title:{type:String, default:''},
    imei:{type:String, default:''},
  },
  client:{
    name:{type: String,required:true},
    phone:{type: Number,required:true},
    email:{type: String,default:''}
  },
  issue:{
    type: String,
    required: true
  },
  status: {
    type: String,
    default: ''
  },
  date: {
    arrival:{type:Date, required:true},
    sent_to_center: {type:Date, default:''},
    expected: {type:Date, default:''},
    client_collect: {type: Date, default:''}
  }
});

const Repair = module.exports = mongoose.model('repair', RepairSchema);
