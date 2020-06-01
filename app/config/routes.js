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
// admin components
var Admin = require("../components/Admin");
var AdminHome = require("../components/children/AdminHome");
var AdminUsers = require("../components/children/AdminUsers");
var AdminHalls = require("../components/children/AdminHalls");
var AdminSchedulesCreate = require("../components/children/AdminSchedulesCreate");
// contributor components
var Contributor = require("../components/Contributor");
var ContributorHome = require("../components/children/ContributorHome");

var ScheduleRequestChange = require("../components/children/ScheduleRequestChange");
var UserProfile = require("../components/children/UserProfile");

module.exports = (
  <Router history={browserHistory}>
    <Route path="/" component={Main}>
      <Route path="login" component={Login} />
      <Route path="register" component={Register} />
      <IndexRoute component={Login} />
      <Route path="admin" component={Admin}>
        <Route path="users" component={AdminUsers} />
        <Route path="halls" component={AdminHalls} />
        <Route path="schedulesCreate" component={AdminSchedulesCreate} />
        <Route path="scheduleRequestChange" component={ScheduleRequestChange} isAdmin={true} />
        <Route path="userProfile" component={UserProfile} />
        <IndexRoute component={AdminHome} />
      </Route>
      <Route path="contributor" component={Contributor}>
        <Route path="scheduleRequestChange" component={ScheduleRequestChange} isAdmin={false} />
        <Route path="userProfile" component={UserProfile} />
        <IndexRoute component={ContributorHome} />
      </Route>
    </Route>
  </Router>
);