
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

var feed = new feedr(feedurls,20,entryDone,feedDone,finishedEntries);
