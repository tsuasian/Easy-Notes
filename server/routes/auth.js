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
  //check uniqueness
  User.find({username: req.body.username})
  .then( (uniqueuser) => {
    if (uniqueuser.length !== 0) {
      console.log('user already exists', uniqueuser);
      res.send("username taken")
    } else if (req.body.username == "" ){
      console.log("username null");
      res.send("empty username")
    } else {
      //otherwise, save the result
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

    }
  })
});

//user null if not logged in
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (!err && user) {
        req.login(user, (err) => {
          if (err) {
            res.status(500)
              .json({ success: false, err: err });
          } else {
            res.status(200)
              .json({ success: true });
          }
        })
      } else {
        res.status(500)
          .json({ success: false });
      }
    })(req, res, next);
  });


  router.get('/getUser', (req, res, next) => {
    res.json({user: req.user})
  })

  router.get('/logout', function(req, res) {
    console.log('hit logout route');
    req.logout();
  });



return router;
};//close function
