import React, { Component } from 'react';
import Translate from 'react-translate-component';
import ExportJsonExcel from 'js-export-excel';

class ExportScheduleToExcelFile extends Component {
    constructor(props) {
        super(props);

        this.handleExportHallSchedule = this.handleExportHallSchedule.bind(this);
    }

    handleExportHallSchedule() {
        if (this.props.hallSchedules !== "") {
            let hallSchedule = this.props.hallSchedules.map((schedule) => {
                var hall = {};
                hall.name = schedule.name;
                hall.monday = schedule.monday;
                hall.tuesday = schedule.tuesday;
                hall.wednesday = schedule.wednesday;
                hall.thursday = schedule.thursday;
                hall.friday = schedule.friday;
                hall.saturday = schedule.saturday;
                hall.sunday = schedule.sunday;

                return hall;
            });

            var option = {};
            option.fileName = 'excel'
            option.datas = [
                {
                    sheetData: hallSchedule,
                    sheetName: 'sheet1',
                    sheetHeader: ['Name', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                }
            ];
        }

        var toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
    }

    render() {
        return (
            <a className="btn btn-small waves-effect waves-light green accent-3 exportSchedule" onClick={this.handleExportHallSchedule} ><Translate content="buttons.downloadFile" /><i className="material-icons right">file_download</i></a>
        );
    }
}

module.exports = ExportScheduleToExcelFile;