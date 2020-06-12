var express = require("express"),
 	router = express.Router({mergeParams: true}),
	CampGround = require("../models/campground"),
	Comment = require("../models/comment");

//comment new
router.get("/new",isLoggedIn, function(req, res){
	CampGround.findById(req.params.id, function(err, campground) {
		if (err){
			console.log(err);
		} else {
			res.render("comments/new",{campground : campground})	;	
		}
	});
});

//comment create
router.post("/", isLoggedIn, function(req, res){
   //lookup campground using ID
   CampGround.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
			   comment.author.id = req.user._id;
			   comment.author.username = req.user.username;
			   comment.save();
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});


//middleware
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;