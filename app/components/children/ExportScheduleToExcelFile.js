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
                hall.disciplineType = schedule.disciplineType;
                hall.disciplineName = schedule.disciplineName;
                hall.department = schedule.department;
                hall.course = schedule.course;
                hall.typeOfOccupation = schedule.typeOfOccupation;
                hall.lecturer = schedule.lecturer;
                hall.references = schedule.references;
                hall.dayOfWeek = schedule.dayOfWeek;
                hall.startHour = schedule.startHour;
                hall.endHour = schedule.endHour;
                hall.lecturerLink = schedule.lecturerLink;
                hall.referencesLink = schedule.referencesLink;

                return hall;
            });

            var option = {};
            option.fileName = 'График'
            let localizedSheetHeader = ['Зала', 'Тип на дисциплината', 'Наименование на дискциплината', 'Катедра', 'Курс', 'Тип занятие', 'Преподавател', 'Връзка', 'Ден от седмицата', 'Начален час', 'Краен час', 'Линк за преподавател', 'Линк за връзка']
            let lang = localStorage.getItem('lang');

            if (lang === 'en') {
                localizedSheetHeader = ['Hall', 'Discipline type', 'Discipline name', 'Department', 'Course', 'Type of occupation', 'Lecturer', 'References', 'Day of week', 'Start hour', 'End hour', 'Lecturer\'s link', 'References\'s link']
                option.fileName = 'Schedule'
            }

            option.datas = [
                {
                    sheetData: hallSchedule,
                    sheetName: 'sheet1',
                    sheetHeader: localizedSheetHeader
                }
            ];
        }

        var toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();

        if (this.props.clearHallScheduleData) {
            this.props.handleClearHallSchedule();
        }
    }

    render() {
        return (
            this.props.clearHallScheduleData ?
                <a className="btn btn-large waves-effect waves-light red accent-3 exportSchedule" onClick={this.handleExportHallSchedule} ><Translate content="buttons.downloadFileAndClear" /><i className="material-icons right">file_download</i></a> :
                <a className="btn btn-large waves-effect waves-light green accent-3 marginRight exportSchedule" onClick={this.handleExportHallSchedule} ><Translate content="buttons.downloadFile" /><i className="material-icons right">file_download</i></a>
        );
    }
}

module.exports = ExportScheduleToExcelFile;