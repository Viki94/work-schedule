var React = require("react");
var helpers = require("../utils/helpers");
var ScheduleView = require("./ScheduleView");
var AnnouncementsBuild = require("./AnnouncementsBuild");
var AnnouncementsView = require("./AnnouncementsView");

var ManagerHome = React.createClass({
    getInitialState: function () {
        return {
            title: "",
            content: "",
            date: new Date().toLocaleDateString()
        };
    },

    componentDidMount: function () {
        this.getAnnouncements();
    },

    // componentDidUpdate: function(prevState) {
    //     if (prevState.title !== this.state.title || prevState.content !== this.state.content) {
    //         this.getAnnouncements();
    //     }
    // },

    getAnnouncements: function () {
        helpers.getAnnouncements().then(function (response) {
            this.setState({
                title: response.data[response.data.length - 1].title,
                content: response.data[response.data.length - 1].content,
                date: response.data[response.data.length - 1].date,
                username: response.data[response.data.length - 1].username,
            });
        }.bind(this));
    },

    render: function () {
        return (
            <div>
                <ScheduleView />
                <div className="row">
                    <div className="col m6">
                        <AnnouncementsView title={this.state.title} content={this.state.content} date={this.state.date} username={this.state.username} />
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