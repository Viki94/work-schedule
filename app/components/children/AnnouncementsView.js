var React = require("react");

var AnnouncementsView = React.createClass({
    render: function () {
        return (
            <div className="card-panel">
                <div className="row">
                    <div className="col s12">
                        <h5>Latest announcement</h5>
                    </div>
                </div>
                {this.props.allAnnouncements.map((announcement, i) => {
                    return (
                        <div key={i} className="row">
                            <div className="col s12">
                                <h5>{announcement.title}</h5>
                                <p>{announcement.content}</p>
                                <p>Posted at: {announcement.date}</p>
                                <p>Posted from: {announcement.username}</p>
                            </div>
                        </div>
                    );
                }, this)}

            </div>
        );
    }
});

module.exports = AnnouncementsView;