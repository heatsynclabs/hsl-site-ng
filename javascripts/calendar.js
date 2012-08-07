var months = ["January",
              "Febuary",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December"];

var days =   ["Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday"];

var calendarDiv = document.getElementById("google-calendar");

function insertAgenda(e) {
    var doy_last = 0;
    var r = "<div class='calendar-entries'><h3>Calendar</h3>\n";
    for (var i=0; i<e.feed.entry.length; i++) {
        var entry=e.feed.entry[i];
        var d=new Date(entry.gd$when[0].startTime);
        var t=entry.title.$t;
        var doy = d.getMonth()*32 + d.getDate();
        if (doy != doy_last) {
            if (doy_last>0) r += "</ul>\n";
            r += days[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate() + "\n";
            r += "<ul>\n";
        }
        doy_last = doy;
        var h = d.getHours();
        var m = d.getMinutes();
        r += "<li>" + (h==0?12:(h>12?h-12:h)) + ":" + (m<10?"0":"") + m + (h>=12?"PM":"AM") + "  " + t + "</li>\n";
    }
    r += "</ul></div>\n";
    calendarDiv.innerHTML = r;
};

var url = "http://www.google.com/calendar/feeds/heatsynclabs.org_p9rcn09d64q56m7rg07jptmrqc%40group.calendar.google.com/public/full?alt=json-in-script&callback=insertAgenda&orderby=starttime&max-results=15&singleevents=true&sortorder=ascending&futureevents=true";

setTimeout(function(){
    var script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
},1);