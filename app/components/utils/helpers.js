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

  updateUser: function (id, userType, groups) {
    return axios.put("/updateUser/" + id, {
      userType: userType,
      groups: groups
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

  addHall: function (name, address, city, sittingPlaces) {
    return axios.post("/addHall", {
      name: name,
      address: address,
      city: city,
      sittingPlaces: sittingPlaces
    });
  },

  updateHall: function (id, name, address, city, sittingPlaces) {
    return axios.put("/updateHall/" + id, {
      name: name,
      address: address,
      city: city,
      sittingPlaces: sittingPlaces
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

  addScheduleRequestChange(title, content, date, username, groups) {
    return axios.post("/addScheduleRequestChange", {
      title: title,
      content: content,
      date: date,
      username: username,
      groups: groups
    });
  },

  removeScheduleRequestChange(id) {
    return axios.put("/removeScheduleRequestChange/" + id);
  },

  updateScheduleRequestApproval(id, approved, lastUpdatedDate, lastUpdatedUsername) {
    return axios.put("/updateScheduleRequestApproval/" + id + "/" + lastUpdatedDate + "/" + lastUpdatedUsername, {
      approved: approved,
      lastUpdatedDate: lastUpdatedDate,
      lastUpdatedUsername: lastUpdatedUsername
    });
  },

  updateScheduleRequestGroups(id, groups, lastUpdatedDate, lastUpdatedUsername) {
    return axios.put("/updateScheduleRequestGroups/" + id + "/" + lastUpdatedDate + "/" + lastUpdatedUsername, {
      groups: groups,
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
