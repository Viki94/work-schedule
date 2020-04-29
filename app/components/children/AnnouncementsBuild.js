import React, { Component } from 'react';
import helpers from '../utils/helpers';
import Translate from 'react-translate-component';

class AnnouncementsBuild extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            allAnnouncements: [],
            announcementId: ''
        }

        this.handleAnnouncementBuild = this.handleAnnouncementBuild.bind(this);
        this.getAnnouncements = this.getAnnouncements.bind(this);
        this.addAnnouncements = this.addAnnouncements.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.clearStates = this.clearStates.bind(this);
    }

    componentDidMount() {
        helpers.getCurrentUser().then(function (response) {
            if (response !== this.state.username) {
                this.setState({ username: response.data.username });
            }
        }.bind(this));
    }

    handleAnnouncementBuild(event) {
        this.setState({ [event.target.id]: event.target.value });
    }

    getAnnouncements() {
        helpers.getAnnouncements().then(function (response) {
            this.setState({ allAnnouncements: response.data }, function () {
                if (this.props.isAdmin) {
                    this.props.getUpdatedAnnouncements(this.state.allAnnouncements);
                }
            });
        }.bind(this));
    }

    addAnnouncements(event) {
        event.preventDefault(event);
        helpers.addAnnouncements(this.state.title, this.state.content, new Date().toUTCString(), this.state.username).then(function (response) {
            this.state.announcementId = response.data._id;
            this.getAnnouncements();
            this.clearStates();
        }.bind(this));

        Materialize.toast('Announcement added', 3000);
        this.clearForm();
    }

    clearForm() {
        var elements = document.getElementsByTagName("input");
        for (var i = 0; i < elements.length; i++) {
            elements[i].value = "";
            elements[i].classList.remove("valid");
        };
    }

    clearStates() {
        this.setState({ title: "", content: "" });
    }

    render() {
        return (
            <div className="card-panel">
                <div className="row">
                    <div className="col s12">
                        <h5><Translate content="announcements.makeAnAnnouncement" /></h5>
                    </div>
                </div>
                <form onSubmit={this.addAnnouncements}>
                    <div className="row">
                        <div className="input-field col s12">
                            <Translate
                                component="input"
                                type="text"
                                id="title"
                                className="validate"
                                value={this.state.title}
                                onChange={this.handleAnnouncementBuild}
                                required
                                attributes={{ placeholder: 'announcements.title' }} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <Translate
                                component="textarea"
                                type="text"
                                id="content"
                                className="materialize-textarea"
                                value={this.state.content}
                                onChange={this.handleAnnouncementBuild}
                                required
                                attributes={{ placeholder: 'announcements.makeAnAnnouncement' }} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <button className="btn waves-effect waves-light btn-large green accent-3 fullWidth" type="submit" value="Submit" name="action"><Translate content="buttons.create" /><i className="material-icons right">add</i></button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

module.exports = AnnouncementsBuild;