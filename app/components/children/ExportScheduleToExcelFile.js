var React = require("react");
var ExportJsonExcel = require('js-export-excel')
var Translate = require("react-translate-component");

var ExportScheduleToExcelFile = React.createClass({
    handleExportEmpSchedule: function () {
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
    },

    render: function () {
        return (
            <button className="exportSchedule" onClick={this.handleExportEmpSchedule} className="btn btn-small waves-effect waves-light green accent-3"><Translate content="buttons.downloadFile" /></button>
        );
    }
});

module.exports = ExportScheduleToExcelFile;