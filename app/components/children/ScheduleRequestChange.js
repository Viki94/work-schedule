import React, { Component } from 'react';
import helpers from '../utils/helpers';
import shared from '../utils/shared';
import Translate from 'react-translate-component';
import { MultiSelect } from 'primereact/multiselect';

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
            filterValue: '4',
            groups: [],
            currentUserGroups: [],
            selectedScheduleRequestGroups: ''
        }

        this.handleScheduleRequestChange = this.handleScheduleRequestChange.bind(this);
        this.onRequestsCountChange = this.onRequestsCountChange.bind(this);
        this.getScheduleRequestChanges = this.getScheduleRequestChanges.bind(this);
        this.addScheduleRequestChange = this.addScheduleRequestChange.bind(this);
        this.handleRemoveScheduleRequestChange = this.handleRemoveScheduleRequestChange.bind(this);
        this.clearStates = this.clearStates.bind(this);
        this.handleScheduleRequest = this.handleScheduleRequest.bind(this);
        this.filterScheduleRequestChangesByValue = this.filterScheduleRequestChangesByValue.bind(this);
    }

    componentDidMount() {
        helpers.getCurrentUser().then(function (response) {
            if (response !== this.state.username) {
                this.setState({ username: response.data.username, currentUserGroups: response.data.groups });
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
            helpers.getScheduleRequestChanges(this.state.scheduleRequestsCount, this.state.currentUserGroups).then(function (response) {
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
        helpers.addScheduleRequestChange(this.state.title, this.state.content, Date.parse(new Date), this.state.username, this.state.groups).then(function (response) {
            this.state.scheduleRequestChangeId = response.data._id;
            this.filterScheduleRequestChangesByValue();
            this.clearStates();
        }.bind(this));

        let requestAdded = $('.requestAdded').text();
        Materialize.toast(requestAdded, 3000);
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

                        let requestRemoved = $('.requestRemoved').text();
                        Materialize.toast(requestRemoved, 3000);

                        this.filterScheduleRequestChangesByValue();
                    });
                }
            }
        });
    }

    clearStates() {
        this.setState({ title: "", content: "", groups: [] });
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
                    helpers.updateScheduleRequestApproval(this.state.selectedScheduleRequestId, clickedButtonValue).then(function (response) {
                        this.filterScheduleRequestChangesByValue();
                    }.bind(this));

                    let requestUpdated = $('.requestUpdated').text();
                    Materialize.toast(requestUpdated, 3000);
                }
            }
        });
    }

    handleUpdateRequest(scheduleRequestChange) {
        this.setState({ selectedScheduleRequestId: scheduleRequestChange._id, selectedScheduleRequestGroups: scheduleRequestChange.groups }, function () {
            $('[id*="container"]').addClass('hide');
            $('[class*="save"]').parent().addClass('hide');
            $('[class*="update"]').parent().removeClass('hide');
            $('#container-' + scheduleRequestChange._id).removeClass('hide');
            $('.save-' + scheduleRequestChange._id).parent().removeClass('hide');
            $('.update-' + scheduleRequestChange._id).parent().addClass('hide');
        });
    }

    handleSaveUpdatedRequest() {
        helpers.updateScheduleRequestGroups(this.state.selectedScheduleRequestId, this.state.selectedScheduleRequestGroups).then(function (response) {
            $('#container-' + this.state.selectedScheduleRequestId).addClass('hide');
            $('.save-' + this.state.selectedScheduleRequestId).parent().addClass('hide');
            $('.update-' + this.state.selectedScheduleRequestId).parent().removeClass('hide');

            let requestUpdated = $('.requestUpdated').text();
            Materialize.toast(requestUpdated, 3000);

            this.filterScheduleRequestChangesByValue();
        }.bind(this));


    }

    render() {
        let search = $('.search').text();
        let choose = $('.choose').text();
        let allGroups = [
            { label: ' Администратор', value: '1' },
            { label: ' Преподавател', value: '2' },
            { label: ' Студент', value: '3' },
            { label: ' Прекъснал студент', value: '4' },
            { label: ' Завършил студент', value: '5' },
            { label: ' Инспектор', value: '6' },
            { label: ' Декан', value: '7' },
            { label: ' Заместник-декан', value: '8' },
            { label: ' Факултативен съвет', value: '9' }
        ];

        let lang = localStorage.getItem('lang');

        if (lang === 'en') {
            allGroups = [
                { label: ' Administrator', value: '1' },
                { label: ' University lecturer', value: '2' },
                { label: ' Student', value: '3' },
                { label: ' Interrupted student', value: '4' },
                { label: ' Graduate student', value: '5' },
                { label: ' Inspector', value: '6' },
                { label: ' Dean', value: '7' },
                { label: ' Vice dean', value: '8' },
                { label: ' Faculty council', value: '9' }
            ];
        }

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
                                    <Translate component="h6" content='users.groups' />
                                    <div className="row">
                                        <div className="col s12 content-section implementation multiselect-demo">
                                            <MultiSelect className="col s12" value={this.state.groups} options={allGroups} onChange={(e) => this.setState({ groups: e.value })}
                                                filter={true} filterPlaceholder={search} placeholder={choose} />
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
                    {this.state.allScheduleRequestChanges.length ?
                        this.state.allScheduleRequestChanges.map((scheduleRequestChange, i) => {
                            return (
                                <div key={i} className="row">
                                    <div className="col s12">
                                        <h5>{scheduleRequestChange.title}</h5>
                                        <p>{scheduleRequestChange.content}</p>
                                        <p><Translate content="requests.postedAt" />: {shared.publishedDate(scheduleRequestChange.date)}</p>
                                        <p><Translate content="requests.postedFrom" />: {scheduleRequestChange.username}</p>
                                        <p><Translate content="requests.status" />
                                            {scheduleRequestChange.approved == 1 ? <Translate content="requests.approve" /> :
                                                (scheduleRequestChange.approved == 2 ? <Translate content="requests.refuse" /> :
                                                    <Translate content="requests.notClassified" />)}
                                        </p>
                                        <div id={"container-" + scheduleRequestChange._id}>
                                            <div className="alignItems">
                                                <Translate content="requests.seenByUserGroups" />
                                                {scheduleRequestChange.groups.length ?
                                                    scheduleRequestChange.groups.map((groupValue, j) => {
                                                        let allGroupValues = [];
                                                        allGroups.map(group => {
                                                            if (group.value === groupValue) {
                                                                allGroupValues.push(group.label)
                                                            }
                                                        })

                                                        return <p key={j}>- {allGroupValues}</p>
                                                    }) :
                                                    <p>- {allGroups[0].label}</p>
                                                }
                                            </div>
                                            <div className={"alignItems update-" + scheduleRequestChange._id}>
                                                <button id={scheduleRequestChange._id}
                                                    className="btn btn-large waves-effect waves-light blue accent-3"
                                                    onClick={() => this.handleUpdateRequest(scheduleRequestChange)}>
                                                    <i className="material-icons right">edit</i>
                                                </button>
                                            </div>
                                        </div>



                                        <div className="hide">
                                            <div className="alignItems">
                                                <Translate component="h6" content='users.groups' />
                                                <div className="">
                                                    <div className="content-section implementation multiselect-demo">
                                                        <MultiSelect value={this.state.selectedScheduleRequestGroups} options={allGroups} onChange={(e) => this.setState({ selectedScheduleRequestGroups: e.value })}
                                                            filter={true} filterPlaceholder={search} placeholder={choose} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={"alignItems save-" + scheduleRequestChange._id}>
                                                <button id={scheduleRequestChange._id}
                                                    className="btn btn-large waves-effect waves-light blue accent-3"
                                                    onClick={() => this.handleSaveUpdatedRequest()}>
                                                    <i className="material-icons right">save</i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        (() => {
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
                                        })()
                                    }
                                </div>
                            );
                        }, this) :
                        <b>
                            <Translate content="requests.noInformation" />
                        </b>
                    }
                </div>

                <Translate content="toasts.requestAdded" className="hide requestAdded" />
                <Translate content="toasts.requestUpdated" className="hide requestUpdated" />
                <Translate content="toasts.requestRemoved" className="hide requestRemoved" />
                <Translate content="users.search" className="hide search" />
                <Translate content="users.choose" className="hide choose" />
            </div >
        );
    }
}

module.exports = ScheduleRequestChange;