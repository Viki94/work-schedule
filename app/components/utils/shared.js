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
  },

  addDefaultAdminValueToRequest(allGroups) {
    if (!allGroups.length) {
      const adminGroupValue = '1';
      allGroups.push(adminGroupValue);
    }

    return allGroups;
  },

  findSelectedUserConditions(filteredValues) {
    let conditions = {};
    for (var propName in filteredValues) {
      if (filteredValues[propName] === true) {
        conditions[propName] = { "$ne": "" }
      }
      else if (filteredValues[propName] === false) {
        conditions[propName] = "";
      }
    }

    return conditions;
  }
};

module.exports = shared;