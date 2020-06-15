import React, { Component } from 'react';
import shared from '../utils/shared';
import Translate from 'react-translate-component';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }

        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
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
                    <div className="col m6 offset-m3 s12">
                        <div className="card-panel">
                            <div className="row grey lighten-5">
                                <div className="col s12 center">
                                    <h4 className="blue-text text-darken-1"><img id="logo" src="/assets/images/logo.png" /><span className="hide-on-med-and-down">Scheduler</span></h4>
                                </div>
                            </div>
                            <form action="/login" method="POST" onSubmit={this.handleLogin}>
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
                                        <button className="btn waves-effect waves-light btn-large blue accent-3 fullWidth" type="submit" value="Submit" name="action"><Translate content="buttons.login" /><i className="material-icons right">send</i></button>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col s12">
                                        <h6><Translate content="userLogin.orLoginWith" /></h6>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col s6">
                                        <a id="google" className="btn waves-effect waves-light btn-large fullWidth" href="/auth/google"><i className="fa fa-google"></i></a>
                                    </div>
                                    <div className="col s6">
                                        <a id="linkedin" className="btn waves-effect waves-light btn-large fullWidth" href="/auth/linkedin"><i className="fa fa-linkedin"></i></a>
                                    </div>
                                </div>
                                <div className="divider"></div>
                                <div className="row">
                                    <div className="col s12">
                                        <h6 id="noAccount"><Translate content="userLogin.donHaveAnAccount" /></h6>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col s12">
                                        <a className="btn waves-effect waves-light btn-large green accent-3 fullWidth" href="/register"><Translate content="buttons.register" /><i className="material-icons right">person_add</i></a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Login;