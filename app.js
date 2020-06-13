var express = require("express"),
 	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Comment = require("./models/comment"),
	CampGround = require("./models/campground"),	
	User = require("./models/user"),
	seedDB = require("./seeds")
	
//requiring routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index")

seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_project", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//passport configuration
app.use(require("express-session")({
	secret: "sad 2020",
	resave: false,
	saveUnintialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});



// var campGrounds = [
// 		{name: "hoho", image: "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/ixPdSl7.SV8A/v1/1200x-1.jpg"},
// 		{name: "lala", image: "https://cdngeneral.rentcafe.com/dmslivecafe/3/455120/Main-Genesee-1(2).jpg?quality=85&scale=both"},
// 		{name: "lala", image: "https://nlrmanagement.com/wp-content/uploads/Jefferson-Village-Senior-Apartments-NLR-Management-e1571694713743.jpg"}
// 	]

app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

app.listen(3000, function() {
	console.log("yelp project started")
});