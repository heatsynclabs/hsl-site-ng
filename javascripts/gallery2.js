function listener(e) {
    var l = document.createElement("li");
    //console.log("listener:" + e.type);

    var t = (e.type.match(/start$/i)?1:
             (e.type.match(/end$/i)?2:
              (e.type.match(/iteration$/i)?3:0)));

    switch(t) {
    case 1:
        l.innerHTML = "Started: elapsed time is " + e.elapsedTime;
        break;
    case 2:
        l.innerHTML = "Ended: elapsed time is " + e.elapsedTime;
        break;
    case 3:
        l.innerHTML = "New loop started at time " + e.elapsedTime;
        break;
    }
    document.getElementById("output").appendChild(l);
}

var flickrImages = [];
var flickrLimit = 20;
var previousIdx = -1;
var num = -2;
var imgDiv = document.getElementById("gallery");
var imgNextDiv = document.getElementById("gallery_next");
var galleryDiv = document.getElementById("gallery_space");


var e = document.getElementById("watchme");
e.addEventListener("animationstart", listener, false);
e.addEventListener("animationend", listener, false);
e.addEventListener("animationiteration", listener, false);
e.addEventListener("webkitAnimationStart", listener, false);
e.addEventListener("webkitAnimationEnd", listener, false);
e.addEventListener("webkitAnimationIteration", listener, false);
e.className = "fade-test";


var next = -1;
var curr = -1;

var newImage = function() {
    var num = 0;
    while (flickrImages.length>1 && ((num=Math.floor(Math.random()*flickrImages.length)) == next)) {}
    curr = next;
    next = num;
};

var n = 0;

function swapper(e) {
    newImage();
    var tmp = imgNextDiv;
    imgNextDiv = imgDiv;
    imgDiv = tmp;

    imgNextDiv.className = "gallery-background";
    imgNextDiv.style.background = "url("+flickrImages[next].image_b+") no-repeat 50%";
    imgDiv.className = "gallery-foreground fade-test";
    //imgNextDiv.style.opacity = 1;
};


// Do the jquery flick goodness
jflickrfeed(
    {
        limit: flickrLimit,
        qstrings: {
            tags: 'publish',
            id: '60827818@N07'
        },
        useTemplate: false,
        itemCallback: function(item){
            flickrImages.push(item);
        }
    },
    function(){

        newImage();
        newImage();

        imgNextDiv.style.background = "url("+flickrImages[next].image_b+") no-repeat 50%";
        imgDiv.style.background = "url("+flickrImages[curr].image_b+") no-repeat 50%";

        var e = imgNextDiv;
        e.addEventListener("animationiteration", swapper, false);
        e.addEventListener("webkitAnimationIteration", swapper, false);

        var e = imgDiv;
        e.addEventListener("animationiteration", swapper, false);
        e.addEventListener("webkitAnimationIteration", swapper, false);
        e.className = "gallery-foreground fade-test";

        //newImage();
        //timeout = setInterval(newImage, 10000)
        //initialize(flickrImages);
        console.log(flickrImages);
    });

