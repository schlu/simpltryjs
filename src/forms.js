/*
Copyright (c) 2006-2007 Nicholas Schlueter (http://widgets.simpltry.com, http://simpltry.com)

Simpltry Widgets is freely distributable under the terms of an MIT-style license.
For details, see the MIT-LICENSE file in the distribution

Dependencies: 
	Prototype: 1.5.1+
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