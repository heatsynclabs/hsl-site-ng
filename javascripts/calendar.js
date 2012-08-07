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
    var time_first;
    var r = "<div class='calendar-entries'><h3>Calendar</h3>\n";
    for (var i=0; i<e.feed.entry.length; i++) {
        var entry=e.feed.entry[i];
        var d=new Date(entry.gd$when[0].startTime);
        if (i==0) time_first = d.getTime();
        // Only display events occurring in next 7.5 days
        if ((d.getTime()-time_first)<(1000*60*60*24*7.5)) {
            var t=entry.title.$t;
            var doy = d.getMonth()*32 + d.getDate();
            if (doy != doy_last) {
                if (doy_last>0) r += "</ul>\n";
                r += "<strong>" + days[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate() + "</strong>\n";
                r += "<ul>\n";
            }
            doy_last = doy;
            var h = d.getHours();
            var m = d.getMinutes();
            var ampm = (h>=12?"PM":"AM");
            var time = (h==0?12:(h>12?h-12:h)) + ":" + (m<10?"0":"") + m;
            r += "<li> <span class='"+ampm+"'>" + time + "</span> " + t + "</li>\n";
        }
    }
    r += "</ul></div>\n";
    calendarDiv.innerHTML = r;
};

var url = "http://www.google.com/calendar/feeds/heatsynclabs.org_p9rcn09d64q56m7rg07jptmrqc%40group.calendar.google.com/public/full"+
    "?alt=json-in-script&callback={{callback}}&orderby=starttime&max-results=10&singleevents=true&sortorder=ascending&futureevents=true";
console.log("Hello world!");

try {
    // Use a web worker when possible due to high latency in calendar feed
    var worker = new Worker('javascripts/importJSONP-worker.js');
    worker.onmessage = function(event){ insertAgenda(event.data); };
    worker.postMessage(url.replace(/{{callback}}/gi,"postMessage"));
} catch(e) {
    // Or fall back to standard JSONP call
    console.log("Unable to use web worker: " + e.message);
    setTimeout(function(){
        var script = document.createElement('script');
        script.src = url.replace(/{{callback}}/gi,"insertAgenda");
        document.body.appendChild(script);
    },1);
}
