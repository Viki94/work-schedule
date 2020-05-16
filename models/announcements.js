var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnnouncementSchema = new Schema({
  title: String,
  content: String,
  date: String,
  username: String,
  active: {
    type: Number,
    default: 1
  }
});

var Announcement = mongoose.model('Announcement', AnnouncementSchema);
module.exports = Announcement;
