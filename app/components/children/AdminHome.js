import React, { Component } from 'react';
import helpers from '../utils/helpers';
import ScheduleView from './ScheduleView';
import AnnouncementsBuild from './AnnouncementsBuild';
import AnnouncementsView from './AnnouncementsView';

class AdminHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allAnnouncements: [],
            announcementsCount: 5
        }

        this.getAnnouncements = this.getAnnouncements.bind(this);
        this.getUpdatedAnnouncements = this.getUpdatedAnnouncements.bind(this);
        this.updatedAnnouncementsCount = this.updatedAnnouncementsCount.bind(this);
    }

    componentDidMount() {
        this.getAnnouncements();
    }

    getAnnouncements() {
        helpers.getAnnouncements(this.state.announcementsCount).then(function (response) {
            this.setState({ allAnnouncements: response.data });
        }.bind(this));
    }

    getUpdatedAnnouncements(updatedAnnouncements) {
        this.setState({ allAnnouncements: updatedAnnouncements })
    }

    updatedAnnouncementsCount(count) {
        this.setState({ announcementsCount: count }, function () {
            this.getAnnouncements();
        });
    }

    render() {
        return (
            <div>
                <ScheduleView />
                <div className="row">
                    <div className="col m6">
                        <AnnouncementsView getUpdatedAnnouncements={this.getUpdatedAnnouncements} getAnnouncements={this.getAnnouncements} updatedAnnouncementsCount={this.updatedAnnouncementsCount} allAnnouncements={this.state.allAnnouncements} isAdmin={true} />
                    </div>
                    <div className="col m6 fullWidth">
                        <AnnouncementsBuild getUpdatedAnnouncements={this.getUpdatedAnnouncements} allAnnouncements={this.state.allAnnouncements} isAdmin={true} />
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = AdminHome;