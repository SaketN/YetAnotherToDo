// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan'); // winston

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3333; // set port

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";



// ROUTES FOR API
// =============================================================================

// create router
var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
	res.json({ message: 'hooray! welcome to  Yet Another Todo App' });
})

// // on routes that end in /todo
// // ----------------------------------------------------
router
	.post("/todo", function (req, res) {
		console.log(req.body);
		var todoDoc = {
			//id: req.body.id,
			todoText: req.body.todoText,
			isDone: req.body.isDone,
			createdAt:new Date()
		};
		console.log(todoDoc);
		MongoClient.connect(url, function (err, db) {
			if (err) throw err;
			var dbo = db.db("yatodos");
			dbo.collection("todos").insertOne(todoDoc, function (err, result) {
				if (err) throw err;
				console.log(result);
				db.close();
				res.send(result)
			});
		});
	})

	// 	// get all the todoa (accessed at GET http://localhost:8080/api/todos)
	.get("/todos", function (req, res) {
		MongoClient.connect(url, function (err, db) {
			if (err) throw err;
			var dbo = db.db("yatodos");
			dbo.collection("todos").find({}).toArray(function (err, result) {
				if (err) throw err;
				console.log(result);
				db.close();
				res.send(result)
			});
		});
	})
	.patch("/todo", function (req, res) {
		var id = req.body.id;
		var isDone = req.body.isDone;

		MongoClient.connect(url, function (err, db) {
			if (err) throw err;
			var dbo = db.db("yatodos");
			var oId = require('mongodb').ObjectID(id)
			var myquery = { _id: oId };
			var newvalues = { $set: { isDone: isDone} };
			dbo.collection("todos").updateOne(myquery, newvalues, function (err, updated) {
				if (err) throw err;
				console.log("1 document updated");
				res.send(updated);
				db.close();
			});
		});
	})

	.delete("/todo/:id", function (req, res) {
		var id = req.params.id;
		MongoClient.connect(url, function (err, db) {
			if (err) throw err;
			var dbo = db.db("yatodos");
			var oId = require('mongodb').ObjectID(id)
			var myquery = { _id: oId };
			dbo.collection("todos").remove(myquery, function (err, removed) {
				if (err) throw err;
				console.log("1 document removed");
				res.send(removed);
				db.close();
			});
		});
	})

// REGISTER ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);