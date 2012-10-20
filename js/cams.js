define(['AniMate'],function(AniMate){

  var cams = [];
  var bgWidth = 160;
  var bgHeight = 120;
  var bgSize =  bgWidth + " " + bgHeight;
  var numCams = 3;
  var borderWidth = 3;
  var repeatDelayMin = 250;
  var repeatDelayMax = 10000;
  var repeatDelay = repeatDelayMin;

  var camDiv = document.getElementById("cameras");
  var divWidth = bgWidth + 2*borderWidth;

  var netinfo = document.getElementById("netinfo-span");


  var camUrl = "http://live.heatsynclabs.org/snapshot.php?camera=";
  //var camUrl = "http://thingiverse-production.s3.amazonaws.com/renders/95/5e/69/37/a8/nerf-cartridge_preview_large.jpg?";
  var intranetUrl = "http://intranet.heatsynclabs.org:1337/data.php";

  var maxRefresh = 14000;

  var allCams = {};

  var fgLoaded = 0;
  var bgLoaded = 0;
  var loadTime = 0;
  var lastAnimate = 0;

  allCams.fg = document.createElement('div');
  allCams.bg = document.createElement('div');
  allCams.fg.className = "allcams-fg";
  allCams.bg.className = "allcams-bg";

  camDiv.appendChild(allCams.fg);
  camDiv.appendChild(allCams.bg);

  camDiv.style.height = bgHeight + 2*borderWidth;

  return {
    defaults: {
    },

    loadImg: function(o,url,onload,className) {
      var img = document.createElement('img');
      img.src = url+"&date="+(new Date()).getTime();
      img.width = bgWidth;
      img.height = bgHeight;
      if (o.hasChildNodes()) { o.removeChild(o.firstChild); }
      o.appendChild(img);
      var parent = this;
      if (typeof(onload)==='function') img.onload = function(){onload.call(parent,this)};
      if (className) img.className = className;
      img.onerror = function() {
        console.log("fire z missiles!");
        repeatDelay=(2*repeatDelay>repeatDelayMax?repeatDelayMax:2*repeatDelay);
        setTimeout(function(){parent.loadImg(o,url,function(){onload.call(parent,this)},className);},repeatDelay);
      };
    },

    bgImageLoaded: function(img) {
      if (++bgLoaded == numCams) {
        bgLoaded = 0;
        var time = (new Date()).getTime();
        var diff = time-lastAnimate;
        console.log((time-loadTime)/1000 + " seconds load cam bg imgs");
        setTimeout(function() {
          allCams.fg.className += " cam-fade";
        },((maxRefresh-diff)>0?maxRefresh-diff:0));
      }
    },

    fgImageLoaded: function(img) {
      img.className += " visible-cam";
      if (++fgLoaded == numCams) {
        fgLoaded = 0;
        for (var i=0; i<cams.length; i++) {
          this.loadImg(cams[i].bg,cams[i].url,this.bgImageLoaded);
        }
        allCams.bg.style.opacity = 1;
        var time = (new Date()).getTime();
        console.log((time-loadTime)/1000 + " seconds load cam fg imgs");
        loadTime = time;
      }
    },

    fml: function(i,z){
      return (i==0?"first":(i<z-1?"middle":"last"))
    },

    swapCams: function() {
      var temp = allCams.fg;
      allCams.fg = allCams.bg;
      allCams.bg = temp;

      allCams.bg.className = "allcams-bg";

      allCams.bg.style.opacity = 1;
      for (var i=0; i<numCams; i++) {
        var cam = cams[i];
        var temp = cam.fg;
        cam.fg = cam.bg;
        cam.bg = temp;

        this.loadImg(cam.bg,cam.url,this.bgImageLoaded);
        cam.bg.className = "cam-bg cam-"+this.fml(i,numCams)+"-bg";
        cam.fg.className = "cam-fg cam-"+this.fml(i,numCams)+"-fg";
      }
      allCams.fg.className = "allcams-fg";
      var date = new Date();
      var time = date.getTime();
      console.log((time-lastAnimate)/1000 + " seconds since last cam animation on " + date);
      loadTime = lastAnimate = time;
    },

    init: function(config) {
      for (var i=0; i<numCams; i++) {
        var cam = { fg: document.createElement('div'),
                    bg: document.createElement('div'),
                    url: camUrl+(i+1),
                    num: i };

        for (var v in allCams) {
          cam[v].className = "cam-"+v+" cam-"+this.fml(i,numCams)+"-"+v + " cam-"+i+"-"+v;
          cam[v].style.width = bgWidth;
          cam[v].style.height = bgHeight;
          allCams[v].appendChild(cam[v]);
        }
        this.loadImg(cam.fg,cam.url,this.fgImageLoaded,"hidden-cam");
        cams.push(cam);
      }
      loadTime = lastAnimate = (new Date()).getTime();

      allCams.bg.style.marginLeft = allCams.fg.style.marginLeft =
        camDiv.offsetWidth-(bgWidth+borderWidth)*numCams+borderWidth;

      var addSwapListener = function(e,f) {
        e.addEventListener("animationiteration", f, false);
        e.addEventListener("webkitAnimationIteration", f, false);
      };

      var parent = this;
      addSwapListener(allCams.fg,function(){parent.swapCams()});
      addSwapListener(allCams.bg,function(){parent.swapCams()});
    },

  };
});
