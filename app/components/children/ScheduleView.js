import React, { Component } from 'react';
import helpers from '../utils/helpers';
import Translate from 'react-translate-component';
import ExportScheduleToExcelFile from './ExportScheduleToExcelFile';

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
                        <table className="bordered highlight">
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
                                            <td className="fullName">
                                                {schedules.firstName} {schedules.lastName}
                                            </td>
                                            <td className="schedule">
                                                {schedules.monday}
                                            </td>
                                            <td>
                                                {schedules.tuesday}
                                            </td>
                                            <td>
                                                {schedules.wednesday}
                                            </td>
                                            <td>
                                                {schedules.thursday}
                                            </td>
                                            <td>
                                                {schedules.friday}
                                            </td>
                                            <td>
                                                {schedules.saturday}
                                            </td>
                                            <td>
                                                {schedules.sunday}
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

module.exports = ScheduleView;