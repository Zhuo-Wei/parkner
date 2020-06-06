var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campGrounds = [
		{name: "hoho", image: "https://i.insider.com/5cd46fae93a15201580b7535?width=2500&format=jpeg&auto=webp"},
		{name: "lala", image: ""}
	]

app.get("/", function(req, res) {
	res.render("landing");
});

app.get("/campGrounds", function(req, res) {
	
	res.render("campGrounds", {campGrounds: campGrounds});
});

app.post("/campGrounds", function(req, res) {
	//get data from forma
	var name = req.body.name
	var image = req.body.image
	var newCampGround = {name: name, image: image}
	//add into array
	campGrounds.push(newCampGround);
	//redirect to campGrounds page
	res.redirect("/campGrounds");
});
app.get("/campGrounds/new", function(req, res) {
	res.render("new.ejs")
});

app.listen(3000, function() {
	console.log("yelp project started")
});