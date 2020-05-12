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
            hallSchedules: []
        }
    }

    componentDidMount() {
        helpers.getHallSchedules().then(function (response) {
            if (response !== this.state.hallSchedules) {
                this.setState({ hallSchedules: response.data });
            }
        }.bind(this));
    }

    render() {
        return (
            <div className="row">
                <div className="col s12">
                    <div className="section">
                        <Translate component="h5" content="weekOverview" />
                        <DataTable value={this.state.hallSchedules} paginator={true} rows={3} first={this.state.first} onPage={(e) => this.setState({ first: e.first })} sortMode="multiple" responsive={true}>
                            <Column field='name' header={<Translate content="hall.name" />} sortable={true} />
                            <Column field='monday' header={<Translate content="dayOfWeeks.monday" />} sortable={true} />
                            <Column field='tuesday' header={<Translate content="dayOfWeeks.tuesday" />} sortable={true} />
                            <Column field='wednesday' header={<Translate content="dayOfWeeks.wednesday" />} sortable={true} />
                            <Column field='thursday' header={<Translate content="dayOfWeeks.thursday" />} sortable={true} />
                            <Column field='friday' header={<Translate content="dayOfWeeks.friday" />} sortable={true} />
                            <Column field='saturday' header={<Translate content="dayOfWeeks.saturday" />} sortable={true} />
                            <Column field='sunday' header={<Translate content="dayOfWeeks.sunday" />} sortable={true} />
                        </DataTable>
                        <div className="marginBottom"></div>
                        <div className="center">
                            <ExportScheduleToExcelFile hallSchedules={this.state.hallSchedules} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = ScheduleView;