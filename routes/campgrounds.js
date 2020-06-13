var express = require("express"),
 	router = express.Router(),
	CampGround = require("../models/campground"),
	Comment = require("../models/comment");

//INDEX-show all 
router.get("/", function(req, res) {
	CampGround.find({}, function(err, allCampGrounds) {
					if (err){
						console.log(err);
					} else {
						res.render("campgrounds/index", {campGrounds: allCampGrounds});
					}
	});		
					
	//res.render("campGrounds", {campGrounds: campGrounds});
});

//CREATE - add new campground to DB		
router.post("/", isLoggedIn, function(req, res) {
	//get data from forma
	var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampGround = {name: name, image: image, description: desc, author:author}
	
	//create new campGrounds and save to db
	CampGround.create(newCampGround, function(err, newCreated){
		if (err){
			console.log(err);
		} else {//redirect to campGrounds page
			res.redirect("/campGrounds");
		}
	})
	
	
});

//NEW - show form to create new campground
router.get("/new",isLoggedIn, function(req, res) {
	res.render("campgrounds/new")
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res) {
	//find the campground with provided provided
	CampGround.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if (err){
			console.log(err);
		} else {
			res.render("campgrounds/show",{campground : foundCampground})	;	
		}
	});
});

//edit campground route
router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
	CampGround.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

router.put("/:id", checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    CampGround.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

//delete campground route
router.delete("/:id", checkCampgroundOwnership, function(req, res){
	CampGround.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
        if (err) {
            console.log(err);
        }
        Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect("/campgrounds");
        });
    });
});

//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
function checkCampgroundOwnership(req, res, next){
	if(req.isAuthenticated()) {
		CampGround.findById(req.params.id, function(err, foundCampground) {
			if(err){
               res.redirect("back");
           	} else {
               // does user own the campground?
				// console.log(foundCampground.author);
				// console.log(foundCampground.author.id);
            	if(foundCampground.author.id.equals(req.user._id)) {
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