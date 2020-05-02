import React, { Component } from 'react';
import helpers from '../utils/helpers';
import Translate from 'react-translate-component';

class ScheduleRequestChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            allScheduleRequestChanges: [],
            scheduleRequestChangeId: '',
            selectedScheduleRequestChange: '',
            scheduleRequestsCount: 5
        }

        this.handleScheduleRequestChange = this.handleScheduleRequestChange.bind(this);
        this.onRequestsCountChange = this.onRequestsCountChange.bind(this);
        this.getScheduleRequestChanges = this.getScheduleRequestChanges.bind(this);
        this.addScheduleRequestChange = this.addScheduleRequestChange.bind(this);
        this.handleRemoveScheduleRequestChange = this.handleRemoveScheduleRequestChange.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.clearStates = this.clearStates.bind(this);
    }

    componentDidMount() {
        helpers.getCurrentUser().then(function (response) {
            if (response !== this.state.username) {
                this.setState({ username: response.data.username });
            }
        }.bind(this));

        this.getScheduleRequestChanges();

        $("#scheduleRequestCount").on('change', function (event) {
            this.setState({ scheduleRequestsCount: event.target.value }, function () {
                this.getScheduleRequestChanges();
            });
        }.bind(this))
    }

    handleScheduleRequestChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }

    onRequestsCountChange(count) {
        this.setState({ scheduleRequestsCount: count }, function () {
            this.getScheduleRequestChanges();
        });
    }

    getScheduleRequestChanges() {
        helpers.getScheduleRequestChanges(this.state.scheduleRequestsCount).then(function (response) {
            this.setState({ allScheduleRequestChanges: response.data }, function () {
                // if (this.props.isAdmin) {
                //     this.props.getUpdatedScheduleRequestChanges(this.state.allScheduleRequestChanges);
                // }
            });
        }.bind(this));
    }

    addScheduleRequestChange(event) {
        event.preventDefault(event);
        helpers.addScheduleRequestChange(this.state.title, this.state.content, new Date().toUTCString(), this.state.username).then(function (response) {
            this.state.scheduleRequestChangeId = response.data._id;
            this.getScheduleRequestChanges();
            this.clearStates();
        }.bind(this));

        Materialize.toast('Schedule request change added', 3000);
        this.clearForm();
    }

    handleRemoveScheduleRequestChange(event) {
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
    }

    clearForm() {
        var elements = document.getElementsByTagName("input");
        for (var i = 0; i < elements.length; i++) {
            elements[i].value = "";
            elements[i].classList.remove("valid");
        };
    }

    clearStates() {
        this.setState({ title: "", content: "" });
    }

    render() {
        return (
            <div>
                {(() => {
                    if (!this.props.route.isAdmin) {
                        return (
                            <div className="card-panel">
                                <div className="row">
                                    <div className="col s12">
                                        <h5><Translate content="requests.makeARequest" /></h5>
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
                                                attributes={{ placeholder: 'requests.title' }} />
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
                                                attributes={{ placeholder: 'requests.makeARequest' }} />
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
                            <h5><Translate content="requests.latestRequests" /></h5>
                        </div>
                    </div>
                    <div className="input-field col s12">
                        <div><Translate content="requests.selectRequestCount" /></div>
                        <select id="scheduleRequestCount">
                            <option value="5" defaultValue="5" >5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <Translate component="option" content="requests.all" value="0" />
                        </select>
                    </div>
                    {this.state.allScheduleRequestChanges.map((scheduleRequestChange, i) => {
                        return (
                            <div key={i} className="row">
                                <div className="col s12">
                                    <h5>{scheduleRequestChange.title}</h5>
                                    <p>{scheduleRequestChange.content}</p>
                                    <p><Translate content="requests.postedAt" />: {scheduleRequestChange.date}</p>
                                    <p><Translate content="requests.postedFrom" />: {scheduleRequestChange.username}</p>
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
}

module.exports = ScheduleRequestChange;