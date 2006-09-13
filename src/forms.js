/*
Created On: 09/12/2006
Created By: Nicholas Schlueter -- http://www.simpltry.com
version: .5

This is freely available for noncommercial and commerical use.  I am not responsible for support and 
if this script causes harm directly or indirectly I am not liable for any damages.  Using any part of this 
Code means you agree to the aformentioned conditions.  Please alter this code however you see fit. I do 
ask that you leave every from this point up in tact.

Dependencies: 
    Prototype: 1.5.0_rc0+
    script.aculo.us: 1.6.1+
        -builder
    Simpltry
        -tooltip
        -date_picker
*/


Simpltry.setupForms = function(event) {
    var body = $$("body")[0];
    $A($$("input.simpltryDateField")).each(function(field, i) {
        if(!field.id) field.id = "simpltryDateField" + i;
        field.autoComplete = "false";
        field.addClassName("tooltipRight");
        var popup = Builder.node("div", {id: field.id + "_tooltip", style: "display:none;"}, ["test"]);
        body.appendChild(popup);
        var toolTip = new Simpltry.ClickTooltip(field);
        new Simpltry.DatePicker(popup, {
            onSelect: function(year, month, day) {
                field.value = month + "/" + day + "/" + year;
                toolTip.close();
            },
            dateString: (field.value != "" ? field.value : null)
        });
    });
};

Event.observe(window, "load", Simpltry.setupForms, false);