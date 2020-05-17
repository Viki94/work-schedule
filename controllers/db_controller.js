var express = require("express");
var router = express.Router();
var db = require("../db/db.js");
var path = require("path");

var user = require("../models/user");
var hall = require("../models/hall");
var hallSchedule = require("../models/hallSchedule");
var announcements = require("../models/announcements")
var scheduleRequestChange = require("../models/scheduleRequestChange")

router.get("/getAllHalls", function (req, res) {
  hall.find({ "active": 1 }).exec(function (err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});

router.get("/getAllUsers", function (req, res) {
  user.find().exec(function (err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});

router.put("/updateUser/:id", function (req, res) {
  user.findOneAndUpdate({ "_id": req.params.id }, {
    groups: req.body.groups
  }, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.send("Hall updated");
    }
  });
});

router.get("/getHallSchedules", function (req, res) {
  hallSchedule.find({ "active": 1 }).exec(function (err, docs) {
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      res.send(docs);
    }
  });
});

router.post("/addHallSchedule", function (req, res) {
  hallSchedule.create({
    hall_id: req.body.hall_id,
    name: req.body.name,
  }, function (err) {
    if (err) {
      console.log(err);
    }
    else {
      res.send("Hall schedule saved!");
    }
  });
});

router.put("/updateSchedule/:id", function (req, res) {
  var newSchedule = req.body.hallSchedule;
  hallSchedule.findOneAndUpdate({ "_id": req.params.id }, {
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
      res.send("Hall schedule updated");
    }
  });
});

router.post("/addHall", function (req, res) {
  hall.create({
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    sittingPlaces: req.body.sittingPlaces
  }, function (err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});

router.put("/updateHall/:id", function (req, res) {
  hall.findOneAndUpdate({ "_id": req.params.id }, {
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    sittingPlaces: req.body.sittingPlaces
  }, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.send("Hall updated");
    }
  });
});

router.put("/updateHallName/:hall_id", function (req, res) {
  hallSchedule.findOneAndUpdate({ "hall_id": req.params.hall_id }, {
    name: req.body.name
  }, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.send("Hall's name updated");
    }
  });
});

router.put("/removeHall/:id", function (req, res) {
  hall.findOneAndUpdate({ "_id": req.params.id }, { "active": 0 })
    .exec(function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        res.send(doc);
      }
    })
});

router.put("/removeHallSchedule/:hall_id", function (req, res) {
  hallSchedule.findOneAndUpdate({ "hall_id": req.params.hall_id }, { "active": 0 })
    .exec(function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        res.send(doc);
      }
    })
});

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

router.get("/getScheduleRequestChanges/:requestCount/:groups", function (req, res) {
  var allUserGroups = req.params.groups.split(',');
  scheduleRequestChange.find({ $or: [{ groups: { $in: allUserGroups } }] }).sort({ "date": -1 }).limit(Number(req.params.requestCount)).exec(function (err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});

router.get("/getScheduleRequestChangesForNotAdminUser/:requestCount/:username", function (req, res) {
  scheduleRequestChange.find({ "active": 1, "username": req.params.username }).sort({ "date": -1 }).limit(Number(req.params.requestCount)).exec(function (err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});

router.post("/addScheduleRequestChange", function (req, res) {
  scheduleRequestChange.create({
    title: req.body.title,
    content: req.body.content,
    date: req.body.date,
    username: req.body.username,
    groups: req.body.groups
  }, function (err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});

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

router.put("/updateScheduleRequestApproval/:id", function (req, res) {
  scheduleRequestChange.findOneAndUpdate({ "_id": req.params.id }, { "approved": req.body.approved })
    .exec(function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        res.send(doc);
      }
    })
});

router.put("/updateScheduleRequestGroups/:id", function (req, res) {
  scheduleRequestChange.findOneAndUpdate({ "_id": req.params.id }, { "groups": req.body.groups })
    .exec(function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        res.send(doc);
      }
    })
});

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

router.get("/filterScheduleRequestChangesForNotAdminUser/:filterValue/:username", function (req, res) {
  scheduleRequestChange.find({ "active": 1, "approved": Number(req.params.filterValue), "username": req.params.username }).exec(function (err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});

module.exports = router;
