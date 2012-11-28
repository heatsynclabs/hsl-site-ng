define(
  ['util','Flickr','AniMate'],
  function(util,Flickr,AniMate){

    var flickrHistory = [];
    var flickrImages = [];
    var flickrHistoryMaxLen = 10;

    return {

      defaults: {
        imgDiv: undefined,
        imgNextDiv: undefined,
        textDiv: undefined,
        galleryLink: undefined,
        currUrl: undefined,
      },

      swapper: function(divA,divB) {
        console.log("inside of swapper");
        if (flickrImages.length>0) {
          var next = this.nextFlickr();
          divB.style.opacity=1;
          divB.style.background = "url("+flickrImages[next].image_b+") no-repeat 50%";
          divB.title = flickrImages[next].title;
          divB.link = flickrImages[next].link;
          this.labelTimeout(divB);
        }
      },

      // Generate next unique index
      nextRandom: function(history,size) {
        var num;
        // Recycle oldest number if our history is equal to max size and already generated
        if (history.length==size && size>0 && (num=history[0])!=undefined) {}
        // Or keep generating random numbers until finding one that isn't in history
        else while (history.indexOf(num=Math.floor(Math.random()*size))!=-1) {}
        // Add new number to history and remove oldest
        history.push(num);
        history.shift();
        return num;
      },

      nextFlickr: function() {
        return this.nextRandom(flickrHistory,flickrImages.length);
      },

      labelTimeout: function(nextDiv) {
        var config = this.config;
        setTimeout(function(){
          config.textDiv.innerHTML = "<h4>" + nextDiv.title + "</h4>";
          config.currUrl = nextDiv.link;
          config.galleryLink.href = config.currUrl;
        },8500);
      },


      init: function(config){

        this.config = config || config || this.config || this.defaults;
        var parent = this;
        var flickr = new Flickr( util.extendCopy( Flickr.prototype.defaults, {
          limit: flickrHistoryMaxLen,
          qstrings: {
            tags: 'publish',
            id: '60827818@N07',
          },
          stuff: ['abcdefg'],
          useTemplate: false,
          itemCallback: function(item){
            console.log("pushing flickr image...");
            flickrImages.push(item);
          },
          doneCallback: function(data) {
            console.log(flickr);
            if (flickrImages.length>0) {
              // Define flickrHistory length no longer than number of images (if maxLen is within 1 of len imgs then use len imgs)
              flickrHistory.length = ( flickrHistoryMaxLen>=flickrImages.length-1 ? flickrImages.length : flickrHistoryMaxLen );

              // Generate index for current & next indices
              var curr = parent.nextFlickr();
              var next = parent.nextFlickr();

              config.imgDiv.style.background = "url("+flickrImages[curr].image_b+") no-repeat 50%";
              config.imgNextDiv.style.background = "url("+flickrImages[next].image_b+") no-repeat 50%";

              config.textDiv.innerHTML = "<h4>"+flickrImages[curr].title+"</h4>";
              config.imgNextDiv.title = flickrImages[next].title;
              config.imgNextDiv.link = flickrImages[next].link;

              config.currUrl = flickrImages[curr].link;
              config.galleryLink.href = config.currUrl;
              //aniMateDiv.onclick = function() { window.location = currUrl; };

              parent.labelTimeout(config.imgNextDiv);
            }
            setTimeout(function(){config.imgNextDiv.style.opacity=1;},3500);
            config.imgDiv.className = "gallery-foreground fade-test";

            AniMate(util.extendCopy(AniMate.prototype.defaults,{
              divA: config.imgDiv,
              divB: config.imgNextDiv,
              classA: config.imgDiv.className,
              classB: config.imgNextDiv.className,
              loadNextDiv: function(){
                parent.swapper.apply(parent,arguments);
              },
            }));
            //console.log(aniMate.config);
          }
        }));
      },
    };
  }
);
