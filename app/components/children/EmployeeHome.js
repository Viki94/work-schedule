var React = require("react");
var helpers = require("../utils/helpers");
var ScheduleView = require("./ScheduleView");
var AnnouncementsView = require("./AnnouncementsView");

var EmployeeHome = React.createClass({
    getInitialState: function () {
        return {
            allAnnouncements: [],
        };
    },

    componentDidMount: function () {
        this.getAnnouncements();
    },

    getAnnouncements: function () {
        helpers.getAnnouncements().then(function (response) {
            this.setState({ allAnnouncements: response.data });
        }.bind(this));
    },

    render: function () {
        return (
            <div>
                <ScheduleView />
                <AnnouncementsView allAnnouncements={this.state.allAnnouncements} isAdmin={false} />
            </div>
        );
    }
});

module.exports = EmployeeHome;