define(['util'], function(util) {

  var animation = false,
  animationstring = 'animation',
  keyframeprefix = '',
  domPrefixes = ['Webkit','Moz','O','ms','Khtml'],
  prefix  = '';

  if( document.body.style.animationName ) { animation = true; }

  if( animation === false ) {
    for( var i=0; !animation && i<domPrefixes.length; i++ ) {
      prefix = domPrefixes[ i ];
      if( document.body.style[ prefix+'AnimationName' ] !== undefined ) {
        animationstring = prefix + 'Animation';
        keyframeprefix = '-' + prefix.toLowerCase() + '-';
        animation = true;
      }
    }
  }

  return util.classy( util.extendInit, {
    defaults: {
      animate: animation,
      prefix: keyframeprefix,
      divA: undefined,
      divB: undefined,
      classA: '',
      classB: '',
      loadNextDiv: function(){
        console.log("override loadNextDiv");
      },
    },

    __init__: [function(config) {

      if (!config.divA || !config.divB) {
        console.log("incomplete configuration:");
        console.log(config);
        return;
      }

      // Swap styles & variables upon animation step completion
      var swapper = function(e) {
        var tmp = config.divB;
        config.divB = config.divA;
        config.divA = tmp;
        console.log(config);
        config.divB.className = config.classB;
        config.divA.className = config.classA;
        config.loadNextDiv(config.divA,config.divB);
      };

      var addSwapListener = function(e) {
        e.addEventListener("animationiteration", swapper, false);
        e.addEventListener("webkitAnimationIteration", swapper, false);
      };

      addSwapListener(config.divA);
      addSwapListener(config.divB);

      config.divA.className = config.classA;

    }],
  });
});
