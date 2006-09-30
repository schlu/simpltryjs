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

if(!Simpltry) var Simpltry;

Simpltry.attachWidgets = function(event) {
    var elements = $A(document.getElementsByTagName('*'));
    elements.each(function(element, i) {
        if(element.getAttribute('simpltry_type')) {
            var simpltryType = element.getAttribute('simpltry_type');
            if(!element.id) element.id = simpltryType + i;
            eval('options = ' + element.getAttribute('simpltry_options') + ' || {}');
            if(simpltryType == 'color_picker') {
                new Simpltry.ColorPicker(element.id, options);
            } else if(simpltryType == 'rating') {
                new Simpltry.RatingControl(element.id, options);
            }
        }
    });
}

Event.observe(window, 'load', Simpltry.attachWidgets, false);