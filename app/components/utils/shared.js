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
    let date = new Date(Number(timestamp));
    let datestring = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" +
      date.getFullYear() + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" +
      ("0" + date.getSeconds()).slice(-2);

    return datestring;
  },

  formattedDateForZoomStartTime(startTime) {
    let datestring = startTime.getFullYear() + "-" + ("0" + (startTime.getMonth() + 1)).slice(-2) + "-" + ("0" + startTime.getDate()).slice(-2) +
      "T" + ("0" + startTime.getHours()).slice(-2) + ":" + ("0" + startTime.getMinutes()).slice(-2) + ":" +
      ("0" + startTime.getSeconds()).slice(-2);

    return datestring;
  },

  addDefaultAdminValueToRequest(allGroups, isItGroupRequest) {
    if (isItGroupRequest) {
      var allGroupValue = allGroups.split(',');
      allGroups = [];
      allGroupValue.map(group => {
        if (!isNaN(group) && (0 < Number(group) && Number(group) < 10)) {
          allGroups.push(group);
        }
      })
    }

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