/*
  ToDo: Finish coding feeds stuff
*/
google.load("feeds", "1");

function feedr(feedurls,nentries,callbackitem,callbackfeed,callbackdone) {

  var feedrinit = function() {

    var loaded=0;

    for (var f=0; f<feedurls.length; f++) {
      var feed = new google.feeds.Feed(feedurls[f]);
      feed.setNumEntries(nentries);

      feed.load(function(result) {
        if (!result.error) {
          feed.rooturl = /^http:\/\/[^\/]*/i.exec(result.feed.link)[0];
          for (var i = 0; i < result.feed.entries.length; i++) {

            var entry = result.feed.entries[i];
            var rei = /<\s*img(?:\s+[^>]*)?\s+src\s*=\s*[\"\']?([^\"\'\s]*)[^>]*>/gi;
            var rai, imgs = [];

            while (rai = rei.exec(entry.content)) {
              if (/^\//.exec(rai[1])) rai[1] = feed.rooturl+rai[1];
              if (rai[1]) {
                //console.log(entry.link +":"+rai[1]+"\n --- "+rai[0]);
                imgs.push(rai[1]);
              }
            }

            if (imgs)
              entry.imgs = imgs;

            entry.blogurl = feed.rooturl.replace(/^http:\/\//,"");
            entry.author = (result.feed.author?result.feed.author:entry.blogurl);
            entry.date = new Date(entry.publishedDate);
            entry.intro = entry.content.replace(/<[^>]*>/g,"").
              replace(/^\s+/,"").substr(0,137).replace(/\S*$/,"");
            entry.feedtitle = result.feed.title;
            entry.feedlink = result.feed.link;

            if (typeof(callbackitem)==='function')
              callbackitem.call(this,entry);
          }
        } else {
          console.log("Unable to load feed: " + feedurls[f]);
        }

        loaded++;

        if (typeof(callbackfeed)==='function')
          callbackfeed.call(this,loaded,result.feed);

        if (loaded==feedurls.length && typeof(callbackdone)==='function')
          callbackdone.call(this);

      });
    }
  }

  google.setOnLoadCallback(feedrinit);
}

