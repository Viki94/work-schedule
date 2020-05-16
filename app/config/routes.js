var React = require("react");
var router = require("react-router");
var Route = router.Route;
var Router = router.Router;

var browserHistory = router.browserHistory;
var IndexRoute = router.IndexRoute;

// landing components
var Main = require("../components/Main");
var Login = require("../components/children/Login");
var Register = require("../components/children/Register");
// manager components
var Manager = require("../components/Manager");
var ManagerHome = require("../components/children/ManagerHome");
var ManagerUsers = require("../components/children/ManagerUsers");
var ManagerHalls = require("../components/children/ManagerHalls");
var ManagerSchedulesCreate = require("../components/children/ManagerSchedulesCreate");
// employee components
var Employee = require("../components/Employee");
var EmployeeHome = require("../components/children/EmployeeHome");
var ScheduleRequestChange = require("../components/children/ScheduleRequestChange");

module.exports = (
  <Router history={browserHistory}>
    <Route path="/" component={Main}>
      <Route path="login" component={Login} />
      <Route path="register" component={Register} />
      <IndexRoute component={Login} />
      <Route path="manager" component={Manager}>
        <Route path="users" component={ManagerUsers} />
        <Route path="halls" component={ManagerHalls} />
        <Route path="schedulesCreate" component={ManagerSchedulesCreate} />
        <Route path="scheduleRequestChange" component={ScheduleRequestChange} isAdmin={true} />
        <IndexRoute component={ManagerHome} />
      </Route>
      <Route path="employee" component={Employee}>
        <Route path="scheduleRequestChange" component={ScheduleRequestChange} isAdmin={false} />
        <IndexRoute component={EmployeeHome} />
      </Route>
    </Route>
  </Router>
);