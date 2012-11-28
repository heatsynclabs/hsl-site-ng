/*
 * Copyright (C) 2012 Joel Sutherland, Erik Wilson
 *
 * Licenced under the MIT license
 * http://www.newmediacampaigns.com/page/jquery-flickr-plugin
 *
 * Removed template functionality and JQuery dependency, modified for AMD/RequireJS -EW
 */

define(['util'], function(util) {

  return util.classy( util.importer, {
    defaults: {
      baseurl: 'http://api.flickr.com/services/feeds/',
      id: 'photos_public.gne',
      limit: 20,
      qstrings: {
        lang: 'en-us',
        format: 'json',
        jsoncallback: 'define',
      },
      cleanDescription: true,
      itemCallback: undefined,
      doneCallback: undefined,
    },

    __init__: [function(config){
      var parent = this;
      config.callback=config.callback||function(data){
        for ( var i = 0; data && data.items && i<data.items.length; i++) {
          var item = data.items[i];
          if(i<config.limit){

            if(config.cleanDescription && item.description.match(/<p>.*?<\/p>/g))
              item.description=item.description.replace('<p>','').replace('</p>','');

            var imgs = ['_s','_t','_m','','_b'];
            for (var k=0; k<imgs.length; k++)
              item['image'+imgs[k]]=item.media.m.replace('_m',imgs[k]);
            delete item.media;

            if (typeof(config.itemCallback)==='function')
              config.itemCallback.call(parent,item);
          }
        }
        if (typeof(config.doneCallback)==='function')
          config.doneCallback.call(parent,data);
      };
    }],
  });
});
