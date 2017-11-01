const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const slugify = require('slugify');

let User = require('../models/user');
let Sale = require('../models/sale');
let Vendor = require('../models/vendor');
let Products = require('../models/products');
let SaleProducts = require('../models/sale_products');
let ProductBrand = require('../models/product_brand');
let ProductsVendor = require('../models/products_vendor');
let ProductCategory = require('../models/product_category');
let CollectedProductsVendor = require('../models/collected_product_vendor');
let CollectedProductsVendorInfo = require('../models/collected_product_vendor_info');

router.get('/', function(req, res, next){
  Vendor.find({},function(err, vendors){
      res.render('pages/vendor/index',{
        vendors: vendors
      });
  });
});

//Add Vendor Form
router.get('/add', function(req, res, next){
  res.render('pages/vendor/add');
});

//Add Vendor Route
router.post('/add', function(req,res){
  const name = req.body.name;
  const url = slugify(req.body.name);
  const email = req.body.email;
  const phone = req.body.phone;
  const location = req.body.location;

  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();

  //Get Errors
  let errors = req.getValidationResult();

  // if (errors) {
  //   //console.log(first_name);
  //
  //   res.render('pages/driver/add',{
  //     errors: errors
  //   });
  // } else {
    let vendor= new Vendor({
      name:name,
      url:url,
      email:email,
      phone:phone,
      location: location
    });

        vendor.save(function(err){
          if (err) {
            console.log(err);
          } else {
            req.flash('success', 'Vendor is now Registered and can log in');
            res.redirect('/vendor');
          }
        });


  //}
});

//Collected Product Edit
router.get('/collected/edit/:id', function(req, res, next){
  CollectedProductsVendor.find({},function(err, cproducts){
    CollectedProductsVendorInfo.findById(req.params.id,(err,cprodI)=>{
      Products.find({},function(err, products){
        ProductBrand.find({}, function(err, brand){
            ProductsVendor.find({},function(err, pvendor){
              Vendor.find({},function(err, vendor){
              res.render('pages/vendor/collected/edit',{
                products: products,
                brand: brand,
                pvendor:pvendor,
                vendor: vendor,
                cproducts: cproducts,
                cprodI:cprodI
      });
    });
});
});
});
});
});
});

//Update Product IMEI
router.post('/collected/edit/:id', (req, res) => {

     let query = {_id: req.params.id};
     let imei =req.body.imei;

      CollectedProductsVendorInfo.updateMany({ _id:req.params.id },{ $set:{ imei: imei }}, { multi: true }).exec();
         res.redirect('/sale/vendor_prod_info/'+req.body.id);
});

//Collected Product Edit
router.get('/collected/status/:id', function(req, res, next){
  CollectedProductsVendor.find({},function(err, cproducts){
    CollectedProductsVendorInfo.findById(req.params.id,(err,cprodI)=>{
      Products.find({},function(err, products){
        ProductBrand.find({}, function(err, brand){
            ProductsVendor.find({},function(err, pvendor){
              Vendor.find({},function(err, vendor){
              res.render('pages/vendor/collected/status',{
                products: products,
                brand: brand,
                pvendor:pvendor,
                vendor: vendor,
                cproducts: cproducts,
                cprodI:cprodI
      });
    });
});
});
});
});
});
});

//Update Product IMEI Status
router.post('/collected/status/:id', (req, res) => {

     let query = {_id: req.params.id};
     let status =req.body.status;

      CollectedProductsVendorInfo.updateMany({ _id:req.params.id },{ $set:{ status: status }}, { multi: true }).exec();
         res.redirect('/sale/vendor_prod_info/'+req.body.id);
});

//Vendor Payments
router.get('/payments/', function(req, res, next){
  CollectedProductsVendor.find({},function(err, cproducts){
    CollectedProductsVendorInfo.find({status:"Sold"},(err,cprodI)=>{
      Products.find({},function(err, products){
        ProductBrand.find({}, function(err, brand){
            ProductsVendor.find({},function(err, pvendor){
              Vendor.find({},function(err, vendor){
                SaleProducts.find({},(err,saleP)=>{
                Sale.find({status:"Closed"},(err, sale)=>{
                res.render('pages/vendor/payments/index',{
                  products: products,
                  brand: brand,
                  pvendor:pvendor,
                  vendor: vendor,
                  cproducts: cproducts,
                  cprodI:cprodI,
                  saleP: saleP,
                  sale: sale
                });
              });
              });
              });
          });
        });
      });
    });
  });
});

module.exports = router;
