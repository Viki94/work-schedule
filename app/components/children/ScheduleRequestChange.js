import React, { Component } from 'react';
import helpers from '../utils/helpers';
import shared from '../utils/shared';
import Translate from 'react-translate-component';
import { MultiSelect } from 'primereact/multiselect';
import { Chips } from 'primereact/chips';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import * as config from '../../../public/assets/config';

class ScheduleRequestChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            allScheduleRequestChanges: [],
            allScheduleRequestChangesDublicate: [],
            scheduleRequestChangeId: '',
            selectedScheduleRequestChange: '',
            scheduleRequestsCount: 5,
            selectedScheduleRequestId: '',
            filterValue: '6',
            groups: [],
            currentUserGroups: [],
            selectedScheduleRequestGroups: [],
            keyWords: [],
            selectedKeyWords: [],
            search: ''
        }

        this.handleScheduleRequestChange = this.handleScheduleRequestChange.bind(this);
        this.onRequestsCountChange = this.onRequestsCountChange.bind(this);
        this.getScheduleRequestChanges = this.getScheduleRequestChanges.bind(this);
        this.addScheduleRequestChange = this.addScheduleRequestChange.bind(this);
        this.handleRemoveScheduleRequestChange = this.handleRemoveScheduleRequestChange.bind(this);
        this.clearStates = this.clearStates.bind(this);
        this.clearSearchState = this.clearSearchState.bind(this);
        this.handleScheduleRequest = this.handleScheduleRequest.bind(this);
        this.filterScheduleRequestChangesByValue = this.filterScheduleRequestChangesByValue.bind(this);
        this.handleSearchClick = this.handleSearchClick.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
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
        this.clearSearchState();

        if (this.state.filterValue === '6') {
            this.getScheduleRequestChanges();
        }
        else {
            if (this.props.route.isAdmin) {
                helpers.filterScheduleRequestChanges(this.state.filterValue).then(function (response) {
                    this.setState({ allScheduleRequestChanges: response.data, allScheduleRequestChangesDublicate: response.data }, function () {
                    });
                }.bind(this));
            }
            else {
                helpers.filterScheduleRequestChangesForNotAdminUser(this.state.filterValue, this.state.username).then(function (response) {
                    this.setState({ allScheduleRequestChanges: response.data, allScheduleRequestChangesDublicate: response.data }, function () {
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
        this.clearSearchState();

        if (this.props.route.isAdmin) {
            helpers.getScheduleRequestChanges(this.state.scheduleRequestsCount, this.state.currentUserGroups).then(function (response) {
                this.setState({ allScheduleRequestChanges: response.data, allScheduleRequestChangesDublicate: response.data });
            }.bind(this));
        }
        else {
            helpers.getScheduleRequestChangesForNotAdminUser(this.state.scheduleRequestsCount, this.state.username).then(function (response) {
                this.setState({ allScheduleRequestChanges: response.data, allScheduleRequestChangesDublicate: response.data });
            }.bind(this));
        }
    }

    addScheduleRequestChange(event) {
        event.preventDefault();
        let allGroups = shared.addDefaultAdminValueToRequest(this.state.groups);

        helpers.addScheduleRequestChange(this.state.title, this.state.content, Date.parse(new Date), this.state.username, allGroups, this.state.keyWords).then(function (response) {
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
        this.setState({ title: '', content: '', groups: [], keyWords: [] });
    }

    clearSearchState() {
        if (this.state.search) {
            this.setState({ search: '' });
        }
    }

    handleScheduleRequest(scheduleRequestId, clickedButtonValue) {
        const archivedStatus = 4;
        if (clickedButtonValue === archivedStatus) {
            const currentRequestStatus = this.state.allScheduleRequestChanges.find(x => x._id === scheduleRequestId).status;

            if (currentRequestStatus) {
                const refusedStatus = 3;
                const archivedWithStatusRefused = 5;
                if (currentRequestStatus == refusedStatus) {
                    clickedButtonValue = archivedWithStatusRefused
                }
            }
        }

        this.setState({ selectedScheduleRequestId: scheduleRequestId }, function () {
            for (let i = 0; i < this.state.allScheduleRequestChanges.length; i++) {
                if (this.state.allScheduleRequestChanges[i]._id == this.state.selectedScheduleRequestId) {
                    helpers.updateScheduleRequestApproval(this.state.selectedScheduleRequestId, clickedButtonValue, Date.parse(new Date), this.state.username).then(function (response) {
                        this.filterScheduleRequestChangesByValue();
                    }.bind(this));

                    let requestUpdated = $('.requestUpdated').text();
                    Materialize.toast(requestUpdated, 3000);
                }
            }
        });
    }

    handleUpdateRequest(scheduleRequestChange) {
        this.setState({ selectedScheduleRequestId: scheduleRequestChange._id, selectedScheduleRequestGroups: scheduleRequestChange.groups, selectedKeyWords: scheduleRequestChange.keyWords }, function () {
            $('[class*="container-"]').addClass('hide');
            $('[class*="save"]').parent().addClass('hide');
            $('[class*="update"]').parent().removeClass('hide');
            $('.container-' + scheduleRequestChange._id).removeClass('hide');
            $('.save-' + scheduleRequestChange._id).parent().removeClass('hide');
            $('.update-' + scheduleRequestChange._id).parent().addClass('hide');
        });
    }

    handleSaveUpdatedRequest() {
        let allGroups = shared.addDefaultAdminValueToRequest(this.state.selectedScheduleRequestGroups);

        helpers.updateScheduleRequestGroups(this.state.selectedScheduleRequestId, allGroups, this.state.selectedKeyWords, Date.parse(new Date), this.state.username).then(function (response) {
            $('.container-' + this.state.selectedScheduleRequestId).each(function () {
                $(this).addClass('hide');
            });
            $('.save-' + this.state.selectedScheduleRequestId).parent().addClass('hide');
            $('.update-' + this.state.selectedScheduleRequestId).parent().removeClass('hide');

            this.filterScheduleRequestChangesByValue();
        }.bind(this));

        let requestUpdated = $('.requestUpdated').text();
        Materialize.toast(requestUpdated, 3000);
    }

    handleSearchClick(event) {
        event.preventDefault();

        if (!this.state.search) {
            this.setState({ allScheduleRequestChanges: this.state.allScheduleRequestChangesDublicate })
            return;
        }

        let requestsContainingSearchText = [];
        this.state.allScheduleRequestChangesDublicate.map(scheduleRequestChange => {
            let valuesWithSearchedText = scheduleRequestChange.keyWords.filter(word => word.includes(this.state.search))
            if (valuesWithSearchedText.length) {
                requestsContainingSearchText.push(scheduleRequestChange)
            }
        })

        this.setState({ allScheduleRequestChanges: requestsContainingSearchText })
    }

    handleFileChosen(event) {
        document.getElementById("uploadFile").className = "btn btn-large waves-effect waves-light teal lighten-1";
    }

    handleFileUpload(event) {
        event.preventDefault();

        var file = event.target[0].files[0];
        var reader = new FileReader();

        reader.onload = function (event) {
            let resultText = event.target.result;
            let allDataFromFile = resultText.split(/\r?\n/);
            let allScheduleRequestChanges = [];

            allDataFromFile.forEach(item => {
                let dataForCurrentRequest = item.split(config.CSV_SAPARATOR);
                let currentRequest = {
                    title: dataForCurrentRequest[0],
                    content: dataForCurrentRequest[1],
                    groups: dataForCurrentRequest[2],
                    keyWords: dataForCurrentRequest[3]
                }

                allScheduleRequestChanges.push(currentRequest);
            });

            if (allScheduleRequestChanges.length) {
                for (let i = 0; i < allScheduleRequestChanges.length; i++) {
                    let allGroups = shared.addDefaultAdminValueToRequest(allScheduleRequestChanges[i].groups, true);
                    
                    helpers.addScheduleRequestChange(allScheduleRequestChanges[i].title, allScheduleRequestChanges[i].content, Date.parse(new Date), this.state.username, allGroups, allScheduleRequestChanges[i].keyWords).then(function (response) {
                        this.state.scheduleRequestChangeId = response.data._id;
                        this.filterScheduleRequestChangesByValue();
                        $('#inputFile, .file-path').val('');
                        document.getElementById("uploadFile").className += " disabled";
                    }.bind(this));

                    let requestAdded = $('.requestAdded').text();
                    Materialize.toast(requestAdded, 3000);
                }

                this.getScheduleRequestChanges();
            }
        }.bind(this);

        reader.readAsText(file);
    }

    render() {
        let search = $('.search').text();
        let choose = $('.choose').text();
        let keyWord = $('.keyWord').text();
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
                                    <Translate component="h6" content="requests.seenByUserGroups" />
                                    <div className="row">
                                        <div className="col s12 content-section implementation multiselect-demo">
                                            <MultiSelect className="col s12" value={this.state.groups} options={allGroups} onChange={(e) => this.setState({ groups: e.value })}
                                                filter={true} filterPlaceholder={search} placeholder={choose} />
                                        </div>
                                    </div>
                                    <div className="p-fluid">
                                        <Translate component="h6" content="requests.enterKeyWords" />
                                        <Chips id="keyWords" value={this.state.keyWords} onChange={this.handleScheduleRequestChange} max={5} allowDuplicate={false}></Chips>
                                    </div>
                                    <div className="row">
                                        <div className="col s12 center">
                                            <button className="btn waves-effect waves-light btn-large green accent-3" type="submit" value="Submit" name="action"><Translate content="buttons.create" /><i className="material-icons right">add</i></button>
                                        </div>
                                    </div>
                                </form>
                                <form onSubmit={this.handleFileUpload} id="addManyRequestsForm" action="#">
                                    <div className="row">
                                        <div className="col s8">
                                            <div className="file-field">
                                                <div className="btn btn-large waves-effect waves-light teal lighten-1 right customHeight">
                                                    <Translate content="buttons.chooseFile" />
                                                    <input
                                                        id="inputFile"
                                                        type="file"
                                                        name="input-file"
                                                        accept={['.csv']}
                                                        onChange={this.handleFileChosen} />
                                                    <i className="material-icons right">attach_file</i>
                                                </div>
                                                <div className="file-path-wrapper">
                                                    <input className="file-path validate" type="text" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col s4">
                                            <button id="uploadFile" className="btn btn-large waves-effect waves-light teal lighten-1 disabled" type="submit" value="Submit"><Translate content="buttons.uploadFile" />
                                                <i className="material-icons right">file_upload</i>
                                            </button>
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
                            <Translate component="option" content="requests.all" value="6" defaultValue="6" />
                            <Translate component="option" content="requests.notClassified" value="0" />
                            <Translate component="option" content="requests.reviewed" value="1" />
                            <Translate component="option" content="requests.approved" value="2" />
                            <Translate component="option" content="requests.refused" value="3" />
                            <Translate component="option" content="requests.archivedAsApproved" value="4" />
                            <Translate component="option" content="requests.archivedAsRefused" value="5" />
                        </select>
                    </div>
                    <div className="input-field col s12">
                        <div className="p-col-12 p-md-4">
                            <div className="p-inputgroup">
                                <InputText placeholder={keyWord} onChange={(e) => this.setState({ search: e.target.value })} />
                                <Button icon="pi pi-search" className="p-button-info" onClick={this.handleSearchClick} />
                                <Button icon="pi pi-times" className="p-button-danger" onClick={this.getScheduleRequestChanges} />
                            </div>
                        </div>
                    </div>
                    {this.state.allScheduleRequestChanges.length ?
                        this.state.allScheduleRequestChanges.map((scheduleRequestChange, i) => {
                            return (
                                <div key={i} className="row saparator">
                                    <div className="col s12">
                                        <h5>{scheduleRequestChange.title}</h5>
                                        <p>{scheduleRequestChange.content}</p>
                                        <b></b>
                                        <p><b><Translate content="requests.postedFrom" />: </b>{scheduleRequestChange.username}</p>
                                        <p><b><Translate content="requests.postedAt" />: </b>{shared.publishedDate(scheduleRequestChange.date)}</p>
                                        <p><b><Translate content="requests.updatedFrom" />: </b>{scheduleRequestChange.lastUpdatedUsername ? scheduleRequestChange.lastUpdatedUsername : <Translate content="requests.noUpdatedUsername" />}</p>
                                        <p><b><Translate content="requests.updatedAt" />: </b>{scheduleRequestChange.lastUpdatedDate ? shared.publishedDate(scheduleRequestChange.lastUpdatedDate) : <Translate content="requests.noUpdatedDate" />}</p>
                                        <p><b><Translate content="requests.status" /> </b>
                                            {scheduleRequestChange.status == 1 ? <Translate content="requests.review" /> :
                                                (scheduleRequestChange.status == 2 ? <Translate content="requests.approve" /> :
                                                    (scheduleRequestChange.status == 3 ? <Translate content="requests.refuse" /> :
                                                        (scheduleRequestChange.status == 4 ? <Translate content="requests.archiveAsApproved" /> :
                                                            (scheduleRequestChange.status == 5 ? <Translate content="requests.archiveAsRefused" /> :
                                                                <Translate content="requests.notClassified" />))))
                                            }

                                        </p>
                                        <div className={"container-" + scheduleRequestChange._id}>
                                            <div className="alignItems">
                                                <b><Translate content="requests.seenByUserGroups" /></b>
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
                                            <div className={"alignItems center update-" + scheduleRequestChange._id}>
                                                <button id={scheduleRequestChange._id}
                                                    className={"btn btn-large waves-effect waves-light blue accent-3 " + (scheduleRequestChange.status == 2 || scheduleRequestChange.status == 3 || scheduleRequestChange.status == 4 || scheduleRequestChange.status == 5 ? 'disabled' : '')}
                                                    onClick={() => this.handleUpdateRequest(scheduleRequestChange)}>
                                                    <i className="material-icons right">edit</i>
                                                </button>
                                            </div>
                                            <b><Translate content="requests.keyWords" />:</b>
                                            {scheduleRequestChange.keyWords.length ?
                                                <Chips id="keyWords" className="readOnlyView" value={scheduleRequestChange.keyWords} disabled={true}></Chips> :
                                                <p><Translate content="requests.noKeyWords" /></p>
                                            }
                                        </div>
                                        <div className="hide">
                                            <div className="alignItems">
                                                <div>
                                                    <b><Translate content='users.groups' />:</b>
                                                    <div>
                                                        <div className="content-section implementation multiselect-demo">
                                                            <MultiSelect value={this.state.selectedScheduleRequestGroups} options={allGroups} onChange={(e) => this.setState({ selectedScheduleRequestGroups: e.value })}
                                                                filter={true} filterPlaceholder={search} placeholder={choose} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={"alignItems center save-" + scheduleRequestChange._id}>
                                                <button id={scheduleRequestChange._id}
                                                    className={"btn btn-large waves-effect waves-light blue accent-3 " + (scheduleRequestChange.status == 2 || scheduleRequestChange.status == 3 || scheduleRequestChange.status == 4 || scheduleRequestChange.status == 5 ? 'disabled' : '')}
                                                    onClick={() => this.handleSaveUpdatedRequest()}>
                                                    <i className="material-icons right">save</i>
                                                </button>
                                            </div>
                                            <div className="p-fluid">
                                                <b><Translate content="requests.enterKeyWords" /></b>
                                                <Chips id="keyWords" value={this.state.selectedKeyWords} onChange={(e) => this.setState({ selectedKeyWords: e.value })} max={5} allowDuplicate={false}></Chips>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        (() => {
                                            if (this.props.route.isAdmin) {
                                                return (
                                                    <div>
                                                        <div className="col s12 m6 l3 center">
                                                            <button id="reviewRequest"
                                                                className={"btn btn-large waves-effect waves-light blue accent-3 controllerWidth " + (scheduleRequestChange.status != 0 ? 'disabled' : '')}
                                                                onClick={() => this.handleScheduleRequest(scheduleRequestChange._id, 1)}>
                                                                <Translate content="buttons.review" />
                                                                <i className="material-icons right">rate_review</i>
                                                            </button>
                                                        </div>
                                                        <div className="col s12 m6 l3 center">
                                                            <button id="approveRequest"
                                                                className={"btn btn-large waves-effect waves-light green accent-3 controllerWidth " + (scheduleRequestChange.status == 0 || scheduleRequestChange.status == 2 || scheduleRequestChange.status == 4 || scheduleRequestChange.status == 5 ? 'disabled' : '')}
                                                                onClick={() => this.handleScheduleRequest(scheduleRequestChange._id, 2)}>
                                                                <Translate content="buttons.approve" />
                                                                <i className="material-icons right">event_available</i>
                                                            </button>
                                                        </div>
                                                        <div className="col s12 m6 l3 center">
                                                            <button id="refuseRequest"
                                                                className={"btn btn-large waves-effect waves-light red accent-3 controllerWidth " + (scheduleRequestChange.status == 0 || scheduleRequestChange.status == 3 || scheduleRequestChange.status == 4 || scheduleRequestChange.status == 5 ? 'disabled' : '')}
                                                                onClick={() => this.handleScheduleRequest(scheduleRequestChange._id, 3)}>
                                                                <Translate content="buttons.refuse" />
                                                                <i className="material-icons right">event_busy</i>
                                                            </button>
                                                        </div>
                                                        <div className="col s12 m6 l3 center">
                                                            <button id="archiveRequest"
                                                                className={"btn btn-large waves-effect waves-light teal accent-3 controllerWidth " + (scheduleRequestChange.status == 0 || scheduleRequestChange.status == 1 || scheduleRequestChange.status == 4 || scheduleRequestChange.status == 5 ? 'disabled' : '')}
                                                                onClick={() => this.handleScheduleRequest(scheduleRequestChange._id, 4)}>
                                                                <Translate content="buttons.archive" />
                                                                <i className="material-icons right">archive</i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            else {
                                                return (
                                                    <div className="col s12 center">
                                                        <a id={scheduleRequestChange._id}
                                                            className="btn btn-large waves-effect waves-light red accent-3"
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
                                    <div className="marginBottom"></div>
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
                <Translate content="search" className="hide search" />
                <Translate content="choose" className="hide choose" />
                <Translate content="keyWord" className="hide keyWord" />
            </div >
        );
    }
}

module.exports = ScheduleRequestChange;