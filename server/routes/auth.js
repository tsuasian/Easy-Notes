var express = require('express');
var router = express.Router();
import User from '../models/user';
import passport from 'passport';
import LocalStrategy from 'passport-local'
import session from 'express-session'

export default function(passport){
/* GET home page. */
// router.get('/signup', function(req, res){
//   // res.render('signup');
// });

// router.get('/login', function(req, res) {
//   console.log("LOGIN GET");
//   // res.render(login')
// });

router.post('/signup', function(req, res){
  new User({
    username: req.body.username,
    password: req.body.password
  }).save()
  .then(function(user){
    console.log('SUCCESS', user);
    res.send(user);
  })
  .catch(function(error){
    console.log("ERROR", error);
    res.send(error)
  })
});

//user null if not logged in
router.post('/login', (req, res, next) => passport.authenticate('local', (err, user, info) => {
  //respond with json file
  res.json({user, err})
})(req, res, next));



router.get('/logout', function(req, res){
  // req.logout;
  // res.redirect('login')
});


return router;
};//close function
