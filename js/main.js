(function(){

  var webify = function(s) {
    return s.replace(/{/g,'%7B').replace(/}/g,'%7D').replace(/"/g,'%22').
      replace(/,/g,'%2C').replace(/=/g,'%3A').replace(/\[/g,'%5B').replace(/\]/g,'%5D');
  };

  var jsapiFeed = 'https://www.google.com/jsapi?autoload='+
    webify('{"modules"=[{"name"="feeds","version"="1.0","callback"="define"}]}');

  var lazyload = function(f) {
    (window.attachEvent?
     window.attachEvent('onload',f):
     window.addEventListener('load',f,false));
  };

  localStorage = localStorage || {};

  require.config({
    waitSeconds: 60,
    baseUrl:'js',
    config: {
      text: {
        env: 'xhr',
        useXhr: function(){ return true; }
      }
    }
  });

  require(
    [
      'util',
      'stylist',
      'Feeds',
      'Calendar',
      'flickr-gallery',
      'cams',
    ],

    function (util,stylist,Feeds,Calendar,gallery,cams) {

      lazyload(function(){cams.init()});
/*
      flickr.init( util.extendCopy( flickr.defaults, {
        limit: 10,
        qstrings: {
          tags: 'publish',
          id: '60827818@N07'
        },
        doneCallback: function(data){
          console.log(data);
          console.log(this);
        },
        failCallback: function(err) {
          console.log("flickr loading failed!");
          if (err && err.requireType==='timeout') {
            for (var i=0; err && err.requireModules && i<err.requireModules.length; i++) {
              require.undef(err.requireModules[i]);
            }
            console.log(err);
            require(err.requireModules,function() {
              console.log("hello world");
            });
          }
        },
      }));
*/

      gallery && gallery.init( util.extendCopy( gallery.defaults, {
        imgDiv: document.getElementById("gallery"),
        imgNextDiv: document.getElementById("gallery_next"),
        textDiv: document.getElementById("gallery-text"),
        galleryLink: document.getElementById("gallery-link"),
      }));

/*
      swap.init( util.extendCopy( swap.defaults, {
        divA: document.getElementById("gallery2"),
        divB: document.getElementById("gallery_next2"),
        classA: 'gallery-foreground fade-test',
        classB: 'gallery-background',
        loadNextDiv: function() {
          console.log("we are using someCustomDiv!");
        },
      }));
      console.log(swap.config);
*/
      var lastNetInfoTime = 0;

      var netinfoAnchor = document.getElementById("netinfo-anchor");
      var netinfoSpan = document.getElementById("netinfo-span");

      var netinfoLoad = function() {
        var now = new Date().getTime();
        // Throttle requests to every 10 seconds
        if ((now - lastNetInfoTime)/1000.0 > 10) {
          console.log("Doing intranet require");
          lastNetInfoTime = now;
          require(["text!http://intranet.heatsynclabs.org:1337/data.php"],
                  function(data){
                    var machines = (/^\s*\[\s*"(.*)"\s*\]\s*$/g).exec(data)[1].split(/"\s*,\s*"/);
                    var text = "";
                    console.log("machines:",machines);
                    for (var i=0; i<machines.length; i++) {
                      if (!machines[i].match("^\\.")) {
                        text += machines[i] + "<br />";
                      }
                    }
                    netinfoSpan.innerHTML = text || "...";
                  });
        }
      };

      netinfoAnchor.onmouseover = netinfoLoad;
      netinfoLoad();

/*
      stylist.onLoad(function(){
        stylist.addStyle(".gallery-space","border: 1px solid red;");
        stylist.addReplaceStyle(".gallery-space","height: 200px;");
      });
*/
      //Feeds = undefined;
      Feeds && Feeds((function(){
        console.log("init feeds");

        var feedurls = [
          "http://blag.meznak.net/atom.xml",
          "http://rix.si/atom.xml",
          "http://citizengadget.com/rss",
          "http://fab.heatsynclabs.org/rss",
          "http://hsl-sem.tumblr.com/rss",
          "http://www.blogger.com/feeds/8608412012855561239/posts/default",
          "http://www.makermaximum.com/atom.xml",
          "http://feeds.feedburner.com/teamdroid/RSS",
          "http://www.toddfun.com/feed/",
          "http://willbradley.name/feed/"
        ];

        var feedcontainer = document.getElementById("feed");
        var entries = [];

        var compareEntries = function(A, B) {
          return A.date.getTime() < B.date.getTime() ? 1 : -1;
        }

        var entryDone = function(entry) {
          entries.push(entry);
        }

        var feedImgs = {};
        var feedLoaded = {};

        var imgCheck = function() {
          if (this.width>10 && this.height>10) {
            feedImgs[this.feedlink].push(this);
            console.log(this.src,this.width+"x"+this.height);
          } else {
          }
        }

        var feedDone = function(loaded,feed) {
          feedcontainer.innerHTML = "<h4>feeds loading ... " + ((loaded/feedurls.length)*100).toFixed(2) + "%</h4>";
          feedImgs[feed.link] = [];
          feedLoaded[feed.link] = true;

          for (var i=0; i<feed.entries.length; i++) {
            var entry = feed.entries[i];
            for (var j=0; j<entry.imgs.length; j++) {
              var img = document.createElement('img');
              img.src=entry.imgs[j];
              img.feedlink=feed.link;
              img.onload = imgCheck;
            }
          }
          feedLoaded[feed.feedurl] = true;
          console.log("*got feed item:*",feed.link);
        }

        var finishedEntries = function() {
          entries.sort(compareEntries);
          feedcontainer.innerHTML="<h2>Feeds:</h2>";
          for (var i=0; i<entries.length; i++) {
            var entry = entries[i];
            var div = document.createElement("div");
            div.innerHTML =
              "<div class='feed' style='border-radius:40;" +
              (entry.imgs.length?"background:url("+entry.imgs[0]+") no-repeat 50%;":"") +
              "z-index:-1;'></div>" +
              "<div class='feed feedr"+i%2+"' style='margin-top:-5.5em;'>" +
              "<h3><a href='"+entry.link+"'>"+(entry.title?entry.title:entry.blogurl)+"</a></h3>"+
              "<h4>"+(entry.author?" by "+entry.author:"")+" on "+entry.date.toLocaleDateString()+"</h4>"+
              "<p>"+entry.contentSnippet+"</p></div>";

            feedcontainer.appendChild(div);
          }
        }

        return {
          feedurls: feedurls,
          nentries: 20,
          callbackitem: entryDone,
          callbackfeed: feedDone,
          callbackdone: finishedEntries,
        };
      })());

      lazyload(function(){

        var calendarDiv = document.getElementById("calendar-entries");
        var calRefresh = document.getElementById("calendar-refresh");
        var calAnimateDiv = document.getElementById("calendar-animation");
        var calLoaded = false;

        if (localStorage.hslCalendar) {
          calendarDiv.innerHTML = localStorage.hslCalendar;
          calLoaded = true;
          calRefresh.innerHTML = '<span class="loading-anim">&#x267B;</span>';
        } else {
          calendarDiv.innerHTML = '[<strong><span class="loading-anim"> loading ... </span></strong>]';
        }

        function insertAgenda(e) {
          console.log("in insert agenda");
          var doy_last = 0;
          var time_first;
          var r = "";
          if (!calLoaded) calAnimateDiv.className = 'transition-calendar';
          else calRefresh.innerHTML = "";

          for (var i=0; i<e.feed.entry.length; i++) {
            console.log("checking entry");
            var entry=e.feed.entry[i];
            var d=new Date(entry.gd$when[0].startTime);
            if (i==0) time_first = d.getTime();
            // Only display events occurring in next 7.5 days
            if ((d.getTime()-time_first)<(1000*60*60*24*7.5)) {
              var title=entry.title.$t;
              var doy = d.getMonth()*31 + d.getDate();
              if (doy != doy_last) {
                if (doy_last>0) r += "</ul>\n";
                r += "<strong>" + d.getDayName() + ", " + d.getMonthName() +
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
          localStorage.hslCalendar = calendarDiv.innerHTML = r;
          console.log("done agenda");
        };

        Calendar( util.extendCopy( Calendar.prototype.defaults, {
          id: 'heatsynclabs.org_p9rcn09d64q56m7rg07jptmrqc%40group.calendar.google.com/public/full',
          callback: insertAgenda,
        }));
      });

    }/*,
       function(err) {
       console.log("Some error:");
       console.log(err);
       }*/
  );
})();
