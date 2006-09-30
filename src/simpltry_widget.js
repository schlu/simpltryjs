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

Simpltry.Widgets = $H();

Simpltry.registerWidget = function(type, callBack) {
    Simpltry.Widgets[type] = callBack;
}

Simpltry.attachWidgets = function(event) {
    var elements = $A(document.getElementsByTagName('*'));
    elements.each(function(element, i) {
        if(element.getAttribute('simpltry_widget')) {
            var simpltryType = element.getAttribute('simpltry_widget');
            if(!element.id) element.id = simpltryType + i;
            var options = {};
            if(element.getAttribute('simpltry_options')) {
                eval("options = {" + element.getAttribute('simpltry_options') + "}");
            }
            if(Simpltry.Widgets[simpltryType]) {
                Simpltry.Widgets[simpltryType](element, options);
            }
        }
    });
}

Event.observe(window, 'load', Simpltry.attachWidgets, false);