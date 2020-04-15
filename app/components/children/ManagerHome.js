var React = require("react");
var helpers = require("../utils/helpers");
var ScheduleView = require("./ScheduleView");
var AnnouncementsBuild = require("./AnnouncementsBuild");
var AnnouncementsView = require("./AnnouncementsView");

var ManagerHome = React.createClass({
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

    getUpdatedAnnouncements: function (updatedAnnouncements) {
        this.setState({ allAnnouncements: updatedAnnouncements })
    },

    render: function () {
        return (
            <div>
                <ScheduleView />
                <div className="row">
                    <div className="col m6">
                        <AnnouncementsView getUpdatedAnnouncements={this.getUpdatedAnnouncements} allAnnouncements={this.state.allAnnouncements} isAdmin={true} />
                    </div>
                    <div className="col m6 fullWidth">
                        <AnnouncementsBuild getUpdatedAnnouncements={this.getUpdatedAnnouncements} allAnnouncements={this.state.allAnnouncements} isAdmin={true}/>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = ManagerHome;