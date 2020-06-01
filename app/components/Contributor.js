import React, { Component } from 'react';
import helpers from './utils/helpers';
import shared from './utils/shared';
import Translate from 'react-translate-component';

class Contributor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            picture: ''
        }
    }

    componentDidMount() {
        helpers.getCurrentUser().then(function (response) {
            if (response !== this.state.username) {
                this.setState({ picture: response.data.picture, username: response.data.username });
            }
        }.bind(this));
    }

    render() {
        return (
            <div>
                <ul id="dropdown1" className="dropdown-content">
                    <li><a className="black-text" href="/contributor/userProfile"><Translate content="navMenu.updateProfile" /><i className="material-icons right">person</i></a></li>
                    <li><a className="black-text" href="/logout"><Translate content="navMenu.logout" /><i className="material-icons right">exit_to_app</i></a></li>
                </ul>
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
                <nav>
                    <div className="nav-wrapper grey lighten-5">
                        <a href="/contributor" className="brand-logo blue-text text-darken-1"><img id="logo" src="/assets/images/logo.png" /><span className="hide-on-med-and-down">Schedulr</span></a>
                        <a href="/" data-activates="slide-out" className="button-collapse blue-text text-darken-1"><i className="material-icons">menu</i></a>
                        <ul className="right hide-on-med-and-down">
                            <li><a className="black-text" href="/contributor/scheduleRequestChange"><i className="material-icons right">sms</i><Translate content="navMenu.request" /></a></li>
                            <li><a className="dropdown-button black-text width-140" href="#" data-activates="langDropdown" data-beloworigin="true" data-hover="true"><i className="material-icons right">language</i><Translate content="navMenu.language" /></a></li>
                            <li><a className="dropdown-button black-text min-width-130" href="#" data-activates="dropdown1" data-beloworigin="true" data-hover="true">{this.state.username}<img className="circle circle-small" src={this.state.picture} /></a></li>
                        </ul>
                        <ul id="slide-out" className="side-nav collapsible">
                            <li>
                                <div className="userView">
                                    <div className="background">
                                        <img src="http://materializecss.com/images/office.jpg" />
                                    </div>
                                    <a><img className="circle" src={this.state.picture} /></a>
                                    <a><span className="white-text name">{this.state.username}</span></a>
                                </div>
                            </li>
                            <li><a href="/contributor/scheduleRequestChange" className="black-text"><i className="material-icons">sms</i><Translate content="navMenu.request" /></a></li>
                            <li>
                                <a href="#" className="collapsible-header black-text">
                                    <i className="material-icons">language</i><Translate content="navMenu.language" />
                                </a>

                                <div className="collapsible-body langContainer">
                                    <div className="circle-small mobile-flags" onClick={() => shared.onLangChange("bg")}>
                                        <img className="activeLang bg" src="/assets/images/bulgaria-flag-xs.png" alt="Flag Bulgaria" width="48" height="24" />
                                    </div>
                                    <div className="circle-small mobile-flags" onClick={() => shared.onLangChange("en")}>
                                        <img className="en" src="/assets/images/united-kingdom-flag-xs.png" alt="Flag United Kingdom" width="48" height="24" />
                                    </div>
                                </div>
                            </li>
                            <li><a href="/contributor/userProfile" className="black-text"><i className="material-icons">person</i><Translate content="navMenu.updateProfile" /></a></li>
                            <li><a href="/logout" className="black-text"><i className="material-icons">exit_to_app</i><Translate content="navMenu.logout" /></a></li>
                        </ul>
                    </div>
                </nav>
                <div className="container">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

module.exports = Contributor;