import React, { Component } from 'react';
import helpers from '../utils/helpers';
import shared from '../utils/shared';
import Translate from 'react-translate-component';
import ExportScheduleToExcelFile from './ExportScheduleToExcelFile';

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
            meetingDate: null
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
    }

    componentDidMount() {
        this.getHallSchedules();
        this.getAllHalls();
    }

    getHallSchedules() {
        helpers.getHallSchedules().then(function (response) {
            if (response !== this.state.hallSchedules) {
                this.setState({ hallSchedules: response.data });
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

    handleSaveHallSchedule(event) {
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

    render() {
        return (
            <div className="row">
                <div className="col m12" >
                    <div className="section">
                        <Translate component="h5" content="scheduleEditor" />
                        <DataTable value={this.state.hallSchedules} paginator={true} rows={10} first={this.state.first} onPage={(e) => this.setState({ first: e.first })} sortMode="multiple" responsive={true}>
                            <Column field='name' header={<Translate content="hall.hall" />} sortable={true} />
                            <Column field='monday' header={<Translate content="dayOfWeeks.short.monday" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='tuesday' header={<Translate content="dayOfWeeks.short.tuesday" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='wednesday' header={<Translate content="dayOfWeeks.short.wednesday" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='thursday' header={<Translate content="dayOfWeeks.short.thursday" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='friday' header={<Translate content="dayOfWeeks.short.friday" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='saturday' header={<Translate content="dayOfWeeks.short.saturday" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='sunday' header={<Translate content="dayOfWeeks.short.sunday" />} sortable={true} editor={this.scheduleEditor} />
                            <Column body={this.renderTableButtons} />
                        </DataTable>
                        <div className="marginBottom"></div>
                        <div className="col s12 center">
                            <a className="btn btn-large waves-effect waves-light green accent-3 marginRight"
                                onClick={this.handleSaveHallSchedule.bind(this)}>
                                <Translate content="buttons.save" />
                                <i className="material-icons right">save</i>
                            </a>

                            <ExportScheduleToExcelFile hallSchedules={this.state.hallSchedules} />

                            <Dialog header={<Translate content="hallDetails" />} visible={this.state.visibleSelectedSchedule} width="225px" modal={true} onHide={() => this.setState({ visibleSelectedSchedule: false })}>
                                {this.renderScheduleDialogContent()}
                            </Dialog>
                            <Dialog header={<Translate content="meeting.createNewVirtualMeeting" />} className="createNewVirtualMeeting" visible={this.state.visibleCreateMeeting} width="225px" modal={true} onHide={() => this.setState({ visibleCreateMeeting: false })}>
                                {this.renderCreateMeeting()}
                            </Dialog>
                            <Dialog header={<Translate content="meeting.removeVirtualMeeting" />} visible={this.state.visibleRemoveMeeting} width="225px" modal={true} onHide={() => this.setState({ visibleRemoveMeeting: false })}>
                                {this.renderRemoveMeeting()}
                            </Dialog>

                        </div>
                    </div>
                </div>

                <Translate content="toasts.scheduleUpdated" className="hide scheduleUpdated" />
            </div >
        );
    }
}

module.exports = AdminSchedulesCreate;
