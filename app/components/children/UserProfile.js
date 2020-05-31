import React, { Component } from 'react';
import helpers from '../utils/helpers';
import Translate from 'react-translate-component';
import { MultiSelect } from 'primereact/multiselect';
import { ListBox } from 'primereact/listbox';
import { Dropdown } from 'primereact/dropdown';

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                email: '',
                groups: [],
                picture: '',
                userType: '',
                _id: '',
                firstName: '',
                lastName: '',
                description: '',
                mobilePhone: '',
                country: '',
                city: '',
                address: ''
            }
        }

        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleUpdateForm = this.handleUpdateForm.bind(this);
    }

    componentDidMount() {
        helpers.getCurrentUser().then(function (response) {
            this.setState({ user: response.data });
        }.bind(this));
    }


    handleUserChange(event) {
        this.setState({
            user: {
                ...this.state.user,
                [event.target.name]: event.target.value
            }
        })
    }

    handleUpdateForm(event) {
        event.preventDefault();
        helpers.updateProfile(
            this.state.user._id,
            this.state.user.email,
            this.state.user.firstName,
            this.state.user.lastName,
            this.state.user.description,
            this.state.user.mobilePhone,
            this.state.user.country,
            this.state.user.city,
            this.state.user.address
        )
            .then(function (response) {
            }.bind(this));

        let userUpdated = $('.userUpdated').text();
        Materialize.toast(userUpdated, 3000);
    }

    render() {
        return (
            <div className="row">
                <h4 className="center"><Translate component="b" content="users.updateProfile" /></h4>
                <form className="col s12">
                    <div className="row">
                        <div className="input-field col s6">
                            <Translate component="h6" content='users.firstName' />
                            <Translate
                                component="input"
                                type="text"
                                name="firstName"
                                value={this.state.user.firstName}
                                onChange={this.handleUserChange}
                                attributes={{ placeholder: 'users.firstName' }} />
                        </div>
                        <div className="input-field col s6">
                            <Translate component="h6" content='users.lastName' />
                            <Translate
                                component="input"
                                type="text"
                                name="lastName"
                                value={this.state.user.lastName}
                                onChange={this.handleUserChange}
                                attributes={{ placeholder: 'users.lastName' }} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <Translate component="h6" content='users.email' />
                            <Translate
                                component="input"
                                type="email"
                                name="email"
                                value={this.state.user.email}
                                onChange={this.handleUserChange}
                                attributes={{ placeholder: 'users.email' }} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <Translate component="h6" content='users.mobilePhone' />
                            <Translate
                                component="input"
                                type="number"
                                name="mobilePhone"
                                value={this.state.user.mobilePhone}
                                onChange={this.handleUserChange}
                                attributes={{ placeholder: 'users.mobilePhone' }} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <Translate component="h6" content='users.description' />
                            <Translate
                                component="textarea"
                                type="text"
                                name="description"
                                className="descriptionSize"
                                value={this.state.user.description}
                                onChange={this.handleUserChange}
                                attributes={{ placeholder: 'users.description' }} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <Translate component="h6" content='users.country' />
                            <Translate
                                component="input"
                                type="text"
                                name="country"
                                value={this.state.user.country}
                                onChange={this.handleUserChange}
                                attributes={{ placeholder: 'users.country' }} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <Translate component="h6" content='users.city' />
                            <Translate
                                component="input"
                                type="text"
                                name="city"
                                value={this.state.user.city}
                                onChange={this.handleUserChange}
                                attributes={{ placeholder: 'users.city' }} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <Translate component="h6" content='users.address' />
                            <Translate
                                component="input"
                                type="text"
                                name="address"
                                value={this.state.user.address}
                                onChange={this.handleUserChange}
                                attributes={{ placeholder: 'users.address' }} />
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
            </div>
        );
    }
}

module.exports = UserProfile;