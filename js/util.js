define(function() {

  /*
    Extend an object with deep copy (by default).
   */
  var extend = function(orig, exts, shallow) {
    var exts = ( exts instanceof Array ? exts : [exts] );
    for (var i=0; i<exts.length; i++)
      for (var key in (exts[i] || {}))
        /*
          Simple assignment for non-objects, arrays are concatenated,
          and other objects extend into new literals
         */
        orig[key] = ( shallow || typeof(orig[key])!=='object' ? exts[i][key] :
                      ( exts[i][key] instanceof Array ? exts[i][key].concat(orig[key]) :
                        extend({},[orig[key],exts[i][key]]) ) );
    return orig;
  };

  /*
    Combine several objects into a new literal.
   */
  var extendCopy = function() {
    return extend({},Array.prototype.slice.call(arguments));
  };

  /*
    Given a class and arguments return a new instantiation of that class.
   */
  var construct = function(Class, args) {
    var Object=function(){Class.apply(this,args)};
    Object.prototype = Class.prototype;
    return new Object();
  };

  /*
    Given some object literals extend to an Object Class with generic constructor.
   */
  var classy = function() {
    var Object = function() {
      var args = Array.prototype.slice.call(arguments);
      /* If we are not in a local context (not called with new) then instantiate
         Object using new, through a construct to apply given arguments */
      if (this.__proto__.constructor !== Object) return construct(Object,args);
      /* If we have an init function then apply to init */
      else if (this.init) this.init.apply(this,args);
    };
    /* Now extend our Object's prototype given some literals */
    extend(Object.prototype,Array.prototype.slice.call(arguments));
    return Object;
  };

  /*
    Given some configuration apply to array of __init__ functions which take a config.
   */
  var extendInit = {
    init: function(config) {
      this.config = config = config || this.config || this.defaults;
      for (var i=0; this.__init__ && i<this.__init__.length; i++)
        this.__init__[i].call(this,config);
    }
  };

  /*
    Given some query and callbacks construct a module url and require.
   */
  var importModule = function(config) {
    config.fullurl = config.baseurl + (config.id || "");
    var first = true;
    for (var key in config.qstrings) {
      config.fullurl += ( first ? '?' : '&' );
      config.fullurl += key + '=' + config.qstrings[key];
      first = false;
    }
    require([config.fullurl],
            config.callback,
            config.failback);
  };

  /*
    Basic scaffolding for importing a remote module.
   */
  var importer = extend({
    defaults: {
      baseurl:  undefined,
      id:       undefined,
      qstrings: undefined,
      callback: undefined,
      failback: undefined,
    },
    importModule: importModule,
    __init__: [importModule],
  },[extendInit]);

  /*
    Return a literal util object as we have no state,
    and hence no need to instantiate.
   */
  return {
    extend:     extend,
    extendCopy: extendCopy,
    construct:  construct,
    classy:     classy,
    extendInit: extendInit,
    importer:   importer,
  };

});
