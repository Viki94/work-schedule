var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HallScheduleSchema = new Schema({
  hall_id: {
    type: String
  },
  name: {
    type: String
  },
  monday: {
    type: String,
    default: ""
  },
  tuesday: {
    type: String,
    default: ""
  },
  wednesday: {
    type: String,
    default: ""
  },
  thursday: {
    type: String,
    default: ""
  },
  friday: {
    type: String,
    default: ""
  },
  saturday: {
    type: String,
    default: ""
  },
  sunday: {
    type: String,
    default: ""
  },
  active: {
    type: Number,
    default: 1,
  },
  meetingId: {
    type: Number,
    default: 0
  },
  meetingJoinUrl: {
    type: String,
    default: ""
  },
  meetingPassword: {
    type: String,
    default: ""
  },
  meetingStartTime: {
    type: String,
    default: ""
  },
  meetingStartUrl: {
    type: String,
    default: ""
  },
  meetingTopic: {
    type: String,
    default: ""
  }
});

var HallSchedule = mongoose.model('HallSchedule', HallScheduleSchema);
module.exports = HallSchedule;