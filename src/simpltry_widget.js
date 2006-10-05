/*
Created On: 09/30/2006
Created By: Nicholas Schlueter -- http://www.simpltry.com
version: .5

This is freely available for noncommercial and commerical use.	I am not responsible for support and 
if this script causes harm directly or indirectly I am not liable for any damages.	Using any part of this 
Code means you agree to the aformentioned conditions.  Please alter this code however you see fit. I do 
ask that you leave from this point up in tact.

Dependencies: 
	Prototype: 1.5.0_rc0+
*/

if(!Simpltry) var Simpltry = {};

Simpltry.Widgets = Class.create();
Simpltry.Widget = $H();

Object.extend(Simpltry.Widgets, {
    register: function(type, callBack) {
        Simpltry.Widget[type] = callBack;
    },
    attach: function(event, element) {
        element = element || document;
        var elements = $A($(element).getElementsByTagName('*'));
        elements.each(function(element, i) {
            if(element.getAttribute('simpltry_widget')) {
                var simpltryType = element.getAttribute('simpltry_widget');
                if(!element.id) element.id = simpltryType + i;
                var options = {};
                if(element.getAttribute('simpltry_options')) {
                    eval("options = {" + element.getAttribute('simpltry_options') + "}");
                }
                if(Simpltry.Widget[simpltryType]) {
                    Simpltry.Widget[simpltryType](element, options);
                }
            }
        });
    },
    attachPartial: function(element) {
        Simpltry.Widgets.attach(null, element);
    },
    updateComplete: function(transport, object) {
        Simpltry.Widgets.attachPartial(object);
    }
});

//make s.a.u InPlaceEditor a widget
Simpltry.Widgets.register('inplace_editor', function(element, options) {
    var url = options['url'];
    delete(options['url']);
    new Ajax.InPlaceEditor(element, url, options);
});

//make s.a.u Ajax.Autocompleter a widget
Simpltry.Widgets.register('ajax_autocompleter', function(element, options) {
    var url = options['url'];
    delete(options['url']);
    var autoCompleteElement = options['autoCompleteElement'];
    delete(options['autoCompleteElement']);
    var autoComplete = null;
    if(autoCompleteElement) {
        autoCompleteElement = $(autoCompleteElement);
    } else {
        autoCompleteElement = document.createElement('div');
        autoCompleteElement.setStyle({'display':'none'});
        autoCompleteElement.addClassName("autocomplete");
        document.body.appendChild(autoCompleteElement);
    }
    new Ajax.Autocompleter(element, autoCompleteElement, url, options);
});

Event.observe(window, 'load', Simpltry.Widgets.attach, false);