import React, { Component } from 'react';
import Translate from 'react-translate-component';
import ExportJsonExcel from 'js-export-excel';

class ExportScheduleToExcelFile extends Component {
    constructor(props) {
        super(props);

        this.handleExportEmpSchedule = this.handleExportEmpSchedule.bind(this);
    }

    handleExportEmpSchedule() {
        if (this.props.empSchedules !== "") {
            let employeeSchedule = this.props.empSchedules.map((empSchedule) => {
                var employee = {};
                employee.name = empSchedule.firstName.concat(' ').concat(empSchedule.lastName);
                employee.monday = empSchedule.monday;
                employee.tuesday = empSchedule.tuesday;
                employee.wednesday = empSchedule.wednesday;
                employee.thursday = empSchedule.thursday;
                employee.friday = empSchedule.friday;
                employee.saturday = empSchedule.saturday;
                employee.sunday = empSchedule.sunday;

                return employee;
            });

            var option = {};
            option.fileName = 'excel'
            option.datas = [
                {
                    sheetData: employeeSchedule,
                    sheetName: 'sheet1',
                    sheetHeader: ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                }
            ];
        }

        var toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
    }

    render() {
        return (
            <button className="exportSchedule" onClick={this.handleExportEmpSchedule} className="btn btn-small waves-effect waves-light green accent-3"><Translate content="buttons.downloadFile" /><i className="material-icons right">file_download</i></button>
        );
    }
}

module.exports = ExportScheduleToExcelFile;