import React, { Component } from 'react';
import helpers from '../utils/helpers';
import shared from '../utils/shared';
import Translate from 'react-translate-component';
import ExportScheduleToExcelFile from './ExportScheduleToExcelFile';
import * as config from '../../../public/assets/config';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';

class AdminSchedulesCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allHalls: [],
            hallSchedules: [],
            selectedSchedule: null,
            visibleSelectedSchedule: false,
            visibleCreateMeeting: false,
            visibleRemoveMeeting: false,
            createdMeetingRoom: {
                id: '',
                join_url: '',
                password: '',
                start_time: '',
                start_url: '',
                topic: ''
            },
            meetingDate: null,
            description: ''
        }

        this.getHallSchedules = this.getHallSchedules.bind(this);
        this.getAllHalls = this.getAllHalls.bind(this);
        this.scheduleEditor = this.scheduleEditor.bind(this);
        this.onEditorValueChange = this.onEditorValueChange.bind(this);
        this.renderTableButtons = this.renderTableButtons.bind(this);
        this.renderScheduleDialogContent = this.renderScheduleDialogContent.bind(this);
        this.handleCreateMeeting = this.handleCreateMeeting.bind(this);
        this.handleRemoveMeeting = this.handleRemoveMeeting.bind(this);
        this.updateScheduleMeeting = this.updateScheduleMeeting.bind(this);
        this.handleFileChosen = this.handleFileChosen.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
    }

    componentDidMount() {
        this.getHallSchedules();
        this.getAllHalls();
    }

    getHallSchedules() {
        helpers.getHallSchedules().then(function (response) {
            if (response !== this.state.hallSchedules) {
                this.setState({
                    hallSchedules: response.data,
                    description: response.data[0].description
                });
            }
        }.bind(this));
    }

    getAllHalls() {
        helpers.getAllHalls().then(function (response) {
            if (response !== this.state.allHalls) {
                this.setState({ allHalls: response.data });
            }
        }.bind(this));
    }

    handleSaveHallSchedule() {
        this.state.hallSchedules.map((hallSchedule) => {
            helpers.updateHallSchedule(hallSchedule).then(function (response) {
            }.bind(this));
        })

        let scheduleUpdated = $('.scheduleUpdated').text();
        Materialize.toast(scheduleUpdated, 3000);
    }

    onEditorValueChange(props, value) {
        let updatedSchedules = [...this.state.hallSchedules];
        updatedSchedules[props.rowIndex][props.field] = value;
        this.setState({ hallSchedules: updatedSchedules });
    }

    scheduleEditor(props) {
        return <InputText type="text" value={this.state.hallSchedules[props.rowIndex][props.field]} onChange={(e) => this.onEditorValueChange(props, e.target.value)} />;
    }

    renderTableButtons(rowData, column) {
        let foundScheduleIndex = this.state.hallSchedules.findIndex(x => x.hall_id === rowData.hall_id);

        return <div className="center">
            <Button type="button" icon="pi pi-calendar-plus" className="p-button-success" onClick={(e) => this.setState({ selectedSchedule: rowData.hall_id, visibleCreateMeeting: true })}></Button>
            {foundScheduleIndex >= 0 && this.state.hallSchedules[foundScheduleIndex].meetingStartUrl.length ?
                <Button type="button" icon="pi pi-calendar-minus" className="p-button-danger" onClick={(e) => this.setState({ selectedSchedule: rowData.hall_id, visibleRemoveMeeting: true })}></Button> : ""}
            <Button type="button" icon="pi pi-search" className="p-button-warning" onClick={(e) => this.setState({ selectedSchedule: rowData.hall_id, visibleSelectedSchedule: true })}></Button>
        </div>
    }

    renderScheduleDialogContent() {
        let foundHallIndex = this.state.allHalls.findIndex(x => x._id === this.state.selectedSchedule);
        if (this.state.selectedSchedule && foundHallIndex >= 0) {
            let foundScheduleIndex = this.state.hallSchedules.findIndex(x => x.hall_id === this.state.selectedSchedule);
            return (
                <div className="p-grid center">
                    <div><Translate component="b" content="hall.hall" /></div>
                    <div>{this.state.allHalls[foundHallIndex].name}</div>

                    <div><Translate component="b" content="hall.address" /></div>
                    <div>{this.state.allHalls[foundHallIndex].address}</div>

                    <div><Translate component="b" content="hall.city" /></div>
                    <div>{this.state.allHalls[foundHallIndex].city}</div>

                    <div><Translate component="b" content="hall.sittingPlaces" /></div>
                    <div>{this.state.allHalls[foundHallIndex].sittingPlaces}</div>

                    <div><Translate component="b" content="hall.gpsCoordinates" /></div>
                    <div>{this.state.allHalls[foundHallIndex].gpsCoordinates}</div>

                    {
                        foundScheduleIndex >= 0 && this.state.hallSchedules[foundScheduleIndex].meetingStartUrl.length ?
                            <div className="borderTop">
                                <div><Translate component="b" content="hall.meetingTopic" /></div>
                                <div>{this.state.hallSchedules[foundHallIndex].meetingTopic}</div>

                                <div><Translate component="b" content="hall.meetingStartUrl" /></div>
                                <div>
                                    <a href={this.state.hallSchedules[foundHallIndex].meetingStartUrl} target="_blank">
                                        {this.state.hallSchedules[foundHallIndex].meetingStartUrl}
                                    </a>
                                </div>

                                <div><Translate component="b" content="hall.meetingJoinUrl" /></div>
                                <div>
                                    <a href={this.state.hallSchedules[foundHallIndex].meetingJoinUrl} target="_blank">
                                        {this.state.hallSchedules[foundHallIndex].meetingJoinUrl}
                                    </a>
                                </div>

                                <div><Translate component="b" content="hall.meetingId" /></div>
                                <div>{this.state.hallSchedules[foundHallIndex].meetingId}</div>

                                <div><Translate component="b" content="hall.meetingPassword" /></div>
                                <div>{this.state.hallSchedules[foundHallIndex].meetingPassword}</div>

                                <div><Translate component="b" content="hall.meetingStartTime" /></div>
                                <div>{shared.publishedDate(this.state.hallSchedules[foundHallIndex].meetingStartTime)}</div>
                            </div> : ''
                    }
                </div >
            );
        }
        else {
            return null;
        }
    }

    renderCreateMeeting() {
        return (
            <div className="container">
                <form onSubmit={this.handleCreateMeeting} >
                    <div className="row">
                        <div className="col-12">
                            <Translate component="label" content="meeting.name" attributes={{ htmlFor: 'name' }} />
                            <input type="text" name="name" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Translate component="label" content="meeting.password" attributes={{ htmlFor: 'password' }} />
                            <input type="text" name="password" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Translate component="label" content="meeting.dateAndHour" />
                            <Calendar value={this.state.meetingDate} onChange={(e) => this.setState({ meetingDate: e.value })} showTime={true} inline={true} minDate={new Date()} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12 center">
                            <button className="btn btn-large waves-effect waves-light green accent-3" type="submit" value="Submit"><Translate content="buttons.add" />
                                <i className="material-icons right">add</i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    renderRemoveMeeting() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col s12 center">
                        <Translate component="div" content="meeting.areYouSure" />
                        <div className="marginBottom"></div>
                        <button className="btn btn-large waves-effect waves-light red accent-3" value="Submit" onClick={this.handleRemoveMeeting}><Translate content="buttons.remove" />
                            <i className="material-icons right">remove</i>
                        </button>
                    </div>
                </div>
            </div >
        );
    }

    updateScheduleMeeting(shouldDeleteMeetinData) {
        let meetingRoomData = this.state.createdMeetingRoom
        if (shouldDeleteMeetinData) {
            meetingRoomData = {
                id: '',
                join_url: '',
                password: '',
                start_time: '',
                start_url: '',
                topic: ''
            };
        }

        helpers.updateScheduleMeeting(this.state.selectedSchedule, meetingRoomData).then(function (response) {
            this.getHallSchedules();
            this.getAllHalls();
        }.bind(this));
    }

    handleCreateMeeting(event) {
        event.preventDefault();
        let topic = event.target[0].value;
        let password = event.target[1].value;
        let startTime = this.state.meetingDate;
        if (startTime) {
            startTime = shared.formattedDateForZoomStartTime(startTime);
        }

        let http = new XMLHttpRequest();
        let url = '/admin';
        let data = `topic=${topic}&password=${password}&startTime=${startTime}`

        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        http.onreadystatechange = function () {
            if (http.readyState == 4 && http.status == 200) {
                let createdRoom = JSON.parse(http.responseText)
                createdRoom.start_time = Date.parse(createdRoom.start_time).toString();
                this.setState({
                    createdMeetingRoom: createdRoom,
                    visibleSelectedSchedule: true,
                    visibleCreateMeeting: false
                }, () => {
                    this.updateScheduleMeeting(false);
                })
            }
        }.bind(this)

        http.send(data);
    }

    handleRemoveMeeting() {
        this.setState({
            visibleSelectedSchedule: true,
            visibleRemoveMeeting: false
        }, () => {
            this.updateScheduleMeeting(true);
        });
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
            let allSchedules = [];

            allDataFromFile.forEach(item => {
                let dataForCurrentHall = item.split(config.CSV_SAPARATOR);
                let currentSchedule = {
                    name: dataForCurrentHall[0],
                    disciplineType: dataForCurrentHall[1],
                    disciplineName: dataForCurrentHall[2],
                    department: dataForCurrentHall[3],
                    course: dataForCurrentHall[4],
                    typeOfOccupation: dataForCurrentHall[5],
                    lecturer: dataForCurrentHall[6],
                    references: dataForCurrentHall[7],
                    dayOfWeek: dataForCurrentHall[8],
                    startHour: dataForCurrentHall[9],
                    endHour: dataForCurrentHall[10]
                }

                allSchedules.push(currentSchedule);
            });

            if (allSchedules.length) {
                for (let i = 0; i < allSchedules.length; i++) {
                    helpers.uploadHallSchedule(allSchedules[i]).then(function (response) {
                        $('#inputFile, .file-path').val('');
                        document.getElementById("uploadFile").className += " disabled";
                    }.bind(this));
                }

                this.getHallSchedules();
                this.getAllHalls();
                let scheduleUpdated = $('.scheduleUpdated').text();
                Materialize.toast(scheduleUpdated, 3000);
            }
        }.bind(this);

        reader.readAsText(file);
    }

    handleClearHallSchedule() {
        let updatedHallSchedules = this.state.hallSchedules.map((hallSchedule, j) => {
            hallSchedule.disciplineType = '';
            hallSchedule.disciplineName = '';
            hallSchedule.department = '';
            hallSchedule.course = '';
            hallSchedule.typeOfOccupation = '';
            hallSchedule.lecturer = '';
            hallSchedule.references = '';
            hallSchedule.dayOfWeek = '';
            hallSchedule.startHour = '';
            hallSchedule.endHour = '';

            return hallSchedule;
        });

        this.setState({ hallSchedules: updatedHallSchedules }, () => {
            this.handleSaveHallSchedule();
        });
    }

    handleEditScheduleDescription() {
        $('#description').removeClass('hide');
        $('#descriptionText').addClass('hide');
        $('#saveDescription').removeClass('hide');
        $('#editDescription').addClass('hide');
    }

    handleSaveScheduleDescription() {
        $('#description').addClass('hide');
        $('#descriptionText').removeClass('hide');
        $('#saveDescription').addClass('hide');
        $('#editDescription').removeClass('hide');

        this.state.hallSchedules.map((hallSchedule) => {
            helpers.updateHallScheduleDescription(hallSchedule._id, this.state.description).then(function (response) {
            }.bind(this));
        })

        let scheduleUpdated = $('.scheduleUpdated').text();
        Materialize.toast(scheduleUpdated, 3000);
    }

    render() {
        return (
            <div className="row">
                <div className="col m12" >
                    <div className="section">
                        <Translate component="h5" content="scheduleEditor" />
                        <div className="row">
                            <div id="descriptionText" className="input-field col s4">
                                <Translate
                                    component="input"
                                    type="text"
                                    name="description"
                                    value={this.state.description}
                                    readonly="readonly"
                                    onChange={(event) => { this.setState({ description: event.target.value }) }}
                                    attributes={{ placeholder: 'scheduleDescription' }} />
                            </div>
                            <div id="description" className="input-field col s4 center hide">
                                <Translate
                                    component="input"
                                    type="text"
                                    name="description"
                                    value={this.state.description}
                                    onChange={(event) => { this.setState({ description: event.target.value }) }}
                                    attributes={{ placeholder: 'scheduleDescription' }} />
                            </div>
                            <button id="editDescription"
                                className="btn btn-large waves-effect waves-light green accent-3"
                                onClick={() => this.handleEditScheduleDescription()}>
                                <i className="material-icons right">edit</i>
                            </button>
                            <button id="saveDescription"
                                className="btn btn-large waves-effect waves-light blue accent-3 hide"
                                onClick={() => this.handleSaveScheduleDescription()}>
                                <i className="material-icons right">save</i>
                            </button>
                        </div>
                        <DataTable value={this.state.hallSchedules} paginator={true} rows={config.CREATE_SCHEDULE_ROW_COUNT} first={this.state.first} onPage={(e) => this.setState({ first: e.first })} sortMode="multiple" responsive={true}>
                            <Column field='name' header={<Translate content="hall.hall" />} sortable={true} />
                            <Column field='disciplineType' header={<Translate content="dayOfWeeks.short.disciplineType" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='disciplineName' header={<Translate content="dayOfWeeks.short.disciplineName" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='department' header={<Translate content="dayOfWeeks.short.department" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='course' header={<Translate content="dayOfWeeks.short.course" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='typeOfOccupation' header={<Translate content="dayOfWeeks.short.typeOfOccupation" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='lecturer' header={<Translate content="dayOfWeeks.short.lecturer" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='references' header={<Translate content="dayOfWeeks.short.references" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='dayOfWeek' header={<Translate content="dayOfWeeks.short.dayOfWeek" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='startHour' header={<Translate content="dayOfWeeks.short.startHour" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='endHour' header={<Translate content="dayOfWeeks.short.endHour" />} sortable={true} editor={this.scheduleEditor} />
                            <Column body={this.renderTableButtons} />
                        </DataTable>
                        <div className="marginBottom"></div>
                        <div className="col s12 center">
                            <a className="btn btn-large waves-effect waves-light green accent-3 marginRight"
                                onClick={this.handleSaveHallSchedule.bind(this)}>
                                <Translate content="buttons.save" />
                                <i className="material-icons right">save</i>
                            </a>

                            <ExportScheduleToExcelFile hallSchedules={this.state.hallSchedules} clearHallScheduleData={false} />
                            <ExportScheduleToExcelFile hallSchedules={this.state.hallSchedules} clearHallScheduleData={true} handleClearHallSchedule={this.handleClearHallSchedule.bind(this)} />

                            <Dialog header={<Translate content="hallDetails" />} visible={this.state.visibleSelectedSchedule} width="225px" modal={true} onHide={() => this.setState({ visibleSelectedSchedule: false })}>
                                {this.renderScheduleDialogContent()}
                            </Dialog>
                            <Dialog header={<Translate content="meeting.createNewVirtualMeeting" />} className="createNewVirtualMeeting" visible={this.state.visibleCreateMeeting} width="225px" modal={true} onHide={() => this.setState({ visibleCreateMeeting: false })}>
                                {this.renderCreateMeeting()}
                            </Dialog>
                            <Dialog header={<Translate content="meeting.removeVirtualMeeting" />} visible={this.state.visibleRemoveMeeting} width="225px" modal={true} onHide={() => this.setState({ visibleRemoveMeeting: false })}>
                                {this.renderRemoveMeeting()}
                            </Dialog>

                            <div className="marginBottom"></div>

                            <form onSubmit={this.handleFileUpload} id="addManyHallsForm" action="#">
                                <div className="row">
                                    <div className="col s12 l8 center">
                                        <div className="file-field">
                                            <div className="btn btn-large waves-effect waves-light teal lighten-1 right customHeight controllerWidth">
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
                                    <div className="col s12 l4 center">
                                        <button id="uploadFile" className="btn btn-large waves-effect waves-light teal lighten-1 controllerWidth disabled " type="submit" value="Submit"><Translate content="buttons.uploadFile" />
                                            <i className="material-icons right">file_upload</i>
                                        </button>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>

                <Translate content="toasts.scheduleUpdated" className="hide scheduleUpdated" />
            </div >
        );
    }
}

module.exports = AdminSchedulesCreate;
