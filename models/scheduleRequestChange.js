var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScheduleRequestChangeSchema = new Schema({
  title: String,
  content: String,
  date: String,
  lastUpdatedDate: String,
  username: String,
  groups: Array,
  active: {
    type: Number,
    default: 1
  },
  approved: {
    type: Number,
    default: 0
  }
});

var ScheduleRequestChange = mongoose.model('ScheduleRequestChange', ScheduleRequestChangeSchema);
module.exports = ScheduleRequestChange;
