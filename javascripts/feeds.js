/*
  ToDo: Finish coding feeds stuff
*/
google.load("feeds", "1");    

function feedr(feedurls) {

    var container = document.getElementById("feed");

    var feedrinit = function() {
	var feeds=[];
	var loaded=0;

	for (var f=0; f<feedurls.length; f++) {
	    var feed = new google.feeds.Feed(feedurls[f]);
	    feed.setNumEntries(1);

	    feed.load(function(result) {
		if (!result.error) {
		    feeds.push(result.feed);
		    feed.rooturl = /^http:\/\/[^\/]*/i.exec(result.feed.link);
		    for (var i = 0; i < result.feed.entries.length; i++) {

			var entry = result.feed.entries[i];
			var rei = /<\s*img(?:\s+[^>]*)?\s+src\s*=\s*[\"\']?([^\"\'\s]*)[^>]*>/gi;
			var rai, imgs = [];
			
			while (rai = rei.exec(entry.content)) {
			    if (/^\//.exec(rai[1])) rai[1] = feed.rooturl+rai[1];
			    imgs.push(rai[1]);
			}

			entry.imgs = imgs;
			entry.date = new Date(entry.publishedDate);
			entry.intro = entry.content.replace(/<[^>]*>/g,"").
			    replace(/^\s+/,"").substr(0,137).replace(/\S*$/,"");
		    }
		} else {
		    console.log("Unable to load feed: " + feedurls[f]);
		}
		
		loaded++;	    
		container.innerHTML = "<h4>feeds loading ... " + (loaded/feedurls.length)*100 + "%</h4>";
		if (loaded==feedurls.length) {
		    finishedEntries();
		}
	    });

	}
	
	var compareFeeds = function(A, B) {
	    return A.entries[0].date.getTime() < B.entries[0].date.getTime();
	}

	var finishedEntries = function() {
	    feeds.sort(compareFeeds);
	    container.innerHTML="<h2>Feeds:</h2>";
	    for (var f=0; f<feeds.length; f++) {
		var feed = feeds[f];
		var entry = feed.entries[0];

		var div = document.createElement("div");

		div.innerHTML = 
    		    "<h3>"+entry.title+"</h3>"+
    		    "<h4>"+(feed.author?" by "+feed.author:"")+" on "+entry.date.toLocaleDateString()+"</h4>"+
		    "<img src='"+entry.imgs[0]+"'/>"+
    		    "<p>"+entry.intro+"... (<a href='"+entry.link+"'>more</a>)</p>";
		
		//div.appendChild(document.createTextNode(entry.content));
		container.appendChild(div);
	    }
	    
	}
	

	//var div = document.createElement("div");
	
	// div.innerHTML = "<img src='"+imgs[0]+"'/>"+
	// 	"<h3>"+entry.title+"</h3>"+
	// 	(result.feed.author?"<h4> by "+result.feed.author+"</h4>":"")+
	// 	"<p>"+intro+"... (<a href='"+entry.link+"'>more</a>)</p>";
	
	// //div.appendChild(document.createTextNode(entry.content));
	// container.appendChild(div);
    }

    google.setOnLoadCallback(feedrinit);

}
