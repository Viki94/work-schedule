var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScheduleRequestChangeSchema = new Schema({
  title: {
    type: String
  },
  content: {
    type: String
  },
  date: {
    type: String,
  },
  username: {
    type: String,
  },
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
