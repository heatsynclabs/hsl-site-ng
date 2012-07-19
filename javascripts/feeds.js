/*
  ToDo: Finish coding feeds stuff
*/

google.load("feeds", "1");

function ginitialize() {
    var feed = new google.feeds.Feed("http://blag.meznak.net/atom.xml");
    feed.load(function(result) {
	if (!result.error) {
	    var container = document.getElementById("feed");
	    var rooturl = /^http:\/\/[^\/]*/i.exec(result.feed.link);

	    for (var i = 0; i < result.feed.entries.length; i++) {

		var entry = result.feed.entries[i];
		var div = document.createElement("div");
		div.innerHTML = "<h4>"+entry.title+"</h4>"+entry.content;

		var rei = /<img[^>]*src=[\"\']([^\"\'\s]*)[^>]*>/gi;
		var rai;

		while (rai = rei.exec(entry.content)) {
		    if (/^\//.exec(rai[1])) {
			rai[1] = rooturl+rai[1];
		    }
		    console.log(rai);
		}

		//var intro = /^(\w

		div.appendChild(document.createTextNode(entry.content));
		container.appendChild(div);
	    }
	}
    });
}

google.setOnLoadCallback(ginitialize);
