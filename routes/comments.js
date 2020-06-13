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

//comment edit route
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           res.redirect("back");
       } else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
	   }
	});
});

//comment update
router.put("/:comment_id", checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
		   res.redirect("/campgrounds/" + req.params.id);
	   }
	});
});

//comment destroy router
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err, campgroundRemoved){
        if (err) {
            res.redirect("back");
        }
		res.redirect("/campgrounds/" + req.params.id);
        
       
    });
});

//middleware
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
function checkCommentOwnership(req, res, next){
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if(err){
               res.redirect("back");
           	} else {
               // does user own the campground?
            	if(foundComment.author.id.equals(req.user._id)) {
            	next();
            	} else {
            	    res.redirect("back");
            	}
           	}
        });			
	} else {
		res.redirect("back");
	}
}

module.exports = router;