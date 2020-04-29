var React = require("react");
var counterpart = require("counterpart");
var bg = require('../lang/bg');
var en = require('../lang/en');

counterpart.registerTranslations('bg', bg);
counterpart.registerTranslations('en', en);
counterpart.setLocale('bg');

class Main extends React.Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

module.exports = Main;