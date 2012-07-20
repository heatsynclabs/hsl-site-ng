/*
  ToDo: Finish coding feeds stuff
*/

google.load("feeds", "1");

function ginitialize() {
    var feed = new google.feeds.Feed("http://blag.meznak.net/atom.xml");
    feed.setNumEntries(1);

    feed.load(function(result) {
	if (!result.error) {
	    var container = document.getElementById("feed");
	    var rooturl = /^http:\/\/[^\/]*/i.exec(result.feed.link);

	    for (var i = 0; i < result.feed.entries.length; i++) {

		var entry = result.feed.entries[i];
		var div = document.createElement("div");
		var rei = /<\s*img[^>]*\s+src=[\"\']?([^\"\'\s]*)[^>]*>/gi;
		var rai, imgs = [];
		
		while (rai = rei.exec(entry.content)) {
		    if (/^\//.exec(rai[1])) rai[1] = rooturl+rai[1];
		    imgs.push(rai[1]);
		}

		var intro = (/^.{0,137}/g.exec(entry.content.replace(/<[^>]*>/g,"")))[0].replace(/\S*$/g,"");
		div.innerHTML = "<img src='"+imgs[0]+"'/>"+
		    "<h3>"+entry.title+"</h3>"+
		    (result.feed.author?"<h4> by "+result.feed.author+"</h4>":"")+
		    "<p>"+intro+"... (<a href='"+entry.link+"'>more</a>)</p>";
		
		//div.appendChild(document.createTextNode(entry.content));
		container.appendChild(div);
	    }
	}
    });
}

google.setOnLoadCallback(ginitialize);
