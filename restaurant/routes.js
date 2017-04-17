var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

var cookieParser = require('cookie-parser');
var session = require('express-session');
var loginSession = require('express-session');

router.use(cookieParser());
router.use(session({secret: "Shh, its a secret!"}));
router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
router.use(upload.array()); // for parsing multipart/form-data
router.use(express.static('public'));

//-------------------- db conn --------------------//
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/restaurants');


//-------------------- schemas --------------------//
var restaurantSchema = mongoose.Schema({
  id: String,
  name: String
});
var Restaurant = mongoose.model("Restaurant", restaurantSchema);


var menuSchema = mongoose.Schema({
  id: String,
  name: String,
  description: String,
  price: Number,
  course: String,
  Restaurant: [{type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'}]
});
var Menu = mongoose.model("Menu", restaurantSchema);


//-------------------- schemas complete --------------------//

//-------------------- LOGIN --------------------//

router.get('/restaurant/login', function (req, res) {  
  res.render('restaurant_login',{
  main_tag: "Login into Restaurant Webapp!"
  // var resId = mongoose.Types.ObjectId();
 //  req.loginSession.secret_id = resId; 

 });
});

router.post('/restaurant/doLogin', function (req, res) {  
  //redirect to list after login
 getAllRestaurantsAndDisplay(req, res);
});

//-------------------- CREATE --------------------//
router.get('/restaurant/create', function (req, res) {  
	res.render('restaurant_create',{
   main_tag: "Create a restaurant"
 });
});
router.post('/restaurant/create', function (req, res) {  
  var resId = mongoose.Types.ObjectId();
  var resName = req.body.restaurant_name;
  console.log("name " + resName);
  var resModel = new Restaurant({id: resId, name: resName});
  
  resModel.save(function saveChat(error, savedChatModel) {
    if (error) {
      console.log("Error, resModel not saved");
      return;
    }
    console.log("Success: resModel saved");
  });
  
  res.render('restaurant_success',{
   message_tag: "Your Restaurant has been created!!"
  });
});

//-------------------- LIST --------------------//
router.get('/restaurant/list', function (req, res) {    
 
  // object of all the users
    getAllRestaurantsAndDisplay(req, res);
  
});

function getAllRestaurantsAndDisplay(req, res){
   Restaurant.find({}, function(err, restaurants) {
    if (err) throw err;

    for (var i = restaurants.length - 1; i >= 0; i--) {
     console.log(restaurants[i].name + " "+ restaurants[i].id);
    };
    res.render('restaurant_list_success', { 
      main_tag: "Available restaurants",
      restaurant_list: restaurants
    });
  });
}
//-------------------- DELETE --------------------//
router.get('/restaurant/clear', function(req, res){
  Restaurant.remove({}, function(err, response){
    if (err) throw err;
    Restaurant.find({}, function(err, restaurants) {
      if (err) throw err;

  // object of all the users
  
      console.log("No of restaurants: " + restaurants.length);
  
      res.render('restaurant_success', { 
      message_tag: "Cleared All Restaurants",
      })
    });
  });
});

router.get('/restaurant/deleteConfirmation/:id', function(req, res){
  req.session.delete_id = req.params.id; 
  console.log("Delete id confirmation: "+ req.params.id);
   res.render('restaurant_delete', { 
    main_tag: "Delete Restaurant?",
    });
});

router.post('/restaurant/doDelete', function(req, res){
  console.log("Delete Id: "+ req.session.delete_id);
  if(req.session.delete_id){
    Restaurant.remove({id:req.session.delete_id},  function(err, restaurants) {
      if (err) throw err;
        res.render('restaurant_success', { 
        main_tag: "Deleted Restaurant!"
        });
      });
    req.session.delete_id="";
  }
});

//-------------------- EDIT --------------------//
router.post('/restaurant/doEdit', function(req, res){
  var resName = req.body.restaurant_name;
  console.log("Edit Name: "+ resName);
  if(req.session.edit_id){
    Restaurant.update({id:req.session.edit_id}, {name: resName},  function(err, restaurants) {
      if (err) throw err;
        res.render('restaurant_success', { 
        main_tag: "Edited Restaurant!"
        });
      });
    req.session.edit_id="";
  }
});

router.get('/restaurant/edit/:id', function(req, res){
var idValue = req.params.id;
  console.log("Edit id: "+ idValue);
  req.session.edit_id = req.params.id; 

  Restaurant.findOne({id:idValue}, function(err, restaurants) {
      if (err) throw err;
        res.render('restaurant_edit', { 
        main_tag: "Edit Restaurant "+ restaurants.name + " ?",
        });
      });
});
//-------------------- SAMPLES --------------------//
router.get('/', function(req, res){
 res.send('GET first route on things.');
});

router.get('/firstpug', function(req, res){
  res.render('first_pug',{
   greeting_tag: "What would you like me to say?"
 });
});

router.post('/', function(req, res){
 res.send('POST second route on things.');
});
//export this router to use in our index.js
module.exports = router;
