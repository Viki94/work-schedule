var mongoose = require("mongoose");
var Promise = require("bluebird");
mongoose.Promise = Promise;

//DB
var databaseUri = "mongodb://localhost/schedule";

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}

var db = mongoose.connection;

db.on("error", function (err) {
  console.log("Mongoose Error: ", err);
});

db.once("open", function () {
  console.log("Mongoose connection successful.");
});


  // const MongoClient = require('mongodb').MongoClient;
  // const uri = "mongodb+srv://vici_n:v148259367@cluster0-twu3m.mongodb.net/test?retryWrites=true&w=majority";
  // const client = new MongoClient(uri, { useNewUrlParser: true });
  // client.connect(err => {
  //   const collection = client.db("test").collection("devices");
  //   // perform actions on the collection object
  //   client.close();
  // });