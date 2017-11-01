const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const slugify = require('slugify');

let ProductCategory = require('../models/product_category');
let Products = require('../models/products');
let ProductBrand = require('../models/product_brand');
let Vendor = require('../models/vendor');
let ProductsVendor = require('../models/products_vendor');

router.get('/', function(req, res, next){
  Products.find({},function(err, products){
    ProductBrand.find({}, function(err, brand){
      ProductCategory.find({}, function(err, category){
        res.render('pages/products/index',{
          products: products,
          category: category,
          brand: brand
        });
      });
    });
  });
});

//Create Form
router.get('/add', function(req, res, next){
  ProductBrand.find({}, function(err, brands){
    ProductCategory.find({}, (err, category) =>{
      Vendor.find({}, function(err, vendor){
        res.render('pages/products/add',{
          category: category,
          brands:brands,
          vendor: vendor
        });
      });
    });
  });
});

//Add Products
router.post('/add', (req, res) => {
  req.checkBody('title','Title is required').notEmpty();

  //Get Errors
  let errors = req.validationErrors();

  if (errors) {
    res.render('pages/products/add',{
      errors: errors
    });
    console.log(errors);
  } else {

    let products= new Products();
    products.title = req.body.title;
    products.url = slugify(req.body.title);
    products.brand = req.body.brand;
    products.price = req.body.price;
    products.cost = req.body.cost;
    products.category = req.body.category;
    // products.vendor = req.body.vendor;
    // let options = [];
    // let ass = req.body;
    // for(let op of jObject.options){
    //   options[op]=req.body.op;
    //   console.log(op);
    //   console.log(jObject.op);
    // }
    // console.log(options);


    products.save(function(err, new_product){
      let prodId = new_product._id;

      if(err){
        if(req.body.vendor !=''){
          let p_ven= new ProductsVendor();
          p_ven.products = prodId;
          p_ven.vendor= req.body.vendor;
          products.save(function(err){});

        }
        req.flash('danger','Product not added');
        console.log(err);
        return;
      } else{
        req.flash('success','Product added');
        res.redirect('/products');
      }
    });
  }
});

//Products View
router.get('/view/:id', function(req, res, next){
  Products.findById(req.params.id, function(err, products){
    ProductBrand.find({}, function(err, brand){
    ProductCategory.find({}, (err, category) =>{
      Vendor.find({}, function(err, vendor){
        ProductsVendor.find({products:req.params.id},(err,pvendor)=>{
        res.render('pages/products/view',{
          products: products,
          category: category,
          brand:brand,
          vendor: vendor,
          pvendor:pvendor
        });
      });
      });
    });
  });
});
});

//Assign Vendor
router.post('/assign_vendor', (req, res) => {
  req.checkBody('vendor','Vendor is required').notEmpty();

  //Get Errors
  let errors = req.validationErrors();

  if (errors) {
    res.render('pages/products/add',{
      errors: errors
    });
    console.log(errors);
  } else {
    let prod_ven= new ProductsVendor();
    prod_ven.products = req.body.product_id;
    prod_ven.vendor = req.body.vendor;

      prod_ven.save(function(err){
      if(err){
        req.flash('danger','Product not added');
        console.log(err);
        return;
      } else{
        req.flash('success','Product added');
        res.redirect('/products/view/'+req.body.product_id);
      }
      });
  }
});

//Products edit
router.get('/edit/:id', function(req, res, next){
  Products.findById(req.params.id, function(err, products){
    ProductBrand.find({}, function(err, brands){
      ProductCategory.find({}, (err, category) =>{
        Vendor.find({}, function(err, vendor){
          ProductsVendor.find({products:req.params.id},(err,pvendor)=>{
            res.render('pages/products/edit',{
              products: products,
              category: category,
              brands:brands,
              vendor: vendor,
              pvendor:pvendor
            });
          });
        });
      });
    });
  });
});

//Update Product info
router.post('/edit/:id', (req, res) => {

     let query = {_id: req.params.id};
     let title = req.body.title;
     let url = slugify(req.body.title);
     let brand = req.body.brand;
     let price = req.body.price;
     let cost = req.body.cost;
     let category = req.body.category;

    Products.updateMany({ _id:req.params.id },{ $set:{ title: title ,url: url ,brand: brand , price: price , cost: cost,category: category }}, { multi: true }).exec();
         res.redirect('/products/view/'+req.params.id);
});

//Update Product Status
router.post('/product_status/:id', (req, res) => {

     let query = {_id: req.params.id};
     let status =req.body.status;

      Products.update(query,{ is_active: status}).exec();
         //res.redirect('/sale/sal/'+req.body.id);
});

////////////////////////////////
////////AJax Functions/////////
///////////////////////////////

module.exports = router;
