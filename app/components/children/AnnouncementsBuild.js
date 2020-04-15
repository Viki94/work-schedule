var React = require("react");
var helpers = require("../utils/helpers");

var AnnouncementsBuild = React.createClass({
    getInitialState: function () {
        return {
            title: "",
            content: "",
            date: new Date().toLocaleDateString(),
            allAnnouncements: [],
            announcementId: ""
        };
    },

    componentDidMount: function () {
        helpers.getCurrentUser().then(function (response) {
            if (response !== this.state.username) {
                this.setState({ username: response.data.username });
            }
        }.bind(this));
    },

    handleAnnouncementBuild(event) {
        this.setState({ [event.target.id]: event.target.value });
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

    addAnnouncements: function (event) {
        event.preventDefault(event);
        helpers.addAnnouncements(this.state.title, this.state.content, new Date().toLocaleString(), this.state.username).then(function (response) {
            this.state.announcementId = response.data._id;
            this.getAnnouncements();
            this.clearStates();
        }.bind(this));

        Materialize.toast('Announcement added', 3000);
        this.clearForm();
    },

    clearForm: function () {
        var elements = document.getElementsByTagName("input");
        for (var i = 0; i < elements.length; i++) {
            elements[i].value = "";
            elements[i].classList.remove("valid");
        };
    },

    clearStates: function () {
        this.setState({ title: "", content: "" });
    },

    render: function () {
        return (
            <div className="card-panel">
                <div className="row">
                    <div className="col s12">
                        <h5>Make an announcement</h5>
                    </div>
                </div>
                <form onSubmit={this.addAnnouncements}>
                    <div className="row">
                        <div className="input-field col s12">
                            <input
                                placeholder="Title"
                                id="title"
                                type="text"
                                className="validate"
                                value={this.state.title}
                                onChange={this.handleAnnouncementBuild}
                                required />
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <textarea
                                placeholder="Announcement"
                                id="content"
                                type="text"
                                className="materialize-textarea"
                                value={this.state.content}
                                onChange={this.handleAnnouncementBuild}
                                required>
                            </textarea>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <button className="btn waves-effect waves-light btn-large green accent-3 fullWidth" type="submit" value="Submit" name="action">Submit<i className="material-icons right">add</i></button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
});

module.exports = AnnouncementsBuild;