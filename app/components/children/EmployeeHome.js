var React = require("react");
var helpers = require("../utils/helpers");
var ScheduleView = require("./ScheduleView");
var AnnouncementsView = require("./AnnouncementsView");

var EmployeeHome = React.createClass({
    getInitialState: function () {
        return {
            allAnnouncements: [],
            announcementsCount: 5
        };
    },

    componentDidMount: function () {
        this.getAnnouncements();
    },

    getAnnouncements: function () {
        helpers.getAnnouncements(this.state.announcementsCount).then(function (response) {
            this.setState({ allAnnouncements: response.data });
        }.bind(this));
    },

    updatedAnnouncementsCount: function (count) {
        this.setState({ announcementsCount: count }, function () {
            this.getAnnouncements();
        });
    },

    render: function () {
        return (
            <div>
                <ScheduleView />
                <AnnouncementsView updatedAnnouncementsCount={this.updatedAnnouncementsCount} allAnnouncements={this.state.allAnnouncements} isAdmin={false} />
            </div>
        );
    }
});

module.exports = EmployeeHome;