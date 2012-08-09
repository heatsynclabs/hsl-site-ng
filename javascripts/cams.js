
var cams = [];
var bgWidth = 160;
var bgHeight = 120;
var bgSize =  bgWidth + " " + bgHeight;
var numCams = 3;
var borderWidth = 2;

var camDiv = document.getElementById("cameras");
var divWidth = bgWidth + 4;

var camUrl = "http://live.heatsynclabs.org/snapshot.php?camera=";
//var camUrl = "http://thingiverse-production.s3.amazonaws.com/renders/95/5e/69/37/a8/nerf-cartridge_preview_large.jpg?";

var maxRefresh = 14000;

var allCams = {};

allCams.fg = document.createElement('div');
allCams.bg = document.createElement('div');
allCams.fg.className = "allcams-fg";
allCams.bg.className = "allcams-bg";

camDiv.appendChild(allCams.fg);
camDiv.appendChild(allCams.bg);

camDiv.style.height = bgHeight + 4;

// Thanks to http://friendlybit.com/js/lazy-loading-asyncronous-javascript/
(function() {
    function async_load(){

        var fgLoaded = 0;
        var bgLoaded = 0;
        var loadTime = 0;
        var lastAnimate = 0;

        function loadImg(o,url,onload) {
            var img = document.createElement('img');
            img.src = url+"&date="+(new Date()).getTime();
            img.width = bgWidth;
            img.height = bgHeight;
            if (o.hasChildNodes()) { o.removeChild(o.firstChild); }
            o.appendChild(img);
            if (typeof(onload)==='function') {
                img.onload = onload;
            }
            else o.onload = undefined;
        };

        function bgImageLoaded() {
            if (++bgLoaded == numCams) {
                bgLoaded = 0;
                var time = (new Date()).getTime();
                var diff = time-lastAnimate;
                console.log((time-loadTime)/1000 + " seconds load cam bg imgs");
                setTimeout(function() {
                    allCams.fg.className += " cam-fade";
                },((maxRefresh-diff)>0?maxRefresh-diff:0));
            }
        };

        function fgImageLoaded() {
            if (++fgLoaded == numCams) {
                fgLoaded = 0;
                for (var i=0; i<cams.length; i++) {
                    loadImg(cams[i].bg,cams[i].url,bgImageLoaded);
                }
                allCams.bg.style.opacity = 1;
                var time = (new Date()).getTime();
                console.log((time-loadTime)/1000 + " seconds load cam fg imgs");
                loadTime = time;
            }
        };

        function swapCams(e) {
            var temp = allCams.fg;
            allCams.fg = allCams.bg;
            allCams.bg = temp;

            allCams.bg.className = "allcams-bg";

            allCams.bg.style.opacity = 1;
            for (var i=0; i<cams.length; i++) {
                var cam = cams[i];
                var temp = cam.fg;
                cam.fg = cam.bg;
                cam.bg = temp;

                loadImg(cam.bg,cam.url,bgImageLoaded);
                cam.bg.className = "cam-bg";
                cam.fg.className = "cam-fg";
            }
            allCams.fg.className = "allcams-fg";
            var time = (new Date()).getTime();
            console.log((time-lastAnimate)/1000 + " seconds since last cam animation");
            loadTime = lastAnimate = time;
        };

        for (var i=0; i<numCams; i++) {
            var cam = { fg: document.createElement('div'),
                        bg: document.createElement('div'),
                        url: camUrl+(i+1),
                        num: i };

            for (var v in { "fg":"", "bg":"" }) {
                cam[v].className = "cam-"+v;
                cam[v].style.width = bgWidth;
                cam[v].style.height = bgHeight;
                allCams[v].appendChild(cam[v]);
            }

            loadImg(cam.fg,cam.url,fgImageLoaded);
            cams.push(cam);
        }
        loadTime = lastAnimate = (new Date()).getTime();

        allCams.bg.style.marginLeft = allCams.fg.style.marginLeft = camDiv.offsetWidth-bgWidth-(bgWidth+5)*(numCams-1);

        var addSwapListener = function(e,f) {
            e.addEventListener("animationiteration", f, false);
            e.addEventListener("webkitAnimationIteration", f, false);
        }

        addSwapListener(allCams.fg,swapCams);
        addSwapListener(allCams.bg,swapCams);
    }
    if (window.attachEvent)
        window.attachEvent('onload', async_load);
    else
        window.addEventListener('load', async_load, false);
})();
