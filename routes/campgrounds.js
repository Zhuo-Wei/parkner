var express = require("express"),
 	router = express.Router(),
	CampGround = require("../models/campground")


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
	var name = req.body.name
	var image = req.body.image
	var desc = req.body.description
	var auther = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampGround = {name: name, image: image, description: desc, auther: auther};
	
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

//middleware
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;