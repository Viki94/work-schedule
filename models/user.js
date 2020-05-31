var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username: String,
	email: String,
	userType: String,
	picture: String,
	password: String,
	groups: Array,
	firstName: String,
	lastName: String,
	description: String,
	mobilePhone: String,
	country: String,
	city: String,
	address: String,
	faculty: String,
	facultyNumber: Number,
	studyCourse: Number,
	studyGroup: Number,
	curriculum: String,
	isActiveStudent: {
		type: Boolean,
		default: true
	  },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);