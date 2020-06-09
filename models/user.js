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
	facultyNumber: {
		type: Number,
		default: 0
	},
	studyCourse: {
		type: Number,
		default: 0
	},
	studyGroup: {
		type: Number,
		default: 0
	},
	curriculum: String,
	isActiveStudent: {
		type: Boolean,
		default: true
	},
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);