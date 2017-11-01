const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const slugify = require('slugify');

let ProductCategory = require('../models/product_category');
let ProductBrand = require('../models/product_brand');

router.get('/', function(req, res, next){
  ProductBrand.find({},function(err, brand){
      res.render('pages/settings/index',{
        brand:brand
      });
  });
});

//Add Brand Post Route
router.post('/add-brand', function(req,res){
  req.checkBody('title','Title is required').notEmpty();

  //Get Errors
  let errors = req.validationErrors();

  if (errors) {
    res.render('pages/settings',{
      errors: errors
    });
  } else {
    let brand= new ProductBrand();
    brand.title = req.body.title;
    brand.url = slugify(req.body.title);

    brand.save(function(err){
      if(err){
        req.flash('danger','Brand not added');
        console.log(err);
        return;
      } else{
        req.flash('success','Brand added');
        res.redirect('/settings');
      }
    });
  }
});

//Load Edit Brand
router.get('/edit-brand/:id', function(req, res){
  ProductBrand.findById(req.params.id,function(err, brand){
    res.render('pages/settings/edit-brand',{
      brand: brand
    });
  });
});

//Update Edit Brand Post Route
router.post('/edit-brand/:id', function(req,res){
  let brand= {};
  brand.title = req.body.title;
  brand.url = slugify(req.body.title);

  let query = {_id:req.params.id}

  ProductBrand.update(query, brand, function(err){
    if(err){
      console.log(err);
      return;
    } else{
      res.redirect('/settings');
    }
  });
});

//Display Categories
router.get('/category', function(req, res, next){
  ProductCategory.find({}, (err, category) =>{
    res.render('pages/settings/category_index',{
      category: category
    });
  });
});

//Add Main Category Post Route
router.post('/add-main-category', function(req,res){
  req.checkBody('title','Title is required').notEmpty();

  //Get Errors
  let errors = req.validationErrors();

  if (errors) {
    res.render('pages/settings/category',{
      errors: errors
    });
  } else {
    let cat= new ProductCategory();
    cat.title = req.body.title;


    cat.save(function(err){
      if(err){
        req.flash('danger','Category not added');
        console.log(err);
        return;
      } else{
        req.flash('success','Category added');
        res.redirect('/settings/category');
      }
    });
  }
});

//AJax function
router.get('/getcat/:id',function(req, res){
  let query = {_id:req.params.id}

  Category.findById(req.params.id, function(err, category){
    res.send('<select name="parent" class="form-control"><option value="'+category.id+'">'+category.title+'</option></select>');
  });
});

//Add Category Post Route
router.post('/add-category', function(req,res){
  req.checkBody('title','Title is required').notEmpty();
  req.checkBody('parent','Parent is required').notEmpty();

  //Get Errors
  let errors = req.validationErrors();

  if (errors) {
    res.render('pages/settings/category',{
      errors: errors
    });
  } else {
    let cat= new ProductCategory();
    cat.title = req.body.title;
    cat.parent = req.body.parent;


    cat.save(function(err){
      if(err){
        req.flash('danger','Category not added');
        console.log(err);
        return;
      } else{
        req.flash('success','Category added');
        res.redirect('/settings');
      }
    });
  }
});
module.exports = router;
