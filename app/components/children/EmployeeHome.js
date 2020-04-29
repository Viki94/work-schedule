import React, { Component } from 'react';
import helpers from '../utils/helpers';
import ScheduleView from './ScheduleView';
import AnnouncementsView from './AnnouncementsView';

class EmployeeHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allAnnouncements: [],
            announcementsCount: 5
        }

        this.getAnnouncements = this.getAnnouncements.bind(this);
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

    updatedAnnouncementsCount(count) {
        this.setState({ announcementsCount: count }, function () {
            this.getAnnouncements();
        });
    }

    render() {
        return (
            <div>
                <ScheduleView />
                <AnnouncementsView updatedAnnouncementsCount={this.updatedAnnouncementsCount} allAnnouncements={this.state.allAnnouncements} isAdmin={false} />
            </div>
        );
    }
}

module.exports = EmployeeHome;