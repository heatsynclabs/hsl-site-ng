define(['util'], function(util) {

  if (!Date.prototype.monthNames)
    Date.prototype.monthNames = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ];

  if (!Date.prototype.dayNames)
    Date.prototype.dayNames = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

  if (!Date.prototype.getMonthName)
    Date.prototype.getMonthName = function() {
      return this.monthNames[this.getMonth()];
    };

  if (!Date.prototype.getDayName)
    Date.prototype.getDayName = function() {
      return this.dayNames[this.getDay()];
    };

  return util.classy( util.importer, {
    defaults: {
      baseurl: 'http://www.google.com/calendar/feeds/',
      qstrings: {
        'alt': 'json-in-script',
        'callback': 'define',
        'orderby': 'starttime',
        'max-results': 10,
        'singleevents': true,
        'sortorder': 'ascending',
        'futureevents': true,
      }
    },
  });
});
