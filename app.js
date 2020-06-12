var express = require("express"),
 	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose")
	Comment = require("./models/comment")
	CampGround = require("./models/campground")
	seedDB = require("./seeds")
	//User
seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_project", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


// CampGround.create(
// 	{	
// 		name: "lala", 
// 		image: "https://cdngeneral.rentcafe.com/dmslivecafe/3/455120/Main-Genesee-1(2).jpg?quality=85&scale=both",
// 		description: "kunkun"
// 	}, function(err, campGround) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			console.log("new one get");
// 			console.log(campGround);
// 		}
// });

app.get("/", function(req, res) {
	res.render("landing");
});

// var campGrounds = [
// 		{name: "hoho", image: "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/ixPdSl7.SV8A/v1/1200x-1.jpg"},
// 		{name: "lala", image: "https://cdngeneral.rentcafe.com/dmslivecafe/3/455120/Main-Genesee-1(2).jpg?quality=85&scale=both"},
// 		{name: "lala", image: "https://nlrmanagement.com/wp-content/uploads/Jefferson-Village-Senior-Apartments-NLR-Management-e1571694713743.jpg"}
// 	]

app.get("/campGrounds", function(req, res) {
	CampGround.find({}, function(err, allCampGrounds) {
					if (err){
						console.log(err);
					} else {
						res.render("campgrounds/index", {campGrounds: allCampGrounds})
					}
	});		
					
	//res.render("campGrounds", {campGrounds: campGrounds});
});

		
app.post("/campGrounds", function(req, res) {
	//get data from forma
	var name = req.body.name
	var image = req.body.image
	var desc = req.body.description
	var newCampGround = {name: name, image: image, description: desc}
	
	//create new campGrounds and save to db
	CampGround.create(newCampGround, function(err, newCreated){
		if (err){
			console.log(err);
		} else {//redirect to campGrounds page
			res.redirect("/campGrounds");
		}
	})
	
	
});
app.get("/campGrounds/new", function(req, res) {
	res.render("campgrounds/new")
});
app.get("/campGrounds/:id", function(req, res) {
	//find the campground with provided provided
	CampGround.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if (err){
			console.log(err);
		} else {
			res.render("campgrounds/show",{campground : foundCampground})	;	
		}
	});
});

//===================
//Comment Routes
//===================
app.get("/campgrounds/:id/comments/new", function(req, res){
	CampGround.findById(req.params.id, function(err, campground) {
		if (err){
			console.log(err);
		} else {
			res.render("comments/new",{campground : campground})	;	
		}
	});
});

app.post("/campgrounds/:id/comments", function(req, res){
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






app.listen(3000, function() {
	console.log("yelp project started")
});