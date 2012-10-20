var flickrImages = [];
var flickrLimit = 20;
var galleryDiv = document.getElementById("gallery_space");
var imgDiv = document.getElementById("gallery");
var imgNextDiv = document.getElementById("gallery_next");
var textDiv = document.getElementById("gallery-text");
var galleryLink = document.getElementById("gallery-link");

var flickrHistory = [];
var flickrHistoryMaxLen = 6;

var currUrl;

// Generate next unique index
function nextRandom(history,size) {
    var num=0;

    // Recycle oldest number if our history is equal to max size and already generated
    if (history.length==size && size>0 && (num=history[0])!=undefined) {}
    // Or keep generating random numbers until finding one that isn't in history
    else while (history.indexOf(num=Math.floor(Math.random()*size))!=-1) {}

    // Add new number to history and remove oldest
    history.push(num);
    history.shift();

    return num;
};

function nextFlickr() {
    return nextRandom(flickrHistory,flickrImages.length);
};

function labelTimeout() {
    setTimeout(function(){
        textDiv.innerHTML = "<h4>" + imgNextDiv.title + "</h4>";
        currUrl = imgNextDiv.link;
        galleryLink.href = currUrl;
    },8500);
}

// Swap styles & variables upon animation step completion
function swapper(e) {
    var tmp = imgNextDiv;
    imgNextDiv = imgDiv;
    imgDiv = tmp;

    imgNextDiv.className = "gallery-background";
    imgNextDiv.style.opacity=1;
    if (flickrImages.length>0) {
        var next = nextFlickr();
        imgNextDiv.style.background = "url("+flickrImages[next].image_b+") no-repeat 50%";
        imgNextDiv.title = flickrImages[next].title;
        imgNextDiv.link = flickrImages[next].link;
    }
    imgDiv.className = "gallery-foreground fade-test";

    labelTimeout();
};

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

        if (flickrImages.length>0) {
            // Define flickrHistory length no longer than number of images (if maxLen is within 1 of len imgs then use len imgs)
            flickrHistory.length = ( flickrHistoryMaxLen>=flickrImages.length-1 ? flickrImages.length : flickrHistoryMaxLen );

            // Generate index for current & next indices
            var curr = nextFlickr();
            var next = nextFlickr();

            imgDiv.style.background = "url("+flickrImages[curr].image_b+") no-repeat 50%";
            imgNextDiv.style.background = "url("+flickrImages[next].image_b+") no-repeat 50%";

            textDiv.innerHTML = "<h4>"+flickrImages[curr].title+"</h4>";
            imgNextDiv.title = flickrImages[next].title;
            imgNextDiv.link = flickrImages[next].link;

            currUrl = flickrImages[curr].link;
            galleryLink.href = currUrl;
            //galleryDiv.onclick = function() { window.location = currUrl; };

            labelTimeout();
        }

        // Let foreground load first, wait before making background visible
        //imgNextDiv.style.opacity=0;
        setTimeout(function(){imgNextDiv.style.opacity=1;},3500);
        // Listen for animation events
        var addSwapListener = function(e) {
            e.addEventListener("animationiteration", swapper, false);
            e.addEventListener("webkitAnimationIteration", swapper, false);
        };

        addSwapListener(imgDiv);
        addSwapListener(imgNextDiv);

        // Start fades
        imgDiv.className = "gallery-foreground fade-test";
    });
