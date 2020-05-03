var axios = require("axios");

var helper = {

  getAllEmployees: function () {
    return axios.get("/getAllEmployees");
  },

  getCurrentUser: function () {
    return axios.get("/user");
  },

  // errorMessage: function() {
  //   return axios.get("/register");
  // },

  getEmployee: function (id) {
    return axios.get("/getEmployee/" + id);
  },

  getEmpSchedules: function () {
    return axios.get('/getEmpSchedules')
      .then(function (response) {
        return response;
      })
  },

  addEmpSchedule: function (emp_id, firstName, lastName) {
    return axios.post('/addEmpSchedule', {
      emp_id: emp_id,
      firstName: firstName,
      lastName: lastName
    });
  },

  updateEmpSchedule: function (empSchedule) {
    return axios.put('/updateSchedule/' + empSchedule._id, {
      employeeSchedule: empSchedule
    });
  },

  addEmployee: function (firstName, lastName, address, city, email, phone) {
    return axios.post("/addEmployee", {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
      phone: phone
    });
  },

  updateEmployee: function (id, firstName, lastName, address, city, email, phone) {
    return axios.put("/updateEmployee/" + id, {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
      phone: phone
    });
  },

  updateEmpName: function (emp_id, firstName, lastName) {
    return axios.put("/updateEmpName/" + emp_id, {
      firstName: firstName,
      lastName: lastName
    });
  },

  removeEmployee: function (id) {
    return axios.put("/removeEmployee/" + id);
  },

  removeEmpSchedule: function (emp_id) {
    return axios.put("/removeEmpSchedule/" + emp_id);
  },

  getAnnouncements: function (announcementCount) {
    return axios.get("/getAnnouncements/" + announcementCount);
  },

  addAnnouncements: function (title, content, date, username) {
    return axios.post("/addAnnouncements", {
      title: title,
      content: content,
      date: date,
      username: username
    });
  },

  removeAnnouncement: function (id) {
    return axios.put("/removeAnnouncement/" + id);
  },

  getScheduleRequestChanges: function (requestCount) {
    return axios.get("/getScheduleRequestChanges/" + requestCount);
  },

  addScheduleRequestChange: function (title, content, date, username) {
    return axios.post("/addScheduleRequestChange", {
      title: title,
      content: content,
      date: date,
      username: username
    });
  },

  removeScheduleRequestChange: function (id) {
    return axios.put("/removeScheduleRequestChange/" + id);
  },

  updateScheduleRequestChange: function (id, approved) {
    return axios.put("/updateScheduleRequestChange/" + id, {
      approved: approved
    });
  },

  filterScheduleRequestChanges: function (filterValue) {
    return axios.get("/filterScheduleRequestChanges/" + filterValue);
  },
};

module.exports = helper;
