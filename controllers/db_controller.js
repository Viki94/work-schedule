var express = require("express");
var router = express.Router();
var db = require("../db/db.js");
var path = require("path");

var employee = require("../models/employee");
var EmployeeSchedule = require("../models/employeeSchedule");
var announcements = require("../models/announcements")
var scheduleRequestChange = require("../models/scheduleRequestChange")

//Getting Employees from the database
router.get("/getAllEmployees", function (req, res) {
  employee.find({ "active": 1 }).exec(function (err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});

//Get employee schedules from database
router.get("/getEmpSchedules", function (req, res) {
  EmployeeSchedule.find({ "active": 1 }).exec(function (err, docs) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      res.send(docs);
    }
  });
});

//Posting Employee Schedule to the database
router.post("/addEmpSchedule", function (req, res) {
  EmployeeSchedule.create({
    emp_id: req.body.emp_id,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  }, function (err) {
    if (err) {
      console.log(err);
    }
    else {
      res.send("Employee Schedule Saved!");
    }
  });
});

//Updating existing employee schedule
router.put("/updateSchedule/:id", function (req, res) {
  var newSchedule = req.body.employeeSchedule;
  EmployeeSchedule.findOneAndUpdate({ "_id": req.params.id }, {
    monday: newSchedule.monday,
    tuesday: newSchedule.tuesday,
    wednesday: newSchedule.wednesday,
    thursday: newSchedule.thursday,
    friday: newSchedule.friday,
    saturday: newSchedule.saturday,
    sunday: newSchedule.sunday
  }, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.send("Employee schedule updated");
    }
  });
});

//Posting new Employee to the database
router.post("/addEmployee", function (req, res) {
  employee.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address,
    city: req.body.city,
    email: req.body.email,
    phone: req.body.phone
  }, function (err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});

//Updating existing employee
router.put("/updateEmployee/:id", function (req, res) {
  employee.findOneAndUpdate({ "_id": req.params.id }, {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address,
    city: req.body.city,
    email: req.body.email,
    phone: req.body.phone
  }, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.send("Employee updated");
    }
  });
});

// Update employee's name in employee schedule collection
router.put("/updateEmpName/:emp_id", function (req, res) {
  EmployeeSchedule.findOneAndUpdate({ "emp_id": req.params.emp_id }, {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  }, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.send("Employee's name updated");
    }
  });
});

// "Remove" existing employee
router.put("/removeEmployee/:id", function (req, res) {
  employee.findOneAndUpdate({ "_id": req.params.id }, { "active": 0 })
    .exec(function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        res.send(doc);
      }
    })
});

// "Remove" existing employee schedule
router.put("/removeEmpSchedule/:emp_id", function (req, res) {
  EmployeeSchedule.findOneAndUpdate({ "emp_id": req.params.emp_id }, { "active": 0 })
    .exec(function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        res.send(doc);
      }
    })
});

//Getting announcements from the database
router.get("/getAnnouncements/:announcementsCount", function (req, res) {
  announcements.find({ "active": 1 }).sort({ "date": -1 }).limit(Number(req.params.announcementsCount)).exec(function (err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});

//Put announcements to database
router.post("/addAnnouncements", function (req, res) {
  announcements.create({
    title: req.body.title,
    content: req.body.content,
    date: req.body.date,
    username: req.body.username
  }, function (err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});

// "Remove" existing announcement
router.put("/removeAnnouncement/:id", function (req, res) {
  announcements.findOneAndUpdate({ "_id": req.params.id }, { "active": 0 })
    .exec(function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        res.send(doc);
      }
    })
});

//Getting schedule request changes from the database
router.get("/getScheduleRequestChanges/:requestCount", function (req, res) {
  scheduleRequestChange.find({ "active": 1 }).sort({ "date": -1 }).limit(Number(req.params.requestCount)).exec(function (err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});

//Put schedule request changes to database
router.post("/addScheduleRequestChange", function (req, res) {
  scheduleRequestChange.create({
    title: req.body.title,
    content: req.body.content,
    date: req.body.date,
    username: req.body.username
  }, function (err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});

// "Remove" existing schedule request change
router.put("/removeScheduleRequestChange/:id", function (req, res) {
  scheduleRequestChange.findOneAndUpdate({ "_id": req.params.id }, { "active": 0 })
    .exec(function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        res.send(doc);
      }
    })
});

// Update existing schedule request change
router.put("/updateScheduleRequestChange/:id", function (req, res) {
  scheduleRequestChange.findOneAndUpdate({ "_id": req.params.id }, { "approved": req.body.approved })
    .exec(function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        res.send(doc);
      }
    })
});

// Fileter schedule request changes from the database
router.get("/filterScheduleRequestChanges/:filterValue", function (req, res) {
  scheduleRequestChange.find({ "active": 1, "approved": Number(req.params.filterValue) }).exec(function (err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});


module.exports = router;
