var React = require("react");
var helpers = require("../utils/helpers");
var Translate = require("react-translate-component");

var AnnouncementsView = React.createClass({
    getInitialState: function () {
        return {
            selectedAnnouncement: "",
            announcementId: ""
        };
    },

    getAnnouncements: function () {
        helpers.getAnnouncements().then(function (response) {
            this.setState({ allAnnouncements: response.data }, function () {
                if (this.props.isAdmin) {
                    this.props.getUpdatedAnnouncements(this.state.allAnnouncements);
                }
            });
        }.bind(this));
    },

    handleRemoveAnnouncement: function (event) {
        this.setState({ selectedAnnouncement: event.target.id }, function () {
            for (var i = 0; i < this.props.allAnnouncements.length; i++) {
                if (this.props.allAnnouncements[i]._id == this.state.selectedAnnouncement) {
                    this.setState({
                        announcementId: this.state.selectedAnnouncement
                    }, function () {

                        event.preventDefault();
                        helpers.removeAnnouncement(this.state.selectedAnnouncement).then(function (response) {
                        }.bind(this));

                        Materialize.toast("Announcement removed", 3000);
                        this.getAnnouncements();
                    });
                }
            }
        });
    },

    render: function () {
        return (
            <div className="card-panel">
                <div className="row">
                    <div className="col s12">
                        <h5><Translate content="announcements.latestAnnouncements" /></h5>
                    </div>
                </div>
                {this.props.allAnnouncements.map((announcement, i) => {
                    return (
                        <div key={i} className="row">
                            <div className="col s12">
                                <h5>{announcement.title}</h5>
                                <p>{announcement.content}</p>
                                <p><Translate content="announcements.postedAt" />: {announcement.date}</p>
                                <p><Translate content="announcements.postedFrom" />: {announcement.username}</p>
                            </div>
                            {(() => {
                                if (this.props.isAdmin) {
                                    return (
                                        <div className="col s12">
                                            <a id={announcement._id}
                                                className="btn btn-large waves-effect waves-light red accent-3 fullWidth"
                                                onClick={this.handleRemoveAnnouncement}
                                            >
                                                <Translate content="buttons.remove" />
                                                <i className="material-icons right">delete_forever</i>
                                            </a>
                                        </div>
                                    )
                                }
                            })()}
                        </div>
                    );
                }, this)}

            </div>
        );
    }
});

module.exports = AnnouncementsView;