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
            scheduleRequestsCount: 5,
            selectedScheduleRequestId: '',
            filterValue: '4'
        }

        this.handleScheduleRequestChange = this.handleScheduleRequestChange.bind(this);
        this.onRequestsCountChange = this.onRequestsCountChange.bind(this);
        this.getScheduleRequestChanges = this.getScheduleRequestChanges.bind(this);
        this.addScheduleRequestChange = this.addScheduleRequestChange.bind(this);
        this.handleRemoveScheduleRequestChange = this.handleRemoveScheduleRequestChange.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.clearStates = this.clearStates.bind(this);
        this.handleScheduleRequest = this.handleScheduleRequest.bind(this);
        this.filterScheduleRequestChangesByValue = this.filterScheduleRequestChangesByValue.bind(this);
    }

    componentDidMount() {
        helpers.getCurrentUser().then(function (response) {
            if (response !== this.state.username) {
                this.setState({ username: response.data.username });
            }

            this.getScheduleRequestChanges();
        }.bind(this));


        $("#scheduleRequestCount").on('change', function (event) {
            this.setState({ scheduleRequestsCount: event.target.value }, function () {
                this.filterScheduleRequestChangesByValue();
            });
        }.bind(this))

        $("#scheduleRequestFilter").on('change', function (event) {
            this.setState({ filterValue: event.target.value }, function () {
                this.filterScheduleRequestChangesByValue();
            });
        }.bind(this))
    }

    filterScheduleRequestChangesByValue() {
        if (this.state.filterValue === '4') {
            this.getScheduleRequestChanges();
        }
        else {
            if (this.props.route.isAdmin) {
                helpers.filterScheduleRequestChanges(this.state.filterValue).then(function (response) {
                    this.setState({ allScheduleRequestChanges: response.data }, function () {
                    });
                }.bind(this));
            }
            else {
                helpers.filterScheduleRequestChangesForNotAdminUser(this.state.filterValue, this.state.username).then(function (response) {
                    this.setState({ allScheduleRequestChanges: response.data }, function () {
                    });
                }.bind(this));
            }
        }
    }

    handleScheduleRequestChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }

    onRequestsCountChange(count) {
        this.setState({ scheduleRequestsCount: count }, function () {
            this.filterScheduleRequestChangesByValue();
        });
    }

    getScheduleRequestChanges() {
        if (this.props.route.isAdmin) {
            helpers.getScheduleRequestChanges(this.state.scheduleRequestsCount).then(function (response) {
                this.setState({ allScheduleRequestChanges: response.data });
            }.bind(this));

        }
        else {
            helpers.getScheduleRequestChangesForNotAdminUser(this.state.scheduleRequestsCount, this.state.username).then(function (response) {
                this.setState({ allScheduleRequestChanges: response.data });
            }.bind(this));
        }
    }

    addScheduleRequestChange(event) {
        event.preventDefault();
        helpers.addScheduleRequestChange(this.state.title, this.state.content, new Date().toUTCString(), this.state.username).then(function (response) {
            this.state.scheduleRequestChangeId = response.data._id;
            this.filterScheduleRequestChangesByValue();
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

                        this.filterScheduleRequestChangesByValue();
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

    handleScheduleRequest(scheduleRequestId, clickedButton) {
        const approvedValue = 1;
        const refusedValue = 2;
        let clickedButtonValue = approvedValue;
        if (clickedButton === 'refuse') {
            clickedButtonValue = refusedValue;
        }

        this.setState({ selectedScheduleRequestId: scheduleRequestId }, function () {
            for (let i = 0; i < this.state.allScheduleRequestChanges.length; i++) {
                if (this.state.allScheduleRequestChanges[i]._id == this.state.selectedScheduleRequestId) {
                    helpers.updateScheduleRequestChange(this.state.selectedScheduleRequestId, clickedButtonValue).then(function (response) {
                        this.filterScheduleRequestChangesByValue();
                    }.bind(this));

                    Materialize.toast("Schedule request change updated", 3000);
                }
            }
        });
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
                    <hr />
                    <div className="input-field col s12">
                        <div><Translate content="requests.filterRequests" /></div>
                        <select id="scheduleRequestFilter">
                            <Translate component="option" content="requests.all" value="4" defaultValue="4" />
                            <Translate component="option" content="requests.notClassified" value="0" />
                            <Translate component="option" content="requests.approved" value="1" />
                            <Translate component="option" content="requests.refused" value="2" />
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
                                    if (this.props.route.isAdmin) {
                                        return (
                                            <div>
                                                <div className="col s6 center">
                                                    <button id="approveRequest"
                                                        className={"btn btn-large waves-effect waves-light green accent-3 " + (scheduleRequestChange.approved == 1 ? 'disabled' : '')}
                                                        onClick={() => this.handleScheduleRequest(scheduleRequestChange._id, "approve")}><Translate content="buttons.approve" />
                                                        <i className="material-icons right">event_available</i>
                                                    </button>
                                                </div>
                                                <div className="col s6 center">
                                                    <button id="refuseRequest"
                                                        className={"btn btn-large waves-effect waves-light red accent-3 " + (scheduleRequestChange.approved == 2 ? 'disabled' : '')}
                                                        onClick={() => this.handleScheduleRequest(scheduleRequestChange._id, "refuse")}><Translate content="buttons.refuse" />
                                                        <i className="material-icons right">event_busy</i>
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    }
                                    else {
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