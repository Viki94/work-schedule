import counterpart from 'counterpart';

let language = {
  onLangChange(selectedLanguage) {
    $('.langContainer').find('img').removeClass('activeLang');
    $('.' + selectedLanguage).addClass('activeLang');

    localStorage.setItem('lang', selectedLanguage);
    counterpart.setLocale(selectedLanguage);
    window.location.reload(false)
  }
};

module.exports = language;
