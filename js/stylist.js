define(function (){
  // Maybe require domReady module instead of doing window.onload

  if (!document.styleSheets || document.getElementsByTagName("head").length==0) {
    console.log("unable to load document stylesheets or head element");
    return;
  }

  var stylesheet;
  var mediaType;
  var rules;

  var loadEvent = function(f) {
/*
    if (document.readyState==='complete') f();
    else if (window.attachEvent) window.attachEvent('onload',f);
    else window.addEventListener('load',f,false);
*/
    //domReady(f);
    f();
  };

  loadEvent(function() {
    if (typeof(styleSheet)==='undefined') {
      var styleSheetElement = document.createElement("style");
      styleSheetElement.title = "stylist";
      styleSheetElement.type = "text/css";
      document.getElementsByTagName("head")[0].appendChild(styleSheetElement);

      for (var i=0; typeof(styleSheet)==='undefined' && i<document.styleSheets.length; i++) {
        if (document.styleSheets[i].title == "stylist")
          styleSheet = document.styleSheets[i];
      }

      mediaType = typeof(styleSheet.media);
      rules = (mediaType==='string'?styleSheet.rules:
               (mediaType==='object'?styleSheet.cssRules:[]));

      if (typeof(styleSheet.addRule)==='undefined') {
        styleSheet.addRule = function(selector,style,position) {
          this.insertRule(selector+"{"+style+"}",position)
        };
      }

    }
  });

  return {

    onLoad: function(f) {
      loadEvent(f);
    },

    replaceStyle: function(selector,style) {
      var found = false;
      for (var i=0; !found && i<rules.length; i++) {
        if (rules[i].selectorText &&
            rules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
          rules[i].style.cssText = style;
          found = true;
        }
      }
      return found;
    },

    addStyle: function(selector, style) {
      styleSheet.addRule(selector,style,rules.length);
    },

    addReplaceStyle: function(selector, style) {
      if (!this.replaceStyle(selector,style))
        this.addStyle(selector,style);
    },

    composite: function(data) {
      var css=[];
      for (var i=0; i<data.length; i++)
        css.push(data[i].join(" "));
      return css.join(", ")+";";
    },
  };
});
