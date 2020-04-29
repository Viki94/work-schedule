import React, { Component } from 'react';
import helpers from '../utils/helpers';
import Translate from 'react-translate-component';
import ExportScheduleToExcelFile from './ExportScheduleToExcelFile';

class ManagerSchedulesCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            monday: '',
            tuesday: '',
            wednesday: '',
            thursday: '',
            friday: '',
            saturday: '',
            sunday: '',
            selectedEmpId: '',
            selectedEmpSchedule: '',
            empSchedules: []
        }

        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleUpdateEmpSchedule = this.handleUpdateEmpSchedule.bind(this);
        this.handleClearEmpSchedule = this.handleClearEmpSchedule.bind(this);
        this.clearStates = this.clearStates.bind(this);
    }

    componentDidMount() {
        helpers.getEmpSchedules().then(function (response) {
            if (response !== this.state.empSchedules) {
                this.setState({ empSchedules: response.data });
            }
        }.bind(this));
    }

    handleUserChange(index, event) {
        let updatedEmpSchedules = this.state.empSchedules.map((empSchedule, j) => {
            if (index === j) {
                //index is the index of the currently selected employee
                empSchedule[event.target.name] = event.target.value;
                this.setState({ selectedEmpSchedule: empSchedule });
                this.setState({ selectedEmpId: empSchedule._id });
            }

            return empSchedule;
        });

        this.setState({ empSchedules: updatedEmpSchedules });
    }

    handleUpdateEmpSchedule(event) {
        var saveButtonBlue = document.getElementById(event);
        saveButtonBlue.innerHTML = "Add";
        saveButtonBlue.className = "btn btn-small waves-effect waves-light green accent-3";

        if (this.state.selectedEmpSchedule !== "") {
            helpers.updateEmpSchedule(this.state.selectedEmpSchedule).then(function (response) {
                var empName = this.state.selectedEmpSchedule.firstName + " " + this.state.selectedEmpSchedule.lastName + "'s ";
                Materialize.toast(empName + "schedule updated", 2000);
                this.clearStates();
            }.bind(this));
        }
    }

    handleClearEmpSchedule(i, event) {
        // i is the index of the currently selected employee
        event.preventDefault();

        let updatedEmpSchedules = this.state.empSchedules.map((empSchedule, j) => {
            if (i === j) {
                var saveButton = document.getElementById(i);
                saveButton.innerHTML = "save";
                saveButton.className = "btn btn-small waves-effect waves-light blue accent-3";

                empSchedule.monday = "";
                empSchedule.tuesday = "";
                empSchedule.wednesday = "";
                empSchedule.thursday = "";
                empSchedule.friday = "";
                empSchedule.saturday = "";
                empSchedule.sunday = "";
                this.state.selectedEmpSchedule = empSchedule;
            }
            return empSchedule;
        });
        this.setState({ empSchedules: updatedEmpSchedules });
    }

    clearStates() {
        this.setState({ firstName: "", lastName: "", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "", sunday: "", emp_id: "", selectedEmpSchedule: "", selectedEmpId: "" });
    }

    render() {
        return (

            <div className="row">
                <div className="col m12" >
                    <div className="section">
                        <Translate component="h5" content="scheduleEditor" />
                        <table className="highlight">
                            <thead>
                                <tr>
                                    <th data-field="name"><Translate content="name" /></th>
                                    <th data-field="name"><Translate content="dayOfWeeks.monday" /></th>
                                    <th data-field="name"><Translate content="dayOfWeeks.tuesday" /></th>
                                    <th data-field="name"><Translate content="dayOfWeeks.wednesday" /></th>
                                    <th data-field="name"><Translate content="dayOfWeeks.thursday" /></th>
                                    <th data-field="name"><Translate content="dayOfWeeks.friday" /></th>
                                    <th data-field="name"><Translate content="dayOfWeeks.saturday" /></th>
                                    <th data-field="name"><Translate content="dayOfWeeks.sunday" /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.empSchedules.map(function (schedules, i) {
                                    return (
                                        <tr key={i}>
                                            <td className="fullName" id={this.state.empSchedules[i]._id}>
                                                {schedules.firstName} {schedules.lastName}
                                            </td>
                                            <td className="">
                                                <div className="input-field schedule">
                                                    <input className="browser-default" name="monday" value={schedules.monday} onChange={this.handleUserChange.bind(this, i)} />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="input-field schedule">
                                                    <input className="browser-default" name="tuesday" value={schedules.tuesday} onChange={this.handleUserChange.bind(this, i)} />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="input-field schedule">
                                                    <input className="browser-default" name="wednesday" value={schedules.wednesday} onChange={this.handleUserChange.bind(this, i)} />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="input-field schedule">
                                                    <input className="browser-default" name="thursday" value={schedules.thursday} onChange={this.handleUserChange.bind(this, i)} />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="input-field schedule">
                                                    <input className="browser-default" name="friday" value={schedules.friday} onChange={this.handleUserChange.bind(this, i)} />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="input-field schedule">
                                                    <input className="browser-default" name="saturday" value={schedules.saturday} onChange={this.handleUserChange.bind(this, i)} />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="input-field schedule">
                                                    <input className="browser-default" name="sunday" value={schedules.sunday} onChange={this.handleUserChange.bind(this, i)} />
                                                </div>
                                            </td>
                                            <td>
                                                <button id={i} className="addSchedule" onClick={this.handleUpdateEmpSchedule.bind(this, i)} className="btn btn-small waves-effect waves-light green accent-3"><Translate content="buttons.add" /></button>
                                            </td>
                                            <td>
                                                <button id={i} className="clearSchedule" onClick={this.handleClearEmpSchedule.bind(this, i)} className="btn btn-small waves-effect waves-light green accent-3"><Translate content="buttons.clear" /></button>
                                            </td>

                                        </tr>
                                    );
                                }, this)}
                            </tbody>
                        </table>
                        <ExportScheduleToExcelFile empSchedules={this.state.empSchedules} />
                    </div>
                </div>
            </div>

        );
    }
}

module.exports = ManagerSchedulesCreate;
