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
            hallSchedules: []
        }

        this.scheduleEditor = this.scheduleEditor.bind(this);
        this.onEditorValueChange = this.onEditorValueChange.bind(this);
    }

    componentDidMount() {
        helpers.getHallSchedules().then(function (response) {
            if (response !== this.state.hallSchedules) {
                this.setState({ hallSchedules: response.data });
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

    render() {
        return (

            <div className="row">
                <div className="col m12" >
                    <div className="section">
                        <Translate component="h5" content="scheduleEditor" />
                        <DataTable value={this.state.hallSchedules} paginator={true} rows={3} first={this.state.first} onPage={(e) => this.setState({ first: e.first })} sortMode="multiple" responsive={true}>
                            <Column field='name' header={<Translate content="hall.hall" />} sortable={true} />
                            <Column field='monday' header={<Translate content="dayOfWeeks.short.monday" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='tuesday' header={<Translate content="dayOfWeeks.short.tuesday" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='wednesday' header={<Translate content="dayOfWeeks.short.wednesday" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='thursday' header={<Translate content="dayOfWeeks.short.thursday" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='friday' header={<Translate content="dayOfWeeks.short.friday" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='saturday' header={<Translate content="dayOfWeeks.short.saturday" />} sortable={true} editor={this.scheduleEditor} />
                            <Column field='sunday' header={<Translate content="dayOfWeeks.short.sunday" />} sortable={true} editor={this.scheduleEditor} />
                        </DataTable>
                        <div className="marginBottom"></div>
                        <div className="col s12 center">
                            <a className="btn btn-large waves-effect waves-light green accent-3 marginRight"
                                onClick={this.handleSaveHallSchedule.bind(this)}>
                                <Translate content="buttons.save" />
                                <i className="material-icons right">save</i>
                            </a>

                            <ExportScheduleToExcelFile hallSchedules={this.state.hallSchedules} />
                        </div>
                    </div>
                </div>

                <Translate content="toasts.scheduleUpdated" className="hide scheduleUpdated" />
            </div>
        );
    }
}

module.exports = ManagerSchedulesCreate;
