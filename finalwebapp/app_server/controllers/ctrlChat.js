require('../models/db');
var mongoose = require('mongoose');
var Message = mongoose.model('Message');

module.exports.connect = function(socket){
	console.log('User Connected');
	//socket.emit('message', "User connected");
}

module.exports.disconnect = function(){
  console.log('User Disconnected');
}

module.exports.message = function(msg, io){
  console.log('message recieved!');
  var message = new Message({message:msg, time: new Date()});
  message.save(function(err, data){
    if(err){
      console.log(err);
      res.status(500);
      res.render('error', {
        message:err.message,
        error: err
      });
    }
    else{
      console.log(data, 'message saved');
    }
  });
  io.emit('message', msg);
}


