import React, { Component } from 'react';
import helpers from '../utils/helpers';
import Translate from 'react-translate-component';
import { MultiSelect } from 'primereact/multiselect';
import { ListBox } from 'primereact/listbox';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';

class AdminUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            userType: '',
            groups: [],
            allUsers: [],
            selectedUser: '',
            user_id: '',
            firstName: '',
            lastName: '',
            mobilePhone: '',
            email: '',
            faculty: '',
            facultyNumber: '',
            studyCourse: '',
            studyGroup: '',
            curriculum: '',
            isActiveStudent: true
        }

        this.getUsers = this.getUsers.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleUpdateForm = this.handleUpdateForm.bind(this);
        this.handleUserSelect = this.handleUserSelect.bind(this);
        this.setSelectedUserState = this.setSelectedUserState.bind(this);
        this.clearState = this.clearState.bind(this);
    }

    componentDidMount() {
        this.getUsers(true);
    }

    getUsers(shouldSelectFirstUser) {
        helpers.getAllUsers().then(function (response) {
            if (response !== this.state.allUsers) {
                this.setState({ allUsers: response.data }, function () {
                    if (shouldSelectFirstUser) {
                        let firstUserId = this.state.allUsers[0]._id;
                        this.setSelectedUserState(firstUserId);
                    }
                });
            }
        }.bind(this));
    }

    handleUserChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleUpdateForm(event) {
        event.preventDefault();

        helpers.updateUser(
            this.state.selectedUser,
            this.state.userType,
            this.state.groups,
            this.state.faculty,
            this.state.facultyNumber,
            this.state.studyCourse,
            this.state.studyGroup,
            this.state.curriculum,
            this.state.isActiveStudent
        )
            .then(function (response) {
            }.bind(this));

        let userUpdated = $('.userUpdated').text();
        Materialize.toast(userUpdated, 3000);

        this.getUsers(false);
    }

    handleUserSelect(event) {
        this.setSelectedUserState(event.target.value)
    }

    setSelectedUserState(userId) {
        if (!userId) {
            this.setState({ username: ''})
        }

        this.clearState();

        this.setState({ selectedUser: userId }, function () {
            for (var i = 0; i < this.state.allUsers.length; i++) {
                if (this.state.allUsers[i]._id == this.state.selectedUser) {
                    this.setState({
                        username: this.state.allUsers[i].username,
                        userType: this.state.allUsers[i].userType,
                        groups: this.state.allUsers[i].groups,
                        user_id: this.state.selectedUser,
                        firstName: this.state.allUsers[i].firstName,
                        lastName: this.state.allUsers[i].lastName,
                        mobilePhone: this.state.allUsers[i].mobilePhone,
                        email: this.state.allUsers[i].email,
                        faculty: this.state.allUsers[i].faculty,
                        facultyNumber: this.state.allUsers[i].facultyNumber,
                        studyCourse: this.state.allUsers[i].studyCourse,
                        studyGroup: this.state.allUsers[i].studyGroup,
                        curriculum: this.state.allUsers[i].curriculum,
                        isActiveStudent: this.state.allUsers[i].isActiveStudent
                    });
                }
            }
        });
    }

    clearState() {
        this.setState({
            groups: [],
            firstName: '',
            lastName: '',
            mobilePhone: '',
            email: '',
            faculty: '',
            facultyNumber: '',
            studyCourse: '',
            studyGroup: '',
            curriculum: '',
            isActiveStudent: true
        })
    }

    render() {
        let search = $('.search').text();
        let choose = $('.choose').text();
        let allGroups = [
            { label: ' Администратор', value: '1' },
            { label: ' Преподавател', value: '2' },
            { label: ' Студент', value: '3' },
            { label: ' Прекъснал студент', value: '4' },
            { label: ' Завършил студент', value: '5' },
            { label: ' Инспектор', value: '6' },
            { label: ' Декан', value: '7' },
            { label: ' Заместник-декан', value: '8' },
            { label: ' Факултативен съвет', value: '9' },
            { label: ' Неопределен', value: '10' }
        ];


        this.userTypes = [
            { name: 'Сътрудник', value: 'contributor' },
            { name: 'Администратор', value: 'admin' }
        ]

        let lang = localStorage.getItem('lang');

        if (lang === 'en') {
            allGroups = [
                { label: ' Administrator', value: '1' },
                { label: ' University lecturer', value: '2' },
                { label: ' Student', value: '3' },
                { label: ' Interrupted student', value: '4' },
                { label: ' Graduate student', value: '5' },
                { label: ' Inspector', value: '6' },
                { label: ' Dean', value: '7' },
                { label: ' Vice dean', value: '8' },
                { label: ' Faculty council', value: '9' },
                { label: ' Indefinite', value: '10' }
            ];

            this.userTypes = [
                { name: 'Contributor', value: 'contributor' },
                { name: 'Administrator', value: 'admin' }
            ]
        }

        let users = [];
        this.state.allUsers.map((user, i) => {
            let usersInfo = {};
            usersInfo.label = user.username;
            usersInfo.value = user._id;
            users.push(usersInfo)
        })

        return (
            <div className="row">
                <div className="col m3 s12 center">
                    <h6><Translate component="b" content="users.users" /></h6>
                    <ListBox value={this.state.selectedUser} filter={true} filterPlaceholder={search} options={users} onChange={(e) => this.handleUserSelect(e)} />
                </div>
                <div className={"col m9 s12 " + (!this.state.username ? "hide" : "")}>
                    <div className="row">
                        <form className="col s12">
                            <div className="row">
                                <div className="input-field col s12">
                                    <Translate component="h6" content='users.username' />
                                    <Translate
                                        component="input"
                                        type="text"
                                        name="username"
                                        className="validate"
                                        value={this.state.username}
                                        disabled
                                        attributes={{ placeholder: 'users.username' }} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s6">
                                    <Translate component="h6" content='users.firstName' />
                                    <Translate
                                        component="input"
                                        type="text"
                                        name="firstName"
                                        className="validate"
                                        value={this.state.firstName}
                                        disabled
                                        attributes={{ placeholder: 'users.firstName' }} />
                                </div>
                                <div className="input-field col s6">
                                    <Translate component="h6" content='users.lastName' />
                                    <Translate
                                        component="input"
                                        type="text"
                                        name="lastName"
                                        className="validate"
                                        value={this.state.lastName}
                                        disabled
                                        attributes={{ placeholder: 'users.lastName' }} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <Translate component="h6" content='users.mobilePhone' />
                                    <Translate
                                        component="input"
                                        type="text"
                                        name="mobilePhone"
                                        value={this.state.username}
                                        disabled
                                        attributes={{ placeholder: 'users.mobilePhone' }} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <Translate component="h6" content='users.email' />
                                    <Translate
                                        component="input"
                                        type="text"
                                        name="email"
                                        value={this.state.email}
                                        disabled
                                        attributes={{ placeholder: 'users.email' }} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <Translate component="h6" content='users.faculty' />
                                    <Translate
                                        component="input"
                                        type="text"
                                        name="faculty"
                                        className="validate"
                                        value={this.state.faculty}
                                        onChange={this.handleUserChange}
                                        attributes={{ placeholder: 'users.faculty' }} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <Translate component="h6" content='users.facultyNumber' />
                                    <Translate
                                        component="input"
                                        type="text"
                                        name="facultyNumber"
                                        className="validate"
                                        value={this.state.facultyNumber}
                                        onChange={this.handleUserChange}
                                        attributes={{ placeholder: 'users.facultyNumber' }} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <Translate component="h6" content='users.studyCourse' />
                                    <Translate
                                        component="input"
                                        type="text"
                                        name="studyCourse"
                                        className="validate"
                                        value={this.state.studyCourse}
                                        onChange={this.handleUserChange}
                                        attributes={{ placeholder: 'users.studyCourse' }} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <Translate component="h6" content='users.studyGroup' />
                                    <Translate
                                        component="input"
                                        type="text"
                                        name="studyGroup"
                                        className="validate"
                                        value={this.state.studyGroup}
                                        onChange={this.handleUserChange}
                                        attributes={{ placeholder: 'users.studyGroup' }} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <Translate component="h6" content='users.curriculum' />
                                    <Translate
                                        component="input"
                                        type="text"
                                        name="curriculum"
                                        className="validate"
                                        value={this.state.curriculum}
                                        onChange={this.handleUserChange}
                                        attributes={{ placeholder: 'users.curriculum' }} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <Translate component="h6" content='users.isActiveStudent' />
                                    <Checkbox checked={this.state.isActiveStudent} onChange={e => this.setState({ isActiveStudent: e.checked })} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <Dropdown className="fullWidth" value={this.state.userType} options={this.userTypes} onChange={(e) => this.setState({ userType: e.value })} placeholder="Select a City" optionLabel="name" />
                                </div>
                            </div>
                            <Translate component="h6" content='users.groups' />
                            <div className="row">
                                <div className="col s12 content-section implementation multiselect-demo">
                                    <MultiSelect className="col s12" value={this.state.groups} options={allGroups} onChange={(e) => this.setState({ groups: e.value })}
                                        filter={true} filterPlaceholder={search} placeholder={choose} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s12 center">
                                    <a id="updateUser" className="btn btn-large waves-effect waves-light blue accent-3" onClick={this.handleUpdateForm}><Translate content="buttons.update" />
                                        <i className="material-icons right">edit</i>
                                    </a>
                                </div>
                            </div>
                        </form>

                        <Translate content="toasts.userUpdated" className="hide userUpdated" />
                        <Translate content="search" className="hide search" />
                        <Translate content="choose" className="hide choose" />
                    </div>
                </div>
            </div >
        );
    }
}

module.exports = AdminUsers;