import React, { Component } from 'react';
import helpers from '../utils/helpers';
import shared from '../utils/shared';
import Translate from 'react-translate-component';
import ExportScheduleToExcelFile from './ExportScheduleToExcelFile';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import * as config from '../../../public/assets/config';

class ScheduleView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allHalls: [],
            hallSchedules: [],
            staticHallSchedules: [],
            displayBlockScroll: false,
            filteredValues: {
                disciplineType: null,
                disciplineName: null,
                department: null,
                course: null,
                typeOfOccupation: null,
                lecturer: null,
                references: null,
                dayOfWeek: null,
                startHour: null,
                endHour: null
            },
            allHalls: [],
            hallName: '',
            checkboxValue: null,
            selectedSchedule: null,
            visibleSelectedSchedule: false,
            description: ''
        }

        this.showFilterDialog = this.showFilterDialog.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleClearFilteresSchedule = this.handleClearFilteresSchedule.bind(this);
        this.renderCheckbox = this.renderCheckbox.bind(this);
        this.clearFilterState = this.clearFilterState.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.renderScheduleDialogContent = this.renderScheduleDialogContent.bind(this);
    }

    componentDidMount() {
        this.getHallSchedules();
        this.getAllHalls();
    }

    showFilterDialog(shouldShow) {
        this.setState({
            displayBlockScroll: shouldShow
        });
    }

    handleFilter() {
        let selectedUserConditions = shared.findSelectedUserConditions(this.state.filteredValues)

        selectedUserConditions = JSON.stringify(selectedUserConditions);
        helpers.getAllHallSchedulesWithConditions(selectedUserConditions).then(function (response) {
            if (response.data !== this.state.hallSchedules) {
                let filteredValuesByDaysOfWeek = response.data;
                if (this.state.hallName) {
                    filteredValuesByDaysOfWeek = filteredValuesByDaysOfWeek.filter(hall => hall.name.toLowerCase()
                        .includes(this.state.hallName.toLowerCase())
                    )
                }

                this.setState({
                    hallSchedules: filteredValuesByDaysOfWeek,
                    displayBlockScroll: false
                });
            }
        }.bind(this));
    }

    renderScheduleDialogContent() {
        var foundHallIndex = this.state.allHalls.findIndex(x => x._id === this.state.selectedSchedule);
        if (this.state.selectedSchedule && foundHallIndex >= 0) {
            var foundScheduleIndex = this.state.hallSchedules.findIndex(x => x.hall_id === this.state.selectedSchedule);
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
                                {this.props.isAdmin ?
                                    <div>
                                        <div><Translate component="b" content="hall.meetingStartUrl" /></div>
                                        <div>
                                            <a href={this.state.hallSchedules[foundHallIndex].meetingStartUrl} target="_blank">
                                                {this.state.hallSchedules[foundHallIndex].meetingStartUrl}
                                            </a>
                                        </div>
                                    </div> : ""}
                                <div> <Translate component="b" content="hall.meetingJoinUrl" /></div>
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

    renderFooter() {
        return (
            <div className="row">
                <div className="col s12 center">
                    <div className="col s12 l6">
                        <a className="btn btn-large waves-effect waves-light green accent-3 " onClick={() => this.handleFilter()} >{<Translate content="buttons.filter" />}
                            <i className="material-icons right">check</i></a>
                    </div>
                    <div className="col s12 l6">
                        <a className="btn btn-large waves-effect waves-light red accent-3" onClick={() => this.clearFilterState(true)}>{<Translate content="buttons.clear" />}
                            <i className="material-icons right">clear</i>
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    renderCheckbox(filteredValue, dayOfWeek) {
        return (
            <div className="content-section implementation">
                <TriStateCheckbox id={dayOfWeek} value={filteredValue}
                    onChange={(e) =>
                        this.setState({
                            filteredValues: {
                                ...this.state.filteredValues,
                                [e.target.id]: e.value
                            }
                        })
                    }
                />
                <Translate content={"dayOfWeeks.long." + dayOfWeek} className="dayOfWeek" />
            </div>
        );
    }

    getHallSchedules() {
        helpers.getHallSchedules().then(function (response) {
            if (response !== this.state.hallSchedules) {
                this.setState({
                    hallSchedules: response.data,
                    staticHallSchedules: response.data,
                    description: response.data[0].description
                });
            }
        }.bind(this));
    }

    getAllHalls() {
        helpers.getAllHalls().then(function (response) {
            this.setState({
                allHalls: response.data,
            });
        }.bind(this));
    }

    clearFilterState(isDisplayedBlockScroll) {
        this.setState({
            displayBlockScroll: isDisplayedBlockScroll,
            hallName: '',
            filteredValues: {
                disciplineType: null,
                disciplineName: null,
                department: null,
                course: null,
                typeOfOccupation: null,
                lecturer: null,
                references: null,
                dayOfWeek: null,
                startHour: null,
                endHour: null
            },
        });
    }

    handleClearFilteresSchedule() {
        this.clearFilterState(false);
        this.getHallSchedules();
    }

    handleUserChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    actionTemplateLecturer(rowData, column) {
        let lecturer = rowData.lecturer.replace(/\s+/g, '+');
        let link = 'https://www.google.com/search?q=' + lecturer;

        return <div className="center">
            <a href={link} target="_blank">{rowData.lecturer}</a>
        </div>
    }

    actionTemplateReferences(rowData, column) {
        return <div className="center">
            <a href="https://www.fmi.uni-sofia.bg/bg/node/8776" target="_blank">{rowData.references}</a>
        </div>
    }

    actionTemplate(rowData, column) {
        return <div className="center">
            <Button type="button" icon="pi pi-search" className="p-button-warning" onClick={(e) => this.setState({ selectedSchedule: rowData.hall_id, visibleSelectedSchedule: true })}></Button>
        </div>
    }

    render() {
        return (
            <div className="row">
                <div className="col s12">
                    <div className="section">
                        <Translate component="h5" content="weekOverview" />
                        <div id="descriptionText" className="col s4">{this.state.description}</div>
                        <div className="marginBottom"></div>
                        <DataTable value={this.state.hallSchedules} paginator={true} rows={config.VIEW_SCHEDULE_ROW_COUNT} first={this.state.first} onPage={(e) => this.setState({ first: e.first })} sortMode="multiple" responsive={true}>
                            <Column field='name' header={<Translate content="hall.hall" />} sortable={true} />
                            <Column field='disciplineType' header={<Translate content="dayOfWeeks.short.disciplineType" />} sortable={true} />
                            <Column field='disciplineName' header={<Translate content="dayOfWeeks.short.disciplineName" />} sortable={true} />
                            <Column field='department' header={<Translate content="dayOfWeeks.short.department" />} sortable={true} />
                            <Column field='course' header={<Translate content="dayOfWeeks.short.course" />} sortable={true} />
                            <Column field='typeOfOccupation' header={<Translate content="dayOfWeeks.short.typeOfOccupation" />} sortable={true} />
                            <Column header={<Translate content="dayOfWeeks.short.lecturer" />} sortable={true} body={this.actionTemplateLecturer} />
                            <Column header={<Translate content="dayOfWeeks.short.references" />} sortable={true} body={this.actionTemplateReferences} />
                            <Column field='dayOfWeek' header={<Translate content="dayOfWeeks.short.dayOfWeek" />} sortable={true} />
                            <Column field='startHour' header={<Translate content="dayOfWeeks.short.startHour" />} sortable={true} />
                            <Column field='endHour' header={<Translate content="dayOfWeeks.short.endHour" />} sortable={true} />
                            <Column body={this.actionTemplate} />
                        </DataTable>
                        <div className="marginBottom"></div>
                        <div className="col s12">
                            <div className="content-section implementation dialog-demo">
                                <Dialog header={<Translate content="filter" />} visible={this.state.displayBlockScroll} style={{ width: '40vw' }} onHide={() => this.showFilterDialog(false)} blockScroll
                                    footer={this.renderFooter()}>
                                    <div className="row">
                                        <div className="input-field col m12 s12">
                                            <Translate component="h6" content='hall.hall' />
                                            <Translate
                                                component="input"
                                                type="text"
                                                name="hallName"
                                                value={this.state.hallName}
                                                onChange={this.handleUserChange}
                                                attributes={{ placeholder: 'hall.hall' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <Translate component="h6" content='chooseDay' />
                                        {this.renderCheckbox(this.state.filteredValues.disciplineType, "disciplineType")}
                                        {this.renderCheckbox(this.state.filteredValues.disciplineName, "disciplineName")}
                                        {this.renderCheckbox(this.state.filteredValues.department, "department")}
                                        {this.renderCheckbox(this.state.filteredValues.course, "course")}
                                        {this.renderCheckbox(this.state.filteredValues.typeOfOccupation, "typeOfOccupation")}
                                        {this.renderCheckbox(this.state.filteredValues.lecturer, "lecturer")}
                                        {this.renderCheckbox(this.state.filteredValues.references, "references")}
                                        {this.renderCheckbox(this.state.filteredValues.dayOfWeek, "dayOfWeek")}
                                        {this.renderCheckbox(this.state.filteredValues.startHour, "startHour")}
                                        {this.renderCheckbox(this.state.filteredValues.endHour, "endHour")}
                                    </div>
                                </Dialog>
                                <Dialog header={<Translate content="hallDetails" />} visible={this.state.visibleSelectedSchedule} width="225px" modal={true} onHide={() => this.setState({ visibleSelectedSchedule: false })}>
                                    {this.renderScheduleDialogContent()}
                                </Dialog>
                            </div>
                            <div className="center">
                                <div className="row">
                                    <div className="col s12">
                                        <div className="col s12 m6">
                                            <a id="showConditions" className="btn btn-large waves-effect waves-light blue accent-3 controllerWidth" onClick={() => this.showFilterDialog(true)}><Translate content="buttons.filter" /><i className="material-icons right">open_in_new</i></a>
                                        </div>
                                        <div className="col s12 m6">
                                            <a id="hideConditions" className={"btn btn-large waves-effect waves-light red accent-3 controllerWidth " + (JSON.stringify(this.state.hallSchedules) == JSON.stringify(this.state.staticHallSchedules) ? "disabled" : "")} onClick={this.handleClearFilteresSchedule}><Translate content="buttons.remove" />
                                                <i className="material-icons right">remove</i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <ExportScheduleToExcelFile className="center" hallSchedules={this.state.hallSchedules} />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

module.exports = ScheduleView;