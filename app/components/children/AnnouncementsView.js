import React, { Component } from 'react';
import helpers from '../utils/helpers';
import Translate from 'react-translate-component';

class AnnouncementsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAnnouncement: '',
            announcementId: '',
            announcementsCount: 5,
            allAnnouncements: [],
            isAdmin: false
        }

        this.handleRemoveAnnouncement = this.handleRemoveAnnouncement.bind(this);
    }

    componentDidMount() {
        $("#announcementsCount").on('change', function (event) {
            this.setState({ announcementsCount: event.target.value }, function () {
                this.props.updatedAnnouncementsCount(this.state.announcementsCount);
                this.props.getUpdatedAnnouncements(this.state.allAnnouncements);
            });
        }.bind(this))
    }

    handleRemoveAnnouncement(event) {
        this.setState({ selectedAnnouncement: event.target.id }, function () {
            for (var i = 0; i < this.props.allAnnouncements.length; i++) {
                if (this.props.allAnnouncements[i]._id == this.state.selectedAnnouncement) {
                    this.setState({
                        announcementId: this.state.selectedAnnouncement
                    }, function () {

                        event.preventDefault();
                        helpers.removeAnnouncement(this.state.selectedAnnouncement).then(function (response) {
                        }.bind(this));

                        Materialize.toast("Announcement removed", 3000);
                        
                        var updated = this.props.getAnnouncements()
                        this.props.getUpdatedAnnouncements(updated);
                    });
                }
            }
        });
    }

    render() {
        return (
            <div className="card-panel">
                <div className="row">
                    <div className="col s12">
                        <h5><Translate content="announcements.latestAnnouncements" /></h5>
                    </div>
                </div>
                <div className="input-field col s12">
                    <div><Translate content="announcements.selectAnnouncementCount" /></div>
                    <select id="announcementsCount">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="0"><Translate content="announcements.all" /></option>
                    </select>
                </div>
                {this.props.allAnnouncements.map((announcement, i) => {
                    return (
                        <div key={i} className="row">
                            <div className="col s12">
                                <h5>{announcement.title}</h5>
                                <p>{announcement.content}</p>
                                <p><Translate content="announcements.postedAt" />: {announcement.date}</p>
                                <p><Translate content="announcements.postedFrom" />: {announcement.username}</p>
                            </div>
                            {(() => {
                                if (this.props.isAdmin) {
                                    return (
                                        <div className="col s12">
                                            <a id={announcement._id}
                                                className="btn btn-large waves-effect waves-light red accent-3 fullWidth"
                                                onClick={this.handleRemoveAnnouncement}
                                            >
                                                <Translate content="buttons.remove" />
                                                <i className="material-icons right">delete_forever</i>
                                            </a>
                                        </div>
                                    )
                                }
                            })()}
                        </div>
                    );
                }, this)}

            </div>
        );
    }
}

module.exports = AnnouncementsView;