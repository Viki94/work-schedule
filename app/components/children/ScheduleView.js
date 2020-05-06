import React, { Component } from 'react';
import helpers from '../utils/helpers';
import Translate from 'react-translate-component';
import ExportScheduleToExcelFile from './ExportScheduleToExcelFile';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

class ScheduleView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            empSchedules: []
        }
    }

    componentDidMount() {
        helpers.getEmpSchedules().then(function (response) {
            if (response !== this.state.empSchedules) {
                this.setState({ empSchedules: response.data });
            }
        }.bind(this));
    }

    render() {
        return (
            <div className="row">
                <div className="col s12">
                    <div className="section">
                        <Translate component="h5" content="weekOverview" />
                        <DataTable value={this.state.empSchedules} paginator={true} rows={3} first={this.state.first} onPage={(e) => this.setState({ first: e.first })} sortMode="multiple" responsive={true}>
                            <Column field='firstName' header={<Translate content="employee.firstName" />} sortable={true} />
                            <Column field='lastName' header={<Translate content="employee.lastName" />} sortable={true} />
                            <Column field='monday' header={<Translate content="dayOfWeeks.monday" />} sortable={true} />
                            <Column field='tuesday' header={<Translate content="dayOfWeeks.tuesday" />} sortable={true} />
                            <Column field='wednesday' header={<Translate content="dayOfWeeks.wednesday" />} sortable={true} />
                            <Column field='thursday' header={<Translate content="dayOfWeeks.thursday" />} sortable={true} />
                            <Column field='friday' header={<Translate content="dayOfWeeks.friday" />} sortable={true} />
                            <Column field='saturday' header={<Translate content="dayOfWeeks.saturday" />} sortable={true} />
                            <Column field='sunday' header={<Translate content="dayOfWeeks.sunday" />} sortable={true} />
                        </DataTable>

                        <ExportScheduleToExcelFile empSchedules={this.state.empSchedules} />
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = ScheduleView;