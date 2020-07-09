var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HallScheduleSchema = new Schema({
  hall_id: {
    type: String
  },
  name: {
    type: String
  },
  disciplineType: {
    type: String,
    default: ""
  },
  disciplineName: {
    type: String,
    default: ""
  },
  department: {
    type: String,
    default: ""
  },
  course: {
    type: String,
    default: ""
  },
  typeOfOccupation: {
    type: String,
    default: ""
  },
  lecterer: {
    type: String,
    default: ""
  },
  references: {
    type: String,
    default: ""
  },
  dayOfWeek: {
    type: String,
    default: ""
  },
  startHour: {
    type: String,
    default: ""
  },
  endHour: {
    type: String,
    default: ""
  },
  description: {
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