require('../models/db');
var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');
var Score = mongoose.model('Score');
var passport = require('passport');
var Account = require('../models/account');

module.exports.index = function(req, res, next) {
  res.render('index', {title: 'Delivery Appreciation',user : req.user});
};

module.exports.rules = function(req, res, next) {
  res.render('gamerules', {title: 'Game Rules',user : req.user});
};

module.exports.game = function(req, res, next) {
  res.render('game', {title: 'Game',user : req.user});
};

module.exports.about = function(req, res, next) {
  res.render('about', {title: 'About',user : req.user});
};

module.exports.design = function(req, res, next) {
  res.render('design', {title: 'Design',user : req.user});
};

module.exports.test = function(req, res, next) {
  res.render('testing', {title: 'Testing',user : req.user});
};

module.exports.signup = function(req,res,next){
	res.render('signup', {title:'Signup'});
};

module.exports.newSignup =  function(req, res) {
	Account.
		register(new Account({ username : req.body.username}),
			req.body.password,
		 function(err, account) {
				if (err) {
					return res.render('signup', {account : account});
				}
				passport.authenticate('local')(req, res, function () {
					var newEasy = new Score({'user':req.user.username, 'Score': 0, "Difficulty": "Easy"});
  					newEasy.save(function(err, data){
						if(err){
		  					console.log(err);
		  					res.status(500);
		  					res.render('error', {
		    					message:err.message,
		    					error: err
		  					});
						}
						else{
		  					console.log(data, 'easy saved');
    					}
  					});
					var newNorm = new Score({'user':req.user.username, 'Score': 0, "Difficulty": "Normal"});
  					newNorm.save(function(err, data){
						if(err){
		  					console.log(err);
		  					res.status(500);
		  					res.render('error', {
		    					message:err.message,
		    					error: err
		  					});
						}
						else{
		  					console.log(data, 'normal saved');
    					}
  					});
					var newHard = new Score({'user':req.user.username, 'Score': 0, "Difficulty": "Hard"});
  					newHard.save(function(err, data){
						if(err){
		  					console.log(err);
		  					res.status(500);
		  					res.render('error', {
		    					message:err.message,
		    					error: err
		  					});
						}
						else{
		  					console.log(data, 'hard saved');
    					}
  					});
					res.redirect('/');
				});
		});
};

module.exports.gameScore = function(req, res, next){
	Score.update({'Difficulty':req.body.gameDiff,'Score':{"$lt":req.body.gameScore},'user':req.user.username},{'Score':req.body.gameScore},{},function(err){
			if(err){res.render('error', {
            	message:err.message,
				error: err});
			}
			else{
				console.log('update complete')
				module.exports.game(req, res);
	    	}
	});                                           
};

module.exports.comment = function(req, res, next) {
    Comment.find().exec(
        function(err, commentData){
          if(err){res.render('error', {
            message:err.message,
            error: err});
          }
	  else{console.log('find complete');
	    res.render('comment',{'comments':commentData,'user':req.user});}
	}
      );                                           
};


module.exports.newComment = function(req,res){
  var newComment = new Comment({'user':req.user.username, 'comment': req.body.comment, 'date': new Date(), 'page': req.url});
  newComment.save(function(err, data){
    if(err){
      console.log(err);
      res.status(500);
      res.render('error', {
        message:err.message,
        error: err
      });
    }
    else{
      console.log(data, ' saved');
      module.exports.comment(req, res);
    }
  });
};

module.exports.leaderboard = function(req, res, next) {
	Score.find({"Score":{'$gt':0},"Difficulty":"Easy"}).sort({"Score":'descending'}).limit(10).exec(
		function(err, scoreDataEas){
			if(err){res.render('error', {
				message:err.message,
				error: err});
			}
			else{
				Score.find({"Score":{'$gt':0},"Difficulty":"Normal"}).sort({"Score":'descending'}).limit(10).exec(
        		function(err, scoreDataNorm){
          			if(err){res.render('error', {
            			message:err.message,
            			error: err});
          			}else{
						Score.find({"Score":{'$gt':0},"Difficulty":"Hard"}).sort({"Score":'descending'}).limit(10).exec(
        				function(err, scoreDataHard){
          				if(err){res.render('error', {
            				message:err.message,
            				error: err});
          				}else{
							console.log('find complete');
	    					res.render('leaderboard',{'ScoreEas':scoreDataEas,'ScoreNorm':scoreDataNorm,"ScoreHard":scoreDataHard,'user':req.user});
						}
					});
				}
			});
		}
	});
}



















