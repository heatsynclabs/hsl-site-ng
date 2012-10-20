var months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];

var days =   ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var calendarDiv = document.getElementById("calendar-entries");
var calAnimateDiv = document.getElementById("calendar-animation");

function insertAgenda(e) {
    var doy_last = 0;
    var time_first;
    var r = "";
    calAnimateDiv.className = 'transition-calendar';
    for (var i=0; i<e.feed.entry.length; i++) {
        var entry=e.feed.entry[i];
        var d=new Date(entry.gd$when[0].startTime);
        if (i==0) time_first = d.getTime();
        // Only display events occurring in next 7.5 days
        if ((d.getTime()-time_first)<(1000*60*60*24*7.5)) {
            var title=entry.title.$t;
            var doy = d.getMonth()*31 + d.getDate();
            if (doy != doy_last) {
                if (doy_last>0) r += "</ul>\n";
                r += "<strong>" + days[d.getDay()] + ", " + months[d.getMonth()] +
                    " " + d.getDate() + "</strong>\n";
                r += "<ul>\n";
            }
            doy_last = doy;
            var h = d.getHours();
            var m = d.getMinutes();
            var ampm = (h>=12?"PM":"AM");
            var time = (h==0?12:(h>12?h-12:h)) + ":" + (m<10?"0":"") + m;
            r += "<li> " + time + "<span class='"+ampm+"'>" + ampm + "</span> " + title + "</li>\n";
        }
    }
    r += "</ul>\n";
    calendarDiv.innerHTML = r;
};

var url = "http://www.google.com/calendar/feeds/"+
    "heatsynclabs.org_p9rcn09d64q56m7rg07jptmrqc%40group.calendar.google.com/public/full"+
    "?alt=json-in-script&callback={{callback}}&orderby=starttime&max-results=10"+
    "&singleevents=true&sortorder=ascending&futureevents=true";

// Thanks to http://friendlybit.com/js/lazy-loading-asyncronous-javascript/
(function() {
    function async_load(){
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = url.replace(/{{callback}}/gi,"insertAgenda");
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
    }
    if (window.attachEvent)
        window.attachEvent('onload', async_load);
    else
        window.addEventListener('load', async_load, false);
})();
