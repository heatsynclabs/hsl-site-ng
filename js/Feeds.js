define(['util'], function(util) {

  //console.log(jsapiFeed);

  return util.classy( util.extendInit, {

    defaults: {
      feedurls: [],
      nentries: 20,
      callbackitem: undefined,
      callbackfeed: undefined,
      callbackdone: undefined,
    },

    __init__: [function(config) {

      //this.config = config = config || this.cofig || this.defaults;

      //google && google.load("feeds", "1");

      var feedsinit = function() {
        if (!google.feeds) { console.error("google feeds library not loaded"); return; }

        var loaded=0;
        for (var f=0; f<config.feedurls.length; f++) {
          var feed = new google.feeds.Feed(config.feedurls[f]);
          feed.setNumEntries(config.nentries);

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

                if (typeof(config.callbackitem)==='function')
                  config.callbackitem.call(this,entry);
              }
            } else {
              console.log("Unable to load feed: " + config.feedurls[f]);
            }

            loaded++;

            if (typeof(config.callbackfeed)==='function')
              config.callbackfeed.call(this,loaded,result.feed);

            if (loaded==config.feedurls.length && typeof(config.callbackdone)==='function')
              config.callbackdone.call(this);

          });
        }
      };
      if(typeof(google)!=='undefined') google.setOnLoadCallback(feedsinit);
      else console.error("google jsapi is not loaded");
    }]
  });
});
