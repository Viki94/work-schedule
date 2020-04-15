var React = require("react");
var ScheduleView = require("./ScheduleView");
var AnnouncementsView = require("./AnnouncementsView");

var EmployeeHome = React.createClass({
    render: function () {
        return (
            <div>
                <AnnouncementsView isAdmin={false} />
                <ScheduleView />
            </div>
        );
    }
});

module.exports = EmployeeHome;