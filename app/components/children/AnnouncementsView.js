import React, { Component } from 'react';
import helpers from '../utils/helpers';
import Translate from 'react-translate-component';
import { QRCode } from "react-qr-svg";

class AnnouncementsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAnnouncement: '',
            announcementId: '',
            announcementsCount: 5,
            allAnnouncements: [],
            isAdmin: false,
            qrData: "Invalid data"
        }

        this.handleRemoveAnnouncement = this.handleRemoveAnnouncement.bind(this);
        this.generateQrCode = this.generateQrCode.bind(this);
        this.hideQrCode = this.hideQrCode.bind(this);
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

                        let announcementRemoved = $('.announcementRemoved').text();
                        Materialize.toast(announcementRemoved, 3000);

                        var updated = this.props.getAnnouncements()
                        this.props.getUpdatedAnnouncements(updated);
                    });
                }
            }
        });
    }

    generateQrCode(selectedAnnouncementId) {
        let announcement = this.props.allAnnouncements.find(item => item._id === selectedAnnouncementId)
        let title = announcement.title;
        let content = announcement.content;
        let date = announcement.date;
        let username = announcement.username;
        let announcementText = `Title: ${title} \n Content: ${content} \n Date: ${date} \n Username: ${username}`;

        this.setState({ qrData: announcementText }, () => {
            $('[id*="print-this"]').addClass('hide');
            $('[class*="remove"]').parent().addClass('hide');
            $('[class*="add"]').parent().removeClass('hide');
            $('#print-this-' + selectedAnnouncementId).removeClass('hide');
            $('.remove-' + selectedAnnouncementId).parent().removeClass('hide');
            $('.add-' + selectedAnnouncementId).parent().addClass('hide');
        })
    }

    hideQrCode(id) {
        $('#print-this-' + id).addClass('hide');
        $('.remove-' + id).parent().addClass('hide');
        $('.add-' + id).parent().removeClass('hide');
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
                        <option value="5" defaultValue="5" >5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <Translate component="option" content="announcements.all" value="0" />
                    </select>
                </div>
                {this.props.allAnnouncements.length ?
                    this.props.allAnnouncements.map((announcement, i) => {
                        return (
                            <div key={i} className="row">
                                <div className="col s12">
                                    <h5>{announcement.title}</h5>
                                    <p>{announcement.content}</p>
                                    <p><Translate content="announcements.postedAt" />: {announcement.date}</p>
                                    <p><Translate content="announcements.postedFrom" />: {announcement.username}</p>
                                </div>
                                <div id={"print-this-" + announcement._id} className="hide">
                                    <br />
                                    <div id="qr-code">
                                        <QRCode
                                            id="qr-code-value"
                                            bgColor="#FFFFFF"
                                            fgColor="#000000"
                                            level="L"
                                            value={this.state.qrData}
                                        />
                                    </div>
                                </div>
                                <div className="col s12">
                                    <a id={announcement._id}
                                        className={"btn btn-large waves-effect waves-light green accent-3 fullWidth add-" + announcement._id}
                                        onClick={() => { this.generateQrCode(announcement._id) }}
                                    >
                                        <Translate content="buttons.generateQrCode" />
                                        <i className="material-icons right">add</i>
                                    </a>
                                </div>
                                <div className="col s12 hide">
                                    <a id={announcement._id}
                                        className={"btn btn-large waves-effect waves-light amber accent-3 fullWidth remove-" + announcement._id}
                                        onClick={() => { this.hideQrCode(announcement._id) }}
                                    >
                                        <Translate content="buttons.removeQrCode" />
                                        <i className="material-icons right">remove</i>
                                    </a>
                                </div>
                                <div className="marginBottom"></div>
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
                                                <div className="marginBottom"></div>
                                            </div>
                                        )
                                    }
                                })()}
                                <hr />
                            </div>
                        );
                    }, this) :
                    <div className="row">
                        <div className="col s12">
                            <b>
                                <Translate content="requests.noInformation" />
                            </b>
                        </div>
                    </div>
                }

                <Translate content="toasts.announcementRemoved" className="hide announcementRemoved" />
            </div>
        );
    }
}

module.exports = AnnouncementsView;