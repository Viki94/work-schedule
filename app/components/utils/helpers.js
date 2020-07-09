var axios = require("axios");

var helper = {
  getAllHalls() {
    return axios.get("/getAllHalls");
  },

  getAllHallSchedulesWithConditions(selectedUserConditions) {
    return axios.get("/getAllHallSchedulesWithConditions/" + selectedUserConditions, {
      selectedUserConditions: selectedUserConditions
    });
  },

  getCurrentUser() {
    return axios.get("/user");
  },

  getAllUsers() {
    return axios.get("/getAllUsers");
  },

  updateUser: function (id, userType, groups, faculty, facultyNumber, studyCourse, studyGroup, curriculum, isActiveStudent) {
    return axios.put("/updateUser/" + id, {
      userType: userType,
      groups: groups,
      faculty: faculty,
      facultyNumber: facultyNumber,
      studyCourse: studyCourse,
      studyGroup: studyGroup,
      curriculum: curriculum,
      isActiveStudent: isActiveStudent
    });
  },

  updateProfile: function (id, email, firstName, lastName, description, mobilePhone, country, city, address) {
    return axios.put("/updateProfile/" + id, {
      email: email,
      firstName: firstName,
      lastName: lastName,
      description: description,
      mobilePhone: mobilePhone,
      country: country,
      city: city,
      address: address
    });
  },

  getHall(id) {
    return axios.get("/getHall/" + id);
  },

  getHallSchedules() {
    return axios.get('/getHallSchedules')
      .then(function (response) {
        return response;
      })
  },

  addHallSchedule(hall_id, name) {
    return axios.post('/addHallSchedule', {
      hall_id: hall_id,
      name: name
    });
  },

  updateHallSchedule(hallSchedule) {
    return axios.put('/updateSchedule/' + hallSchedule._id, {
      hallSchedule: hallSchedule
    });
  },


  uploadHallSchedule(hallSchedule) {
    return axios.put('/uploadSchedule/' + hallSchedule.name, {
      hallSchedule: hallSchedule
    });
  },

  updateScheduleMeeting(_id, updateScheduleMeeting) {
    return axios.put('/updateScheduleMeeting/' + _id, {
      id: updateScheduleMeeting.id,
      joinUrl: updateScheduleMeeting.join_url,
      password: updateScheduleMeeting.password,
      startTime: updateScheduleMeeting.start_time,
      startUrl: updateScheduleMeeting.start_url,
      topic: updateScheduleMeeting.topic
    });
  },

  addHall: function (name, address, city, sittingPlaces, gpsCoordinates) {
    return axios.post("/addHall", {
      name: name,
      address: address,
      city: city,
      sittingPlaces: sittingPlaces,
      gpsCoordinates: gpsCoordinates
    });
  },

  updateHall: function (id, name, address, city, sittingPlaces, gpsCoordinates) {
    return axios.put("/updateHall/" + id, {
      name: name,
      address: address,
      city: city,
      sittingPlaces: sittingPlaces,
      gpsCoordinates: gpsCoordinates
    });
  },

  updateHallName(hall_id, name) {
    return axios.put("/updateHallName/" + hall_id, {
      name: name
    });
  },

  removeHall(id) {
    return axios.put("/removeHall/" + id);
  },

  removeHallSchedule(hall_id) {
    return axios.put("/removeHallSchedule/" + hall_id);
  },

  getAnnouncements(announcementCount) {
    return axios.get("/getAnnouncements/" + announcementCount);
  },

  addAnnouncements(title, content, date, username) {
    return axios.post("/addAnnouncements", {
      title: title,
      content: content,
      date: date,
      username: username
    });
  },

  removeAnnouncement(id) {
    return axios.put("/removeAnnouncement/" + id);
  },

  getScheduleRequestChanges(requestCount, groups) {
    return axios.get("/getScheduleRequestChanges/" + requestCount + "/" + groups);
  },

  getScheduleRequestChangesForNotAdminUser(requestCount, username) {
    return axios.get("/getScheduleRequestChangesForNotAdminUser/" + requestCount + "/" + username);
  },

  addScheduleRequestChange(title, content, date, username, groups, keyWords) {
    return axios.post("/addScheduleRequestChange", {
      title: title,
      content: content,
      date: date,
      username: username,
      groups: groups,
      keyWords: keyWords
    });
  },

  removeScheduleRequestChange(id) {
    return axios.put("/removeScheduleRequestChange/" + id);
  },

  updateScheduleRequestApproval(id, status, lastUpdatedDate, lastUpdatedUsername) {
    return axios.put("/updateScheduleRequestApproval/" + id + "/" + lastUpdatedDate + "/" + lastUpdatedUsername, {
      status: status,
      lastUpdatedDate: lastUpdatedDate,
      lastUpdatedUsername: lastUpdatedUsername
    });
  },

  updateScheduleRequestGroups(id, groups, keyWords, lastUpdatedDate, lastUpdatedUsername) {
    return axios.put("/updateScheduleRequestGroups/" + id + "/" + lastUpdatedDate + "/" + lastUpdatedUsername, {
      groups: groups,
      keyWords: keyWords,
      lastUpdatedDate: lastUpdatedDate,
      lastUpdatedUsername: lastUpdatedUsername
    });
  },

  filterScheduleRequestChanges(filterValue) {
    return axios.get("/filterScheduleRequestChanges/" + filterValue);
  },

  filterScheduleRequestChangesForNotAdminUser(filterValue, username) {
    return axios.get("/filterScheduleRequestChangesForNotAdminUser/" + filterValue + "/" + username);
  },
};

module.exports = helper;
