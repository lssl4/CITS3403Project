var should = require("should");
var mongoose = require('mongoose');
var Message = require("../app_server/models/chat.js");
var db;
var timeTest;

describe('Message', function(){

  before(function(done){

    db = mongoose.connect('mongodb://shaunleong:password123@ds061984.mlab.com:61984/testingwebdev');
    done();

  });



  after(function(done) {
    mongoose.connection.close();
    done();
  });


 beforeEach(function(done) {

    timeTest = new Date();
    var message = new Message({
      message: 'this is his/her message',

      time: timeTest
      
    }
    );
    message.save(function(error) {
      if (error) console.log('error' + error.message);
      else console.log('no error');
      done();
    });
  });


 it('find message in database', function(done) {
    Message.findOne({ message: 'this is his/her message' }, function(err, message) {
      message.message.should.eql('this is his/her message');
      message.time.should.eql(timeTest);
      console.log("   message: ", message.message);
      console.log("   time: ", message.time);

      done();
    });
  });

 afterEach(function(done) {
    Message.remove({}, function() {
      done();
    });
  });





  
});