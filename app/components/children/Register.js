import React, { Component } from 'react';
import shared from '../utils/shared';
import Translate from 'react-translate-component';
import * as config from '../../../public/assets/config';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email: '',
            userType: 'contributor',
            selectedUserType: '',
            passwordConfirmation: '',
            adminPassword: '',
            error: '',
            isAdminRegistrationEnabled: config.IS_ADMIN_REGISTRATION_ENABLED
        }

        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    componentDidMount() {
        $("#userType").on('change', function (event) {
            this.setState({ selectedUserType: event.target.value });
        }.bind(this))
    }

    handleUserChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleLogin() {
    }

    render() {
        return (
            <div className="container">
                <div className="row" id="loginForm">
                    <div className="col m6 offset-m3">
                        <div className="card-panel">
                            <div className="row grey lighten-5">
                                <div className="col s12 center">
                                    <Translate
                                        component="h4"
                                        className="blue-text text-darken-1"
                                        content="userLogin.register" />
                                    <h4> {this.state.error}</h4>
                                </div>
                            </div>
                            <form action="/register" method="POST" onSubmit={this.handleLogin}>
                                <ul id="langDropdown" className="dropdown-content">
                                    <li className="langContainer">
                                        <span className="circle-small" onClick={() => shared.onLangChange("bg")}>
                                            <img className="activeLang bg" src="/assets/images/bulgaria-flag-xs.png" alt="Flag Bulgaria" width="48" height="24" />
                                        </span>
                                    </li>
                                    <li className="langContainer">
                                        <span className="circle-small" onClick={() => shared.onLangChange("en")}>
                                            <img className="en" src="/assets/images/united-kingdom-flag-xs.png" alt="Flag United Kingdom" width="48" height="24" />
                                        </span>
                                    </li>
                                </ul>
                                <ul className="center">
                                    <li><a className="dropdown-button black-text width-100" href="#" data-activates="langDropdown" data-beloworigin="true" data-hover="true"><Translate content="navMenu.language" /></a></li>
                                </ul>
                                <div className="row">
                                    <div className="col s12">
                                        <Translate
                                            component="input"
                                            type="text"
                                            name="username"
                                            className="validate"
                                            value={this.state.username}
                                            onChange={this.handleUserChange}
                                            required
                                            attributes={{ placeholder: 'userLogin.username' }} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col s12">
                                        <Translate
                                            component="input"
                                            type="text"
                                            name="email"
                                            className="validate"
                                            value={this.state.email}
                                            onChange={this.handleUserChange}
                                            required
                                            attributes={{ placeholder: 'userLogin.email' }} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col s12">
                                        <Translate
                                            component="input"
                                            type="password"
                                            name="password"
                                            className="validate"
                                            value={this.state.password}
                                            onChange={this.handleUserChange}
                                            required
                                            attributes={{ placeholder: 'userLogin.password' }} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col s12">
                                        <Translate
                                            component="input"
                                            type="password"
                                            name="passwordConfirmation"
                                            className="validate"
                                            value={this.state.passwordConfirmation}
                                            onChange={this.handleUserChange}
                                            required
                                            attributes={{ placeholder: 'userLogin.confirmPassword' }} />
                                    </div>
                                </div>
                                {this.state.isAdminRegistrationEnabled ?
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <select id="userType" name="userType">
                                                <Translate
                                                    component="option"
                                                    content="userType.contributor"
                                                    value="contributor"
                                                    selected />
                                                <Translate
                                                    component="option"
                                                    content="userType.admin"
                                                    value="admin" />
                                            </select>
                                        </div>
                                    </div> : ""
                                }
                                {this.state.selectedUserType === "admin" ?
                                    <div className="row">
                                        <div className="col s12">
                                            <Translate
                                                component="input"
                                                type="text"
                                                name="adminPassword"
                                                className="validate"
                                                value={this.state.adminPassword}
                                                onChange={this.handleUserChange}
                                                attributes={{ placeholder: 'userLogin.adminPassword' }} />
                                        </div>
                                    </div> : ""
                                }
                                <div className="row">
                                    <div className="col s12">
                                        <button className="btn waves-effect waves-light btn-large blue accent-3 fullWidth" type="submit" value="Submit" name="action"><Translate content="buttons.register" /><i className="material-icons right">person_add</i></button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
};

module.exports = Register;
