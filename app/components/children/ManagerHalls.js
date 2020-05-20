import React, { Component } from 'react';
import helpers from '../utils/helpers';
import Translate from 'react-translate-component';

class ManagerHalls extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            city: '',
            sittingPlaces: '',
            allHalls: [],
            selectedHall: '',
            hall_id: ''
        }

        this.getHalls = this.getHalls.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleAddForm = this.handleAddForm.bind(this);
        this.handleUpdateForm = this.handleUpdateForm.bind(this);
        this.handleRemoveForm = this.handleRemoveForm.bind(this);
        this.handleHallSelect = this.handleHallSelect.bind(this);
        this.newHall = this.newHall.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.clearStates = this.clearStates.bind(this);
        this.activeButtons = this.activeButtons.bind(this);
        this.handleFileChosen = this.handleFileChosen.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
    }

    componentDidMount() {
        this.getHalls();
    }

    getHalls() {
        helpers.getAllHalls().then(function (response) {
            if (response !== this.state.allHalls) {
                this.setState({ allHalls: response.data });
                this.activeButtons();
            }
        }.bind(this));
    }

    handleUserChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleAddForm(event) {
        event.preventDefault();
        helpers.addHall(this.state.name, this.state.address, this.state.city, this.state.sittingPlaces).then(function (response) {
            this.state.hall_id = response.data._id;

            helpers.addHallSchedule(this.state.hall_id, this.state.name).then(function (response) {
                this.clearStates();
            }.bind(this));

        }.bind(this));

        let hallAdded = $('.hallAdded').text();
        Materialize.toast(hallAdded, 3000);
        this.clearForm();
        this.getHalls();
    }

    handleUpdateForm(event) {
        event.preventDefault();

        helpers.updateHall(this.state.selectedHall, this.state.name, this.state.address, this.state.city, this.state.sittingPlaces).then(function (response) {
        }.bind(this));

        helpers.updateHallName(this.state.hall_id, this.state.name).then(function (response) {
            this.clearStates();
        }.bind(this));

        let hallUpdated = $('.hallUpdated').text();
        Materialize.toast(hallUpdated, 3000);
        this.clearForm();
        this.getHalls();
    }

    handleRemoveForm(event) {
        event.preventDefault();
        helpers.removeHall(this.state.selectedHall).then(function (response) {
        }.bind(this));
        helpers.removeHallSchedule(this.state.hall_id).then(function (response) {
            this.clearStates();
        }.bind(this));

        let hallRemoved = $('.hallRemoved').text();
        Materialize.toast(hallRemoved, 3000);
        this.clearForm();
        this.getHalls();
    }

    handleHallSelect(event) {
        this.setState({ selectedHall: event.target.id }, function () {
            for (var i = 0; i < this.state.allHalls.length; i++) {
                if (this.state.allHalls[i]._id == this.state.selectedHall) {
                    $('#allHalls').find('td').removeClass('active');
                    $('#' + this.state.selectedHall).addClass('active');

                    this.setState({
                        name: this.state.allHalls[i].name,
                        address: this.state.allHalls[i].address,
                        city: this.state.allHalls[i].city,
                        sittingPlaces: this.state.allHalls[i].sittingPlaces,
                        hall_id: this.state.selectedHall
                    });

                    this.activeButtons();
                }
            }
        });
    }

    newHall() {
        this.clearForm();
        this.clearStates();
        this.activeButtons();
    }

    clearForm() {
        var elements = document.getElementsByTagName("input");
        for (var i = 0; i < elements.length; i++) {
            if ((elements[i].type == "text") || (elements[i].type == "number")) {
                elements[i].value = "";
                elements[i].classList.remove("valid");
            }
        };

        this.getHalls();
    }

    clearStates() {
        this.setState({ name: "", address: "", city: "", sittingPlaces: "", selectedHall: "" });
    }

    activeButtons() {
        if (this.state.selectedHall == "") {
            document.getElementById("addHall").className = "btn btn-large waves-effect waves-light green accent-3";
            document.getElementById("updateHall").className += " disabled";
            document.getElementById("removeHall").className += " disabled";
        } else {
            document.getElementById("addHall").className += " disabled";
            document.getElementById("updateHall").className = "btn btn-large waves-effect waves-light blue accent-3";
            document.getElementById("removeHall").className = "btn btn-large waves-effect waves-light red accent-3";
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
            let resultText = event.target.result;
            let allDataFromFile = resultText.split(/\r?\n/);
            let allHalls = [];
            let counterWithIgnoredHalls = 0

            allDataFromFile.forEach(item => {
                let dataForCurrentHall = item.split(/,/);
                let currentHall = {
                    name: dataForCurrentHall[0],
                    address: dataForCurrentHall[1],
                    city: dataForCurrentHall[2],
                    sittingPlaces: dataForCurrentHall[3]
                }

                let foundHallIndex = this.state.allHalls.findIndex(x => x.name === currentHall.name);
                if (foundHallIndex === -1) {
                    allHalls.push(currentHall);
                }
                else {
                    counterWithIgnoredHalls++;
                }
            });

            if (allHalls.length) {
                for (let i = 0; i < allHalls.length; i++) {
                    helpers.addHall(allHalls[i].name, allHalls[i].address, allHalls[i].city, allHalls[i].sittingPlaces).then(function (response) {
                        this.state.hall_id = response.data._id;

                        helpers.addHallSchedule(this.state.hall_id, allHalls[i].name).then(function (response) {
                            this.clearStates();
                            $('#inputFile, .file-path').val('');
                            document.getElementById("uploadFile").className += " disabled";

                        }.bind(this));

                    }.bind(this));
                }

                let oneHallAdded = $('.oneHallAdded').text();
                let xHallsAddedWithCount = oneHallAdded;
                if (allHalls.length > 1) {
                    let xHallsAdded = $('.xHallsAdded').text();
                    xHallsAddedWithCount = xHallsAdded.replace('0', allHalls.length);
                }

                let xHallsNotAddedWithCount = '';

                if (counterWithIgnoredHalls > 0) {
                    xHallsNotAddedWithCount = this.getToastForNotAddedHalls(counterWithIgnoredHalls);
                    xHallsAddedWithCount += ' & ' + xHallsNotAddedWithCount;
                }

                Materialize.toast(xHallsAddedWithCount, 3000);
                this.getHalls();
            }
            else if (counterWithIgnoredHalls > 0) {
                let xHallsNotAddedWithCount = this.getToastForNotAddedHalls(counterWithIgnoredHalls);
                Materialize.toast(xHallsNotAddedWithCount, 3000);
            }
        }.bind(this);

        reader.readAsText(file);
    }

    getToastForNotAddedHalls(counterWithIgnoredHalls) {
        let oneHallNotAdded = $('.oneHallNotAdded').text();
        let xHallsNotAddedWithCount = oneHallNotAdded;
        if (counterWithIgnoredHalls > 1) {
            let xHallsNotAdded = $('.xHallsNotAdded').text();
            xHallsNotAddedWithCount = xHallsNotAdded.replace('0', counterWithIgnoredHalls);
        }

        return xHallsNotAddedWithCount;
    }

    render() {
        return (
            <div className="row">
                <div className="col m3">
                    <table className="highlight" id="allHalls">
                        <thead>
                            <tr>
                                <th data-field="name"><Translate content="halls.halls" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td id="newHall" onClick={this.newHall}>
                                    <strong><Translate content="halls.newHall" /><i className="material-icons right">add</i></strong>
                                </td>
                            </tr>
                            {this.state.allHalls.map((hall, i) => {
                                return (
                                    <tr key={i}>
                                        <td onClick={this.handleHallSelect} id={this.state.allHalls[i]._id}>
                                            {hall.name}
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
                                <div className="input-field col m12 s12">
                                    <Translate component="h6" content='hall.hall' />
                                    <Translate
                                        component="input"
                                        type="text"
                                        name="name"
                                        className="validate"
                                        value={this.state.name}
                                        onChange={this.handleUserChange}
                                        required
                                        attributes={{ placeholder: 'hall.hall' }} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col m12 s12">
                                    <Translate component="h6" content='hall.address' />
                                    <Translate
                                        component="input"
                                        type="text"
                                        name="address"
                                        className="validate"
                                        value={this.state.address}
                                        onChange={this.handleUserChange}
                                        required
                                        attributes={{ placeholder: 'hall.address' }} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col m12 s12">
                                    <Translate component="h6" content='hall.city' />
                                    <Translate
                                        component="input"
                                        type="text"
                                        name="city"
                                        className="validate"
                                        value={this.state.city}
                                        onChange={this.handleUserChange}
                                        required
                                        attributes={{ placeholder: 'hall.city' }} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col m12 s12">
                                    <Translate component="h6" content='hall.sittingPlaces' />
                                    <Translate
                                        component="input"
                                        type="text"
                                        name="sittingPlaces"
                                        className="validate"
                                        value={this.state.sittingPlaces}
                                        onChange={this.handleUserChange}
                                        required
                                        attributes={{ placeholder: 'hall.sittingPlaces' }} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s4">
                                    <button id="addHall" className="btn btn-large waves-effect waves-light green accent-3" type="submit" value="Submit"><Translate content="buttons.add" />
                                        <i className="material-icons right">add</i>
                                    </button>
                                </div>
                                <div className="col s4">
                                    <a id="updateHall" className="btn btn-large waves-effect waves-light blue accent-3" onClick={this.handleUpdateForm}><Translate content="buttons.update" />
                                        <i className="material-icons right">edit</i>
                                    </a>
                                </div>
                                <div className="col s4">
                                    <a id="removeHall" className="btn btn-large waves-effect waves-light red accent-3" onClick={this.handleRemoveForm}><Translate content="buttons.remove" />
                                        <i className="material-icons right">remove</i>
                                    </a>
                                </div>
                            </div>
                        </form>
                        <form onSubmit={this.handleFileUpload} id="addManyHallsForm" action="#">
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

                        <Translate content="toasts.hallAdded" className="hide hallAdded" />
                        <Translate content="toasts.hallUpdated" className="hide hallUpdated" />
                        <Translate content="toasts.hallRemoved" className="hide hallRemoved" />
                        <Translate content="toasts.oneHallAdded" className="hide oneHallAdded" />
                        <Translate content="toasts.xHallsAdded" className="hide xHallsAdded" />
                        <Translate content="toasts.oneHallNotAdded" className="hide oneHallNotAdded" />
                        <Translate content="toasts.xHallsNotAdded" className="hide xHallsNotAdded" />
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = ManagerHalls;