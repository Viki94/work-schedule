var React = require("react");
var helpers = require("../utils/helpers");

var AnnouncementsView = React.createClass({
    getInitialState: function () {
        return {
            allAnnouncements: [],
            selectedAnnouncement: "",
            announcementId: ""
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

    handleRemoveAnnouncement: function (event) {
        this.setState({ selectedAnnouncement: event.target.id }, function () {
            for (var i = 0; i < this.state.allAnnouncements.length; i++) {
                if (this.state.allAnnouncements[i]._id == this.state.selectedAnnouncement) {
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
                        <h5>Latest announcement</h5>
                    </div>
                </div>
                {this.state.allAnnouncements.map((announcement, i) => {
                    if (i < 5) {
                        return (
                            <div key={i} className="row">
                                <div className="col s12">
                                    <h5>{announcement.title}</h5>
                                    <p>{announcement.content}</p>
                                    <p>Posted at: {announcement.date}</p>
                                    <p>Posted from: {announcement.username}</p>
                                </div>
                                {(() => {
                                    if (this.props.isAdmin) {
                                        return (
                                            <div className="col s12">
                                                <a id={announcement._id}
                                                    className="btn btn-large waves-effect waves-light red accent-3 fullWidth"
                                                    onClick={this.handleRemoveAnnouncement}
                                                >Remove
                                                    <i className="material-icons right">person_outline</i>
                                                </a>
                                            </div>
                                        )
                                    }
                                })()}
                            </div>
                        );
                    }
                }, this)}

            </div>
        );
    }
});

module.exports = AnnouncementsView;