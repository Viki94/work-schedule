var React = require("react");
var helpers = require("../utils/helpers");
var Translate = require("react-translate-component");

var ScheduleRequestChange = React.createClass({
    getInitialState: function () {
        return {
            title: "",
            content: "",
            allScheduleRequestChanges: [],
            scheduleRequestChangeId: "",
            selectedScheduleRequestChange: ""
        };
    },

    componentDidMount: function () {
        helpers.getCurrentUser().then(function (response) {
            if (response !== this.state.username) {
                this.setState({ username: response.data.username });
            }
        }.bind(this));

        this.getScheduleRequestChanges();
    },

    handleScheduleRequestChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    },

    getScheduleRequestChanges: function () {
        helpers.getScheduleRequestChanges().then(function (response) {
            this.setState({ allScheduleRequestChanges: response.data }, function () {
                // if (this.props.isAdmin) {
                //     this.props.getUpdatedScheduleRequestChanges(this.state.allScheduleRequestChanges);
                // }
            });
        }.bind(this));
    },

    addScheduleRequestChange: function (event) {
        event.preventDefault(event);
        helpers.addScheduleRequestChange(this.state.title, this.state.content, new Date().toUTCString(), this.state.username).then(function (response) {
            this.state.scheduleRequestChangeId = response.data._id;
            this.getScheduleRequestChanges();
            this.clearStates();
        }.bind(this));

        Materialize.toast('Schedule request change added', 3000);
        this.clearForm();
    },

    handleRemoveScheduleRequestChange: function (event) {
        this.setState({ selectedScheduleRequestChange: event.target.id }, function () {
            for (var i = 0; i < this.state.allScheduleRequestChanges.length; i++) {
                if (this.state.allScheduleRequestChanges[i]._id == this.state.selectedScheduleRequestChange) {
                    this.setState({
                        scheduleRequestChangeId: this.state.selectedScheduleRequestChange
                    }, function () {

                        event.preventDefault();
                        helpers.removeScheduleRequestChange(this.state.selectedScheduleRequestChange).then(function (response) {
                        }.bind(this));

                        Materialize.toast("Schedule request change removed", 3000);
                        this.getScheduleRequestChanges();
                    });
                }
            }
        });
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
            <div>
                {(() => {
                    if (!this.props.route.isAdmin) {
                        return (
                            <div className="card-panel">
                                <div className="row">
                                    <div className="col s12">
                                        <h5><Translate content="announcements.makeAnAnnouncement" /></h5>
                                    </div>
                                </div>
                                <form onSubmit={this.addScheduleRequestChange}>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <Translate
                                                component="input"
                                                type="text"
                                                id="title"
                                                className="validate"
                                                value={this.state.title}
                                                onChange={this.handleScheduleRequestChange}
                                                required
                                                attributes={{ placeholder: 'announcements.title' }} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <Translate
                                                component="textarea"
                                                type="text"
                                                id="content"
                                                className="materialize-textarea"
                                                value={this.state.content}
                                                onChange={this.handleScheduleRequestChange}
                                                required
                                                attributes={{ placeholder: 'announcements.makeAnAnnouncement' }} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col s12">
                                            <button className="btn waves-effect waves-light btn-large green accent-3 fullWidth" type="submit" value="Submit" name="action"><Translate content="buttons.create" /><i className="material-icons right">add</i></button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )
                    }
                })()}
                <div className="card-panel">
                    <div className="row">
                        <div className="col s12">
                            <h5><Translate content="announcements.latestAnnouncements" /></h5>
                        </div>
                    </div>
                    {this.state.allScheduleRequestChanges.map((scheduleRequestChange, i) => {
                        return (
                            <div key={i} className="row">
                                <div className="col s12">
                                    <h5>{scheduleRequestChange.title}</h5>
                                    <p>{scheduleRequestChange.content}</p>
                                    <p><Translate content="announcements.postedAt" />: {scheduleRequestChange.date}</p>
                                    <p><Translate content="announcements.postedFrom" />: {scheduleRequestChange.username}</p>
                                </div>
                                {(() => {
                                    if (!this.props.route.isAdmin) {
                                        return (
                                            <div className="col s12">
                                                <a id={scheduleRequestChange._id}
                                                    className="btn btn-large waves-effect waves-light red accent-3 fullWidth"
                                                    onClick={this.handleRemoveScheduleRequestChange}
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
            </div>
        );
    }
});

module.exports = ScheduleRequestChange;