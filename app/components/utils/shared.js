import counterpart from 'counterpart';

let shared = {
  onLangChange(selectedLanguage) {
    $('.langContainer').find('img').removeClass('activeLang');
    $('.' + selectedLanguage).addClass('activeLang');

    localStorage.setItem('lang', selectedLanguage);
    counterpart.setLocale(selectedLanguage);
    window.location.reload(false)
  },

  publishedDate(timestamp) {
    var date = new Date(Number(timestamp));
    var datestring = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" +
    date.getFullYear() + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" +
     ("0" + date.getSeconds()).slice(-2);
     
    return datestring;
  }
};

module.exports = shared;