var express = require("express"),
 	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/yelp_project");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//schema setup
var campGroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var CampGround = mongoose.model("CampGround", campGroundSchema);

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
						res.render("index", {campGrounds: allCampGrounds})
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
	res.render("new.ejs")
});
app.get("/campGrounds/:id", function(req, res) {
	//find the campground with provided provided
	CampGround.findById(req.params.id, function(err, foundCampground) {
		if (err){
			console.log(err);
		} else {
			res.render("show",{campground : foundCampground})	;	
		}
	});
});

app.listen(3000, function() {
	console.log("yelp project started")
});