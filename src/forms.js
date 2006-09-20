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
	script.aculo.us: 1.6.1+
		-builder - only for datefield binding
	Simpltry
		-tooltip - only for datefield binding
		-date_picker - only for datefield binding
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
}

Simpltry.setupForms = function(event) {
	var body = $$("body")[0];
	$A($$("input.simpltryDateField")).each(function(field, i) {
		if(!field.id) field.id = "simpltryDateField" + i;
		field.autoComplete = "false";
		field.addClassName("tooltipRight");
		var popup = Builder.node("div", {id: field.id + "_tooltip", style: "display:none;"}, ["test"]);
		body.appendChild(popup);
		var toolTip = new Simpltry.ClickTooltip(field, {offsetLeft:9});
		new Simpltry.DatePicker(popup, {
			onSelect: function(year, month, day) {
				field.value = month + "/" + day + "/" + year;
				toolTip.close();
			},
			onCancel: function() {
				toolTip.close();
			},
			showCancel: true,
			dateString: (field.value != "" ? field.value : null)
		});
	});
	$A($$("input.simpltryMoveToNextField")).each(function(field, i) {
		if(field.type == "text" && field.maxLength) new Simpltry.Form.MoveToNextField(field);
	});
};

//used for datefield binding
Event.observe(window, "load", Simpltry.setupForms, false);