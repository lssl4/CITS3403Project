var should = require("should");
var mongoose = require('mongoose');
var Score = require("../app_server/models/score.js");
var db;


describe('Comment', function(){

  before(function(done){

    db = mongoose.connect('mongodb://shaunleong:password123@ds061984.mlab.com:61984/testingwebdev');
    done();

  });



  after(function(done) {
    mongoose.connection.close();
    done();
  });


 beforeEach(function(done) {
    var score = new Score({
      user: 'testuser',
      Score: 1000,
      difficulty: Easy
    }
    );
    score.save(function(error) {
      if (error) console.log('error' + error.message);
      else console.log('no error');
      done();
    });
  });


 it('find comment in database', function(done) {
    Score.findOne({ user: 'testuser' }, function(err, score) {
      score.user.should.eql('testuser');
      score.score.should.eql(1000);
      console.log("   user: ", score.user);

      console.log("   score: ", score.Score);
      done();
    });
  });

 afterEach(function(done) {
    Score.remove({}, function() {
      done();
    });
  });





  
});