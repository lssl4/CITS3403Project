var mongoose = require('mongoose');

var msgSchema = new mongoose.Schema(
      {
		message: String,
        time: Date
      });

mongoose.model('Message', msgSchema, 'messages');      
