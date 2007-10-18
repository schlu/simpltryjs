/*
Copyright (c) 2006-2007 Nicholas Schlueter (http://widgets.simpltry.com, http://simpltry.com)

Simpltry Widgets is freely distributable under the terms of an MIT-style license.
For details, see the MIT-LICENSE file in the distribution

Dependencies: 
  Prototype: 1.6.0_rc1+
  script.aculo.us: 1.8.0_pre1+
*/

if(!Simpltry) var Simpltry = {};

Simpltry.Widgets = {};
Simpltry.Widgets.widgetAttribute = "simpltry_widget";
Simpltry.Widgets.optionsAttribute = "simpltry_options";
Simpltry.Widget = {};

Object.extend(Simpltry.Widgets, {
  register: function(type, callBack) {
    Simpltry.Widget[type] = callBack;
  },
  attach: function(event, parent) {
    parent = parent || document;
    var elements = $A($(parent).getElementsByTagName('*'));
    for(var i = 0; i < elements.length; i++) {
      element = elements[i];
      if(element.getAttribute(Simpltry.Widgets.widgetAttribute)) {
        var simpltryType = element.getAttribute(Simpltry.Widgets.widgetAttribute);
        if(!element.id) element.id = simpltryType + i;
        var options = {};
        if(element.getAttribute(Simpltry.Widgets.optionsAttribute)) {
          eval("options = {" + element.getAttribute(Simpltry.Widgets.optionsAttribute) + "}");
        }
        if(Simpltry.Widget[simpltryType]) {
          Simpltry.Widget[simpltryType](element, options);
        }
      }
    }
  },
  attachPartial: function(element) {
    Simpltry.Widgets.attach(null, element);
  },
  updateComplete: function(transport, object) {
    Simpltry.Widgets.attachPartial(object);
  }
});

Event.observe(document, 'dom:loaded', Simpltry.Widgets.attach);