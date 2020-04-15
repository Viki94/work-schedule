var React = require("react");
var ScheduleView = require("./ScheduleView");
var AnnouncementsBuild = require("./AnnouncementsBuild");
var AnnouncementsView = require("./AnnouncementsView");

var ManagerHome = React.createClass({
    render: function () {
        return (
            <div>
                <ScheduleView />
                <div className="row">
                    <div className="col m6">
                        <AnnouncementsView isAdmin={true} />
                    </div>
                    <div className="col m6 fullWidth">
                        <AnnouncementsBuild />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = ManagerHome;