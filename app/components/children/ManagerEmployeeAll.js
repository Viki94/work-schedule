import React, { Component } from 'react';
import helpers from '../utils/helpers';
import Translate from 'react-translate-component';

class ManagerEmployeeAll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            email: '',
            phone: '',
            allEmployees: [],
            selectedEmployee: '',
            emp_id: ''
        }

        this.getEmployees = this.getEmployees.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleAddForm = this.handleAddForm.bind(this);
        this.handleUpdateForm = this.handleUpdateForm.bind(this);
        this.handleRemoveForm = this.handleRemoveForm.bind(this);
        this.clickEmployee = this.clickEmployee.bind(this);
        this.newEmployee = this.newEmployee.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.clearStates = this.clearStates.bind(this);
        this.activeButtons = this.activeButtons.bind(this);
        this.handleFileChosen = this.handleFileChosen.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
    }

    componentDidMount() {
        this.getEmployees();
    }

    getEmployees() {
        helpers.getAllEmployees().then(function (response) {
            if (response !== this.state.allEmployees) {
                this.setState({ allEmployees: response.data });
                this.activeButtons();
            }
        }.bind(this));
    }

    handleUserChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleAddForm(event) {
        event.preventDefault();
        helpers.addEmployee(this.state.firstName, this.state.lastName, this.state.address, this.state.city, this.state.email, this.state.phone).then(function (response) {
            this.state.emp_id = response.data._id;

            helpers.addEmpSchedule(this.state.emp_id, this.state.firstName, this.state.lastName).then(function (response) {
                this.clearStates();
            }.bind(this));

        }.bind(this));

        let employeeAdded = $('.employeeAdded').text();
        Materialize.toast(employeeAdded, 3000);
        this.clearForm();
        this.getEmployees();
    }

    handleUpdateForm(event) {
        event.preventDefault();
        helpers.updateEmployee(this.state.selectedEmployee, this.state.firstName, this.state.lastName, this.state.address, this.state.city, this.state.email, this.state.phone).then(function (response) {
        }.bind(this));

        helpers.updateEmpName(this.state.emp_id, this.state.firstName, this.state.lastName).then(function (response) {
            this.clearStates();
        }.bind(this));

        let employeeUpdated = $('.employeeUpdated').text();
        Materialize.toast(employeeUpdated, 3000);
        this.clearForm();
        this.getEmployees();
    }

    handleRemoveForm(event) {
        event.preventDefault();
        helpers.removeEmployee(this.state.selectedEmployee).then(function (response) {
        }.bind(this));
        helpers.removeEmpSchedule(this.state.emp_id).then(function (response) {
            this.clearStates();
        }.bind(this));

        let employeeRemoved = $('.employeeRemoved').text();
        Materialize.toast(employeeRemoved, 3000);
        this.clearForm();
        this.getEmployees();
    }

    clickEmployee(event) {
        this.setState({ selectedEmployee: event.target.id }, function () {
            for (var i = 0; i < this.state.allEmployees.length; i++) {
                if (this.state.allEmployees[i]._id == this.state.selectedEmployee) {
                    this.setState({
                        firstName: this.state.allEmployees[i].firstName,
                        lastName: this.state.allEmployees[i].lastName,
                        address: this.state.allEmployees[i].address,
                        city: this.state.allEmployees[i].city,
                        email: this.state.allEmployees[i].email,
                        phone: this.state.allEmployees[i].phone,
                        emp_id: this.state.selectedEmployee
                    });

                    this.activeButtons();
                }
            }
        });
    }

    newEmployee() {
        this.clearForm();
        this.clearStates();
        this.activeButtons();
    }

    clearForm() {
        var elements = document.getElementsByTagName("input");
        for (var i = 0; i < elements.length; i++) {
            if ((elements[i].type == "text") || (elements[i].type == "number") || (elements[i].type == "email")) {
                elements[i].value = "";
                elements[i].classList.remove("valid");
            }
        };

        this.getEmployees();
    }

    clearStates() {
        this.setState({ firstName: "", lastName: "", address: "", city: "", email: "", phone: "", selectedEmployee: "" });
    }

    activeButtons() {
        if (this.state.selectedEmployee == "") {
            document.getElementById("addEmployee").className = "btn btn-large waves-effect waves-light green accent-3";
            document.getElementById("updateEmployee").className += " disabled";
            document.getElementById("removeEmployee").className += " disabled";
        } else {
            document.getElementById("addEmployee").className += " disabled";
            document.getElementById("updateEmployee").className = "btn btn-large waves-effect waves-light blue accent-3";
            document.getElementById("removeEmployee").className = "btn btn-large waves-effect waves-light red accent-3";
        }
    }

    handleFileChosen(event) {
        document.getElementById("uploadFile").className = "btn btn-large waves-effect waves-light teal lighten-1";
    }

    handleFileUpload(event) {
        event.preventDefault();

        var file = event.target[0].files[0];
        var reader = new FileReader();

        reader.onload = function (event) {
            var resultText = event.target.result;
            var allDataFromFile = resultText.split(/\r?\n/);
            var allEmpoyees = [];

            allDataFromFile.forEach(item => {
                var dataForCurrentEmpoyee = item.split(/,/);
                var currentEmployee = {
                    firstName: dataForCurrentEmpoyee[0],
                    lastName: dataForCurrentEmpoyee[1],
                    address: dataForCurrentEmpoyee[2],
                    city: dataForCurrentEmpoyee[3],
                    email: dataForCurrentEmpoyee[4],
                    phone: dataForCurrentEmpoyee[5]
                }

                allEmpoyees.push(currentEmployee);
            });

            if (allEmpoyees.length) {
                for (let i = 0; i < allEmpoyees.length; i++) {
                    helpers.addEmployee(allEmpoyees[i].firstName, allEmpoyees[i].lastName, allEmpoyees[i].address, allEmpoyees[i].city, allEmpoyees[i].email, allEmpoyees[i].phone).then(function (response) {
                        this.state.emp_id = response.data._id;

                        helpers.addEmpSchedule(this.state.emp_id, allEmpoyees[i].firstName, allEmpoyees[i].lastName).then(function (response) {
                            this.clearStates();
                            $('#inputFile, .file-path').val('');
                            document.getElementById("uploadFile").className += " disabled";

                        }.bind(this));

                    }.bind(this));
                }

                let oneEmployeeAdded = $('.oneEmployeeAdded').text();
                let xEmployeesAddedWithCount = oneEmployeeAdded;
                if (allEmpoyees.length > 1) {
                    let xEmployeesAdded = $('.xEmployeesAdded').text();
                    xEmployeesAddedWithCount = xEmployeesAdded.replace('0', allEmpoyees.length);
                }

                Materialize.toast(xEmployeesAddedWithCount, 3000);
                this.getEmployees();
            }
        }.bind(this);

        reader.readAsText(file);
    }

    render() {
        return (
            <div className="row">
                <div className="col m3">
                    <table className="highlight" id="allEmployees">
                        <thead>
                            <tr>
                                <th data-field="name"><Translate content="employees.employee" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td id="newEmployee" onClick={this.newEmployee}>
                                    <strong><Translate content="employees.newEmployee" /><i className="material-icons right">add</i></strong>
                                </td>
                            </tr>
                            {this.state.allEmployees.map((ManagerEmployeeAll, i) => {
                                return (
                                    <tr key={i}>
                                        <td onClick={this.clickEmployee} id={this.state.allEmployees[i]._id}>
                                            {ManagerEmployeeAll.firstName} {ManagerEmployeeAll.lastName}
                                        </td>
                                    </tr>
                                );
                            }, this)}
                        </tbody>
                    </table>
                </div>
                <div className="col m9">
                    <div className="row">
                        <form className="col m12" onSubmit={this.handleAddForm}>
                            <div className="row">
                                <div className="input-field col m6 s12">
                                    <Translate
                                        component="input"
                                        type="text"
                                        name="firstName"
                                        className="validate"
                                        value={this.state.firstName}
                                        onChange={this.handleUserChange}
                                        required
                                        attributes={{ placeholder: 'employee.firstName' }} />
                                </div>
                                <div className="input-field col m6 s12">
                                    <Translate
                                        component="input"
                                        type="text"
                                        name="lastName"
                                        className="validate"
                                        value={this.state.lastName}
                                        onChange={this.handleUserChange}
                                        required
                                        attributes={{ placeholder: 'employee.lastName' }} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col m12 s12">
                                    <Translate
                                        component="input"
                                        type="text"
                                        name="address"
                                        className="validate"
                                        value={this.state.address}
                                        onChange={this.handleUserChange}
                                        required
                                        attributes={{ placeholder: 'employee.address' }} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col m12 s12">
                                    <Translate
                                        component="input"
                                        type="text"
                                        name="city"
                                        className="validate"
                                        value={this.state.city}
                                        onChange={this.handleUserChange}
                                        required
                                        attributes={{ placeholder: 'employee.city' }} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col m12 s12">
                                    <Translate
                                        component="input"
                                        type="text"
                                        name="email"
                                        className="validate"
                                        value={this.state.email}
                                        onChange={this.handleUserChange}
                                        required
                                        attributes={{ placeholder: 'employee.email' }} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col m12 s12">
                                    <Translate
                                        component="input"
                                        type="text"
                                        name="phone"
                                        className="validate"
                                        value={this.state.phone}
                                        onChange={this.handleUserChange}
                                        required
                                        attributes={{ placeholder: 'employee.phone' }} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s4">
                                    <button id="addEmployee" className="btn btn-large waves-effect waves-light green accent-3" type="submit" value="Submit"><Translate content="buttons.add" />
                                        <i className="material-icons right">person_add</i>
                                    </button>
                                </div>
                                <div className="col s4">
                                    <a id="updateEmployee" className="btn btn-large waves-effect waves-light blue accent-3" onClick={this.handleUpdateForm}><Translate content="buttons.update" />
                                        <i className="material-icons right">edit</i>
                                    </a>
                                </div>
                                <div className="col s4">
                                    <a id="removeEmployee" className="btn btn-large waves-effect waves-light red accent-3" onClick={this.handleRemoveForm}><Translate content="buttons.remove" />
                                        <i className="material-icons right">person_outline</i>
                                    </a>
                                </div>
                            </div>
                        </form>
                        <form onSubmit={this.handleFileUpload} id="addManyEmployeesForm" action="#">
                            <div className="row">
                                <div className="col s8">
                                    <div className="file-field">
                                        <div className="btn btn-large waves-effect waves-light teal lighten-1 right customHeight">
                                            <Translate content="buttons.chooseFile" />
                                            <input
                                                id="inputFile"
                                                type="file"
                                                name="input-file"
                                                accept={['.csv']}
                                                onChange={this.handleFileChosen} />
                                            <i className="material-icons right">attach_file</i>
                                        </div>
                                        <div className="file-path-wrapper">
                                            <input className="file-path validate" type="text" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col s4">
                                    <button id="uploadFile" className="btn btn-large waves-effect waves-light teal lighten-1 disabled" type="submit" value="Submit"><Translate content="buttons.uploadFile" />
                                        <i className="material-icons right">file_upload</i>
                                    </button>
                                </div>
                            </div>
                        </form>

                        <Translate content="toasts.employeeAdded" className="hide employeeAdded" />
                        <Translate content="toasts.employeeUpdated" className="hide employeeUpdated" />
                        <Translate content="toasts.employeeRemoved" className="hide employeeRemoved" />
                        <Translate content="toasts.oneEmployeeAdded" className="hide oneEmployeeAdded" />
                        <Translate content="toasts.xEmployeesAdded" className="hide xEmployeesAdded" />
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = ManagerEmployeeAll;