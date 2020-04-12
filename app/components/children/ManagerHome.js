var React = require("react");
var helpers = require("../utils/helpers");
var ScheduleView = require("./ScheduleView");
var AnnouncementsBuild = require("./AnnouncementsBuild");
var AnnouncementsView = require("./AnnouncementsView");

var ManagerHome = React.createClass({
    getInitialState: function () {
        return {
            allAnnouncements: []
        };
    },

    componentDidMount: function () {
        this.getAnnouncements();
    },

    getAnnouncements: function () {
        helpers.getAnnouncements().then(function (response) {
            this.setState({ allAnnouncements: response.data });
            this.activeButtons();
        }.bind(this));
    },

    render: function () {
        return (
            <div>
                <ScheduleView />
                <div className="row">
                    <div className="col m6">
                        <AnnouncementsView allAnnouncements={this.state.allAnnouncements} />
                    </div>
                    <div className="col m6">
                        <AnnouncementsBuild />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = ManagerHome;