var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScheduleRequestChangeSchema = new Schema({
  title: String,
  content: String,
  date: String,
  lastUpdatedDate: String,
  lastUpdatedUsername: String,
  username: String,
  groups: Array,
  keyWords: Array,
  active: {
    type: Number,
    default: 1
  },
  status: {
    type: Number,
    default: 0
  }
});

var ScheduleRequestChange = mongoose.model('ScheduleRequestChange', ScheduleRequestChangeSchema);
module.exports = ScheduleRequestChange;
