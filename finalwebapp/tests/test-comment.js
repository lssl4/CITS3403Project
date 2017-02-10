var should = require("should");
var mongoose = require('mongoose');
var Comment = require("../app_server/models/comment.js");
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
    var comment = new Comment({
      user: 'testuser',
      comment: 'this is his/her comment',
      date: new Date(),
      page: '/test'//TODO
    }
    );
    comment.save(function(error) {
      if (error) console.log('error' + error.message);
      else console.log('no error');
      done();
    });
  });


 it('find comment in database', function(done) {
    Comment.findOne({ user: 'testuser' }, function(err, comment) {
      comment.user.should.eql('testuser');
      comment.comment.should.eql('this is his/her comment');
      console.log("   user: ", comment.user);

      console.log("   comment: ", comment.comment);
      done();
    });
  });

 afterEach(function(done) {
    Comment.remove({}, function() {
      done();
    });
  });





  
});