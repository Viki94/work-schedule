import React, { Component } from 'react';
import counterpart from 'counterpart';
import * as bg from '../lang/bg';
import * as en from '../lang/en';

counterpart.registerTranslations('bg', bg);
counterpart.registerTranslations('en', en);

class Main extends Component {
    componentDidMount() {
        var currentLang = localStorage.getItem('lang') || 'bg';
        counterpart.setLocale(currentLang);
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

module.exports = Main;