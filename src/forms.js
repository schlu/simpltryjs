/*
Created On: 09/12/2006
Created By: Nicholas Schlueter -- http://www.simpltry.com
version: .5

This is freely available for noncommercial and commerical use.	I am not responsible for support and 
if this script causes harm directly or indirectly I am not liable for any damages.	Using any part of this 
Code means you agree to the aformentioned conditions.  Please alter this code however you see fit. I do 
ask that you leave every from this point up in tact.

Dependencies: 
	Prototype: 1.5.0_rc0+
*/

if(!Simpltry) var Simpltry = {};
Simpltry.Form = {};
Simpltry.Form.MoveToNextField = Class.create();
Simpltry.Form.MoveToNextField.maxFieldId = 0;

Simpltry.Form.MoveToNextField.prototype = {
	initialize: function(field) {
		this.field = $(field);
		if(!this.field.id) this.field.id = "simpltryMoveToNextField" + Simpltry.Form.MoveToNextField.maxFieldId++;
		Event.observe(this.field, "keyup", this.onKeyUp.bindAsEventListener(this), false);
		this.field.setAttribute('autocomplete', 'off');
	},
	onKeyUp: function(event){
		if(this.field.maxLength == $F(this.field).length && event.keyCode != Event.KEY_BACKSPACE && event.keyCode != Event.KEY_DELETE) {
			var nextMatch = false;
			$A(document.getElementsByTagName("*")).each(function(element) {
				if(nextMatch && ((element.tagName == "INPUT" && element.type != "hidden") || element.tagName == "TEXTAREA" || element.tagName == "SELECT")) {
					Field.activate(element);
					
					throw $break;
				} else if(element == this.field) {
					nextMatch = true;
				}
			}.bind(this));
		}
	}
};

if(Simpltry.Widgets) {
    Simpltry.Widgets.register('move_to_next', function(element, options) {
        if(element.type == "text" && element.maxLength) new Simpltry.Form.MoveToNextField(element);
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
            $(autoCompleteElement);
            autoCompleteElement.setStyle({display:'none'});
            autoCompleteElement.addClassName("autocomplete");
            document.body.appendChild(autoCompleteElement);
        }
        new Ajax.Autocompleter(element, autoCompleteElement, url, options);
    });
}