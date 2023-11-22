//jshint esversion:6
//API Key: 6eece61053ff91c00e695ded13692ff5-us13
//Audience ID: aa0f66d73d;

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
//let port = process.env.PORT; // Used for Dynamic port

app.use(bodyParser.urlencoded({ extends: true }));

//app.use(express.static("public"));
app.use("*/css", express.static("public/css"));
app.use("*/images", express.static("public/images"));

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
	const fname = req.body.fname;
	const lname = req.body.lname;
	const email = req.body.email;

	const data = {
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: fname,
					LNAME: lname,
				},
			},
		],
	};
	const jsonData = JSON.stringify(data);
	const url = "https://us13.api.mailchimp.com/3.0/lists/aa0f66d73d";
	const options = {
		method: "POST",
		auth: "Gaurav:26eece61053ff91c00e695ded13692ff5-us13",
	};
	const request = https.request(url, options, function (response) {
		if (response.statusCode === 200) {
			res.sendFile(__dirname + "/success.html");
		} else {
			res.sendFile(__dirname + "/failure.html");
		}
		response.on("data", function (data) {
			console.log(JSON.parse(data));
		});
	});
	request.write(jsonData);

	request.end();
});

app.post("/failure", function (req, res) {
	res.redirect("/");
});

app.listen(3000, function (req, res) {
	console.log("Server is running at Port: 3000");
});
