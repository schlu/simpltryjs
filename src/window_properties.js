/*
Copyright (c) 2006-2007 Nicholas Schlueter (http://widgets.simpltry.com, http://simpltry.com)

Simpltry Widgets is freely distributable under the terms of an MIT-style license.
For details, see the MIT-LICENSE file in the distribution

Dependencies: 
  Prototype: 1.6.0_rc1+
*/

if(!Simpltry) var Simpltry = {};

document.viewport = Object.extend(document.viewport, {
  getDimensions: function() {
    var dimensions = { };
    $w('width height').each(function(d) {
      var D = d.capitalize();
      if (Prototype.Browser.Opera) dimensions[d] = document.body['client' + D]; 
      else if (Prototype.Browser.WebKit) dimensions[d] = self['inner' + D]; 
      else dimensions[d] = document.documentElement['client' + D];
    });
    return dimensions;
  }
});

Simpltry.WindowProperties = {
  getContentSize: function(ignore) {
    if(ignore) {
        ignore.hide();
    }
    var bodyDims = $(document.body).getDimensions();
    var browserSize = document.viewport.getDimensions();
    if(bodyDims.height > browserSize.height) browserSize.height = bodyDims.height;
    if(bodyDims.width > browserSize.width) browserSize.width = bodyDims.width;
    if(ignore) {
        (function(){ignore.show();}).defer();
    }
    return browserSize;
  }
};