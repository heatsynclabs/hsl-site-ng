var flickrImages = [];
var flickrLimit = 20;
var imgDiv = document.getElementById("gallery");
var imgNextDiv = document.getElementById("gallery_next");

var next = -1;
var curr = -1;

var newImage = function() {
    var num = 0;
    while (flickrImages.length>1 && ((num=Math.floor(Math.random()*flickrImages.length)) == next)) {}
    curr = next;
    next = num;
};

function swapper(e) {
    newImage();

    var tmp = imgNextDiv;
    imgNextDiv = imgDiv;
    imgDiv = tmp;

    imgNextDiv.className = "gallery-background";
    imgNextDiv.style.background = "url("+flickrImages[next].image_b+") no-repeat 50%";
    imgDiv.className = "gallery-foreground fade-test";
};

var addSwapListener = function(e) {
    e.addEventListener("animationiteration", swapper, false);
    e.addEventListener("webkitAnimationIteration", swapper, false);
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
        newImage();
        newImage();

        imgNextDiv.style.background = "url("+flickrImages[next].image_b+") no-repeat 50%";
        imgDiv.style.background = "url("+flickrImages[curr].image_b+") no-repeat 50%";

        addSwapListener(imgDiv);
        addSwapListener(imgNextDiv);

        imgDiv.className = "gallery-foreground fade-test";
    });
