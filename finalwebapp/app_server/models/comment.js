var mongoose = require('mongoose');

var comSchema = new mongoose.Schema(
      {
		user: String,
        comment: String,
        date: Date,
		page: String
      });

mongoose.model('Comment', comSchema, 'comments');      
