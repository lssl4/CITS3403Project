var express = require('express');
var passport = require('passport');
var Account = require('../models/account');

var router = express.Router();
var ctrlMain = require('../controllers/ctrlMain');



/* GET home page. */
router.get('/', ctrlMain.index);

/* Comment Handlers */



/* GET Nav pages. */
router.get('/gamerules', ctrlMain.rules);

router.get('/game', ctrlMain.game);

router.get('/leaderboard', ctrlMain.leaderboard);

router.get('/about', ctrlMain.about);

router.get('/design', ctrlMain.design);

router.get('/testing', ctrlMain.test);

router.get('/comment', ctrlMain.comment);

router.post('/comment', ctrlMain.newComment);

router.post('/game',ctrlMain.gameScore);


router.get('/signup', ctrlMain.signup);

router.post('/signup', ctrlMain.newSignup);


router.get('/login', function(req, res, next) {
  res.render('login', {user : req.user});
});

router.post('/login', passport.authenticate('local'), function(req, res){
	res.redirect('/');
});

router.get('/logout', function(req, res) {
	req.logout();
		res.redirect('/');
});



module.exports = router;
