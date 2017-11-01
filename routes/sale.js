const express = require('express');
const router = express.Router();
//const global = require('./config/global');

let User = require('../models/user');
let Sale = require('../models/sale');
let Vendor = require('../models/vendor');
let Products = require('../models/products');
let ProductBrand = require('../models/product_brand');
let SaleProducts = require('../models/sale_products');
let PaymentClient = require('../models/payment_client');
let ProductsVendor = require('../models/products_vendor');
let ProductCategory = require('../models/product_category');
let CollectedProductsVendor = require('../models/collected_product_vendor');
let CollectedProductsVendorInfo = require('../models/collected_product_vendor_info');


router.get('/', function(req, res, next){
  Sale.find({},function(err, sale){
    SaleProducts.find({},function(err, sale_products){
      Products.find({},function(err, products){
        PaymentClient.find({},(err,payment)=>{
          res.render('pages/sale/index',{
            sale: sale,
            saleProd:sale_products,
            products: products,
            payment: payment
          });
        });
      });
    });
  });
});

//CREATE NEW SALE
router.get('/add', function(req, res, next){
  Products.find({is_active:1},function(err, products){
    ProductBrand.find({}, function(err, brand){
      ProductCategory.find({}, function(err, category){
        ProductsVendor.find({},function(err, pvendor){
          Vendor.find({},function(err, vendor){
            res.render('pages/sale/add',{
              products: products,
              category: category,
              brand: brand,
              pvendor:pvendor,
              vendor: vendor
            });
          });
        });
      });
    });
  });
});

//SAVE NEW SALE
router.post('/add', function(req, res){
  let sale= new Sale();
  sale.status = "Open";
  sale.client.first_name = req.body.first_name;
  sale.client.last_name = req.body.last_name;
  sale.client.phone = req.body.phone;
  sale.client.email = req.body.email;
  sale.user = req.user.id;

  sale.save(function(err, new_sale){
    let saleId = new_sale._id;
    if(err){
      req.flash('danger','Sale not Create');
      console.log(err);
      return;
    } else{

      let product =req.body.prod;
      let prod='a';
      for (var i = 0; i < product.length; i++) {
        let sale_prod= new SaleProducts();
        Products.findById(product[i],function(err, prod){
           //prod = prod;
           sale_prod.sale= saleId;
           sale_prod.product = prod.id;
           sale_prod.qty = 1;
           sale_prod.price = prod.price;
           sale_prod.cost = prod.cost;
           sale_prod.save(function(err){
             if(err){
               console.log(err);
             }
           });
        });
      }

      req.flash('success','Sale Created');
      res.redirect('/sale/sal/'+saleId);
    }
  });
});

//Sale View FROM ID
router.get('/sal/:id', function(req, res, next){
  Sale.findById(req.params.id,function(err, sale){
    SaleProducts.find({},function(err, sale_products){
      Products.find({}, function(err, products){
        ProductsVendor.find({},function(err, pvendor){
          Vendor.find({},function(err, vendor){
            PaymentClient.find({}, (err, payment)=>{
              res.render('pages/sale/sal',{
                products: products,
                saleProd: sale_products,
                sale: sale,
                pvendor:pvendor,
                vendor: vendor,
                payment: payment
              });
            });
          });
        });
      });
    });
  });
});

// Products Picked From Vendor
router.get('/collected_products', function(req, res, next){
  CollectedProductsVendor.find({},function(err, cproducts){
    CollectedProductsVendorInfo.find({},(err,cprodI)=>{
      Products.find({},function(err, products){
        ProductBrand.find({}, function(err, brand){
            ProductsVendor.find({},function(err, pvendor){
              Vendor.find({},function(err, vendor){
              res.render('pages/sale/vendor/collected_products',{
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

router.get('/sal/:id', function(req, res, next){
  Sale.findById(req.params.id,function(err, sale){
    SaleProducts.find({},function(err, sale_products){
      Products.find({}, function(err, products){
        ProductsVendor.find({},function(err, pvendor){
          Vendor.find({},function(err, vendor){
            res.render('pages/sale/sal',{
              products: products,
              saleProd: sale_products,
              sale: sale,
              pvendor:pvendor,
              vendor: vendor
            });
          });
        });
      });
    });
  });
});
});

//Add new Products To Collected List
router.get('/collected_new', (req,res,next)=>{
  Products.find({},function(err, products){
    ProductBrand.find({}, function(err, brand){
      ProductCategory.find({}, function(err, category){
        ProductsVendor.find({},function(err, pvendor){
          Vendor.find({},function(err, vendor){
            res.render('pages/sale/vendor/collected_new',{
              products: products,
              category: category,
              brand: brand,
              pvendor:pvendor,
              vendor: vendor
            });
          });
        });
      });
    });
  });
});

//Save New Products Collected form Vendor
router.post('/collected_new', (req, res) => {
  req.checkBody('col_vendor','Vendor is required').notEmpty();

  //Get Errors
  let errors = req.validationErrors();

  if (errors) {
    res.render('pages/sale/vendor/collected_new',{
      errors: errors
    });
    console.log(errors);
  } else {

    let prod= new CollectedProductsVendor();
    prod.vendor = req.body.col_vendor;
    prod.user = req.user.id;

    let col=req.body.col;
    for (var i = 0; i < col.length; i++) {
      prod.product = col[i];
      prod.save(function(err){
        if(err){console.log(err);return;}
      });
    }
        req.flash('success','Product added');
        res.redirect('/sale/collected_products');

  }
  let col=req.body.col;
  for (var i = 0; i < col.length; i++) {
    console.log('col:'+col[i]);
    console.log('qty:'+ req.body.col_qty_+col[i]);
  }

});

//Add new IMEI
router.get('/assign_imei/:id', (req,res,next)=>{
  CollectedProductsVendor.findById(req.params.id,function(err, cproducts){
    Products.find({},function(err, products){
      Vendor.find({},function(err, vendor){
        res.render('pages/sale/assign_imei',{
          products: products,
          cproducts: cproducts,
          vendor: vendor
        });
      });
    });
  });
});

//Save New Product Imei of Collected from Vendor
router.post('/assign_imei/:id', (req, res) => {
  req.checkBody('product_id','Product is required').notEmpty();
  req.checkBody('vendor_id','Vendor is required').notEmpty();

  //Get Errors
  let errors = req.validationErrors();

  if (errors) {
    res.render('pages/sale/vendor/collected_products',{
      errors: errors
    });
    console.log(errors);
  } else {



     let imei=req.body.imei;

     for (var i = 0; i < imei.length; i++) {
       let prod= new CollectedProductsVendorInfo();
       prod.collected = req.params.id;
       prod.status = 'Collected';
      prod.imei =imei[i];
      //console.log(prod);
      prod.save(function(err){
        if(err){console.log(err);return;}
      });
     }
        req.flash('success','IMEI added');
        res.redirect('/sale/collected_products');
  }

});

//View Vendor Product Info
router.get('/vendor_prod_info/:id', (req,res,next)=>{
  CollectedProductsVendor.findById(req.params.id,function(err, cproducts){
    CollectedProductsVendorInfo.find({collected:req.params.id},(err, productsInfo)=>{
      Products.find({},function(err, products){
        Vendor.find({},function(err, vendor){
          res.render('pages/sale/vendor/vendor_prod_info',{
            products: products,
            cproducts: cproducts,
            vendor: vendor,
            productsInfo: productsInfo
          });
        });
      });
    });
  });
});

//Update Product info Sale
router.post('/edit_prod_sale/:id', (req, res) => {

     let edit = {};
     let query = {_id: req.params.id};
     qty =req.body.qty;
     price =req.body.price;
     cost =req.body.cost;
    // console.log(req.params.id);
     let prod= new SaleProducts();
      // prod.update( query,{$set:edit},       function(err, results){
      //   if(err){
      //     console.log(err);return;
      //   } else{
      //     console.log(results);
      //   }
      // });

      SaleProducts.updateMany({ _id:req.params.id },{ $set:{ qty: qty , price: price , cost: cost }}, { multi: true }).exec();
         res.redirect('/sale/sal/'+req.body.id);
});

//Update Product IMEI
router.post('/add_imei/:id', (req, res) => {

     let query = {_id: req.params.id};
     let imei =req.body.imei;

      SaleProducts.updateMany({ _id:req.params.id },{ $set:{ imei: imei }}, { multi: true }).exec();
         res.redirect('/sale/sal/'+req.body.id);
});

//Save Sale Payment
router.post('/sale_payment/:id', (req, res) => {
    let balance = req.body.balance - req.body.amount;

       let payment= new PaymentClient();
       payment.sale = req.body.id;
       payment.amount = req.body.amount;
       payment.balance = balance;
       payment.user =req.user.id;

      payment.save(function(err){
        if(err){console.log(err);return;}
      });

        req.flash('success','Payment added');
        res.redirect('/sale/sal/'+req.body.id);

});

//Update Sale Status
router.post('/sale_status/:id', (req, res) => {

     let query = {_id: req.params.id};
     let status =req.body.status;

      Sale.update(query,{ status: status}).exec();
         //res.redirect('/sale/sal/'+req.body.id);
});

////////////////////////////////
////////AJax Functions/////////
///////////////////////////////

//Collected Products From Vendor
router.get('/col_vendor/:id',function(req, res,next){
  Vendor.findById(req.params.id,function(err, vendor){
    ProductsVendor.find({vendor:req.params.id},function(err, pvendor){
      Products.find({},function(err, products){
        ProductBrand.find({}, function(err, brand){
          ProductCategory.find({}, function(err, category){
            if(err){console.log(err);return err;}
            res.render('pages/ajax/col_vendor',{
              products: products,
              category: category,
              brand: brand,
              pvendor:pvendor,
              vendor: vendor
            });
          });
        });
      });
    });
  });
});

//Edit Product Sale Info
router.get('/edit_prod_sale/:id', function(req, res, next){
    Sale.findById(req.params.id,function(err, sale){
      SaleProducts.findById(req.params.id,function(err, saleProd){
        Products.find({}, function(err, products){
          ProductsVendor.find({},function(err, pvendor){
            Vendor.find({},function(err, vendor){
              res.render('pages/ajax/edit_prod_sale',{
              products: products,
              saleProd: saleProd,
              sale: sale,
              pvendor:pvendor,
              vendor: vendor
              });
            });
          });
        });
      });
    });
});

//Get Product Sale Info
router.get('/add_imei/:id', function(req, res, next){
    Sale.findById(req.params.id,function(err, sale){
      SaleProducts.findById(req.params.id,function(err, saleProd){
        Products.find({}, function(err, products){
          ProductsVendor.find({},function(err, pvendor){
            Vendor.find({},function(err, vendor){
              res.render('pages/ajax/add_imei',{
              products: products,
              saleProd: saleProd,
              sale: sale,
              pvendor:pvendor,
              vendor: vendor
              });
            });
          });
        });
      });
    });
});

//Get Product Sale Info
router.get('/edit_imei/:id', function(req, res, next){
    Sale.findById(req.params.id,function(err, sale){
      SaleProducts.findById(req.params.id,function(err, saleProd){
        Products.find({}, function(err, products){
          ProductsVendor.find({},function(err, pvendor){
            Vendor.find({},function(err, vendor){
              res.render('pages/ajax/edit_imei',{
              products: products,
              saleProd: saleProd,
              sale: sale,
              pvendor:pvendor,
              vendor: vendor
              });
            });
          });
        });
      });
    });
});

//Sale Payment
router.get('/sale_payment/:id', function(req, res, next){
    Sale.findById(req.params.id,function(err, sale){
      SaleProducts.find({},function(err, saleProd){
        PaymentClient.find({sale:req.params.id}, function(err, payment){
          res.render('pages/ajax/sale_payment',{
          payment: payment,
          saleProd: saleProd,
          sale: sale
          });
        });
      });
    });
});


module.exports = router;
