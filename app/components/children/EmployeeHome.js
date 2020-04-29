var React = require("react");
var helpers = require("../utils/helpers");
var ScheduleView = require("./ScheduleView");
var AnnouncementsView = require("./AnnouncementsView");

class EmployeeHome extends React.Component {
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