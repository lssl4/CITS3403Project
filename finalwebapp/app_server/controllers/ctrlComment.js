var Comment = mongoose.model('Comment');

module.exports.retrieveComment = function (req,res){
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


/*add person*/
module.exports.newComment = function(req,res){
  var newComment = new Comment({'user':req.user, comment: req.body.comment, like: 0, page: req.url});
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
      index(req, res);
    }
  });
};

