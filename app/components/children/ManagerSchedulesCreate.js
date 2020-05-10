import React, { Component } from 'react';
import helpers from '../utils/helpers';
import Translate from 'react-translate-component';
import ExportScheduleToExcelFile from './ExportScheduleToExcelFile';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';

class ManagerSchedulesCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            empSchedules: []
        }

        this.scheduleEditor = this.scheduleEditor.bind(this);
        this.onEditorValueChange = this.onEditorValueChange.bind(this);
    }

    componentDidMount() {
        helpers.getEmpSchedules().then(function (response) {
            if (response !== this.state.empSchedules) {
                this.setState({ empSchedules: response.data });
            }
        }.bind(this));
    }

    handleSaveEmpSchedule(event) {
        this.state.empSchedules.map((empSchedule) => {
            helpers.updateEmpSchedule(empSchedule).then(function (response) {
            }.bind(this));
        })

        Materialize.toast("The schedule was updated", 3000);
    }

    onEditorValueChange(props, value) {
        let updatedSchedules = [...this.state.empSchedules];
        updatedSchedules[props.rowIndex][props.field] = value;
        this.setState({ empSchedules: updatedSchedules });
    }

    scheduleEditor(props) {
        return <InputText type="text" value={this.state.empSchedules[props.rowIndex][props.field]} onChange={(e) => this.onEditorValueChange(props, e.target.value)} />;
    }

    render() {
        return (

            <div className="row">
                <div className="col m12" >
                    <div className="section">
                        <Translate component="h5" content="scheduleEditor" />
                        <DataTable value={this.state.empSchedules} paginator={true} rows={3} first={this.state.first} onPage={(e) => this.setState({ first: e.first })} sortMode="multiple" responsive={true}>
                            <Column field='firstName' header={<Translate content="employee.firstName" />} sortable={true} />
                            <Column field='lastName' header={<Translate content="employee.lastName" />} sortable={true} />
                            <Column field='monday' header={<Translate content="dayOfWeeks.monday" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='tuesday' header={<Translate content="dayOfWeeks.tuesday" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='wednesday' header={<Translate content="dayOfWeeks.wednesday" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='thursday' header={<Translate content="dayOfWeeks.thursday" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='friday' header={<Translate content="dayOfWeeks.friday" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='saturday' header={<Translate content="dayOfWeeks.saturday" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='sunday' header={<Translate content="dayOfWeeks.sunday" />} sortable={true} editor={this.scheduleEditor} />
                        </DataTable>
                        <div className="marginBottom"></div>
                        <div className="col s12 center">
                            <a className="btn btn-small waves-effect waves-light green accent-3 marginRight"
                                onClick={this.handleSaveEmpSchedule.bind(this)}>
                                <Translate content="buttons.save" />
                                <i className="material-icons right">save</i>
                            </a>

                            <ExportScheduleToExcelFile empSchedules={this.state.empSchedules} />
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

module.exports = ManagerSchedulesCreate;
