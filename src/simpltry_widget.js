/*
Copyright (c) 2006-2007 Nicholas Schlueter (http://widgets.simpltry.com, http://simpltry.com)

Simpltry Widgets is freely distributable under the terms of an MIT-style license.
For details, see the MIT-LICENSE file in the distribution

Dependencies: 
	Prototype: 1.5.1+
*/

if(!Simpltry) var Simpltry = {};

Simpltry.Widgets = Class.create();
Simpltry.Widgets.widgetAttribute = "simpltry_widget";
Simpltry.Widgets.optionsAttribute = "simpltry_options";
Simpltry.Widget = $H();

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

Event.observe(window, 'load', Simpltry.Widgets.attach, false);