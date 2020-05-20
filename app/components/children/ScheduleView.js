import React, { Component } from 'react';
import helpers from '../utils/helpers';
import shared from '../utils/shared';
import Translate from 'react-translate-component';
import ExportScheduleToExcelFile from './ExportScheduleToExcelFile';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';

class ScheduleView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hallSchedules: [],
            staticHallSchedules: [],
            displayBlockScroll: false,
            filteredValues: {
                monday: null,
                tuesday: null,
                wednesday: null,
                thursday: null,
                friday: null,
                saturday: null,
                sunday: null
            },
            allHalls: [],
            hallName: '',
            checkboxValue: null,
        }

        this.showFilterDialog = this.showFilterDialog.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.getHallSchedules = this.getHallSchedules.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleClearFilteresSchedule = this.handleClearFilteresSchedule.bind(this);
        this.renderCheckbox = this.renderCheckbox.bind(this);
        this.clearFilterState = this.clearFilterState.bind(this);
    }

    showFilterDialog(shouldShow) {
        this.setState({
            displayBlockScroll: shouldShow
        });
    }

    handleFilter() {
        let selectedUserConditions = shared.findSelectedUserConditions(this.state.filteredValues)
        if (this.state.hallName) {
            selectedUserConditions.name = this.state.hallName;
        }

        selectedUserConditions = JSON.stringify(selectedUserConditions);
        helpers.getAllHallSchedulesWithConditions(selectedUserConditions).then(function (response) {
            if (response.data !== this.state.hallSchedules) {
                this.setState({
                    hallSchedules: response.data,
                    displayBlockScroll: false
                });
            }
        }.bind(this));
    }

    renderFooter() {
        return (
            <div className="row">
                <div className="col s12 center">
                    <div className="col s6">
                        <a className="btn btn-large waves-effect waves-light green accent-3" onClick={() => this.handleFilter()} >{<Translate content="buttons.filter" />}
                            <i className="material-icons right">check</i></a>
                    </div>
                    <div className="col s6">
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

    componentDidMount() {
        this.getHallSchedules();
    }

    getHallSchedules() {
        helpers.getHallSchedules().then(function (response) {
            if (response !== this.state.hallSchedules) {
                this.setState({
                    hallSchedules: response.data,
                    staticHallSchedules: response.data
                });
            }
        }.bind(this));
    }

    clearFilterState(isDisplayedBlockScroll) {
        this.setState({
            displayBlockScroll: isDisplayedBlockScroll,
            hallName: '',
            filteredValues: {
                monday: null,
                tuesday: null,
                wednesday: null,
                thursday: null,
                friday: null,
                saturday: null,
                sunday: null
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

    render() {
        return (
            <div className="row">
                <div className="col s12">
                    <div className="section">
                        <Translate component="h5" content="weekOverview" />
                        <DataTable value={this.state.hallSchedules} paginator={true} rows={10} first={this.state.first} onPage={(e) => this.setState({ first: e.first })} sortMode="multiple" responsive={true}>
                            <Column field='name' header={<Translate content="hall.hall" />} sortable={true} />
                            <Column field='monday' header={<Translate content="dayOfWeeks.short.monday" />} sortable={true} />
                            <Column field='tuesday' header={<Translate content="dayOfWeeks.short.tuesday" />} sortable={true} />
                            <Column field='wednesday' header={<Translate content="dayOfWeeks.short.wednesday" />} sortable={true} />
                            <Column field='thursday' header={<Translate content="dayOfWeeks.short.thursday" />} sortable={true} />
                            <Column field='friday' header={<Translate content="dayOfWeeks.short.friday" />} sortable={true} />
                            <Column field='saturday' header={<Translate content="dayOfWeeks.short.saturday" />} sortable={true} />
                            <Column field='sunday' header={<Translate content="dayOfWeeks.short.sunday" />} sortable={true} />
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
                                        {this.renderCheckbox(this.state.filteredValues.monday, "monday")}
                                        {this.renderCheckbox(this.state.filteredValues.tuesday, "tuesday")}
                                        {this.renderCheckbox(this.state.filteredValues.wednesday, "wednesday")}
                                        {this.renderCheckbox(this.state.filteredValues.thursday, "thursday")}
                                        {this.renderCheckbox(this.state.filteredValues.friday, "friday")}
                                        {this.renderCheckbox(this.state.filteredValues.saturday, "saturday")}
                                        {this.renderCheckbox(this.state.filteredValues.sunday, "sunday")}
                                    </div>
                                </Dialog>

                            </div>
                            <div className="center">
                                <div className="row">
                                    <div className="col s12">
                                        <div className="col s6">
                                            <a id="showConditions" className="btn btn-large waves-effect waves-light blue accent-3" onClick={() => this.showFilterDialog(true)}><Translate content="buttons.filter" /><i className="material-icons right">open_in_new</i></a>
                                        </div>
                                        <div className="col s6">
                                            <a id="hideConditions" className={"btn btn-large waves-effect waves-light red accent-3 " + (JSON.stringify(this.state.hallSchedules) == JSON.stringify(this.state.staticHallSchedules) ? "disabled" : "")} onClick={this.handleClearFilteresSchedule}><Translate content="buttons.remove" />
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