var mongoose = require('mongoose');

var scoreSchema = new mongoose.Schema(
      {
		user: String,
        Score: Number,
        Difficulty: String,
      });

mongoose.model('Score', scoreSchema, 'score');      
