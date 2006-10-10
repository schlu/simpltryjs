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
Simpltry.BaseTooltip = {};
Simpltry.BaseTooltip.DefaultOptions  = {
	offsetLeft: 0,
	offsetTop: 0,
	direction: "below"
}
Simpltry.BaseTooltip.prototype = {
	initialize: function(element, options) {
		this.setOptions(options);
		this.element = $(element);
		if(this.options.tooltip) {
		    this.popup = $(this.options.tooltip);
		} else {
    		this.popup = $(this.element.id + '_tooltip');
		}
		if(!Simpltry.bodyWidth) Simpltry.calculateBodyWidth();
		this.setPopupPosition();
		this.attachEvents();
	},
	setOptions: function(options) {
		this.options = $H(Simpltry.BaseTooltip.DefaultOptions);
		Object.extend(this.options, options || {});
	},
	setPopupPosition: function() {
		var offset = Position.cumulativeOffset(this.element);
		var leftPosition = 0;
		var topPosition = 0;
		if(this.options.direction == "right") {
			leftPosition = offset[0] + this.element.clientWidth;
			topPosition = offset[1];
		} else if(this.options.direction == "below") {
			leftPosition = offset[0];
			topPosition = offset[1] + this.element.offsetHeight;
		}
		leftPosition += this.options.offsetLeft;
		topPosition += this.options.offsetTop;
		var distanceFromScreenRight = Simpltry.bodyWidth - (offset[0] + Element.getDimensions(this.popup).width + 8);
		if(distanceFromScreenRight < 0) leftPosition += distanceFromScreenRight;
		Element.setStyle(this.popup, {position: 'absolute', left: leftPosition + "px", top: topPosition + "px"});
	},
	attachEvents: Prototype.emptyFunction,
	display: function() {
	    this.setPopupPosition();
		this.popup.show();
	},
	close: function() {
		this.popup.hide();
	}
}

Simpltry.ClickTooltip = Class.create();
Object.extend(Object.extend(Simpltry.ClickTooltip.prototype, Simpltry.BaseTooltip.prototype),  {
	attachEvents: function() {
		this.element.onclick = this.display.bind(this);
	}
});

Simpltry.PopupTooltip = Class.create();
Object.extend(Object.extend(Simpltry.PopupTooltip.prototype, Simpltry.BaseTooltip.prototype),  {
	attachEvents: function() {
		this.element.onmouseover = this.elementMouseOver.bindAsEventListener(this);
		this.element.onmouseout = this.elementMouseOut.bindAsEventListener(this);
		this.popup.onmouseover = this.popupMouseOver.bindAsEventListener(this);
		this.popup.onmouseout = this.popupMouseOut.bindAsEventListener(this);
	},
	elementMouseOver: function(e) {
		this.element.addClassName('toolTipMouseOver');
		setTimeout(this.checkMouseOver.bindAsEventListener(this), 250);
	},
	popupMouseOver: function(e) {
		this.popup.addClassName('toolTipMouseOver');
		setTimeout(this.checkMouseOver.bindAsEventListener(this), 250);
	},
    	elementMouseOut: function(e) {
		this.element.removeClassName('toolTipMouseOver');
		setTimeout(this.checkMouseOut.bindAsEventListener(this), 250);
	},
	popupMouseOut: function(e) {
		this.popup.removeClassName('toolTipMouseOver');
		setTimeout(this.checkMouseOut.bindAsEventListener(this), 250);
	},
	checkMouseOut: function() {
		if(!this.popup.hasClassName('toolTipMouseOver') && !this.element.hasClassName('toolTipMouseOver')) this.close();
	},
	checkMouseOver: function() {
		if(this.popup.hasClassName('toolTipMouseOver') || this.element.hasClassName('toolTipMouseOver')) this.display();
	}
});

Object.extend(Simpltry, {
	calculateBodyWidth: function() {
	   Simpltry.bodyWidth = Element.getDimensions(document.body).width;
	}
});

Simpltry.BaseTooltip.setupWidget = function(element, options) {
    if(options['tooltipText']) {
        var tooltip = Builder.node('div', {style: "display:none"}, options['tooltipText']);
        document.body.appendChild(tooltip);
        options['tooltip'] = tooltip;
        delete(options['tooltipText']);
    }
    if(!options['tooltip']) {
        options['tooltip'] = element.next();
    }
};

if(Simpltry.Widgets) {
    Simpltry.Widgets.register("popup_tooltip", function(element, options) {
        Simpltry.BaseTooltip.setupWidget(element, options);
        new Simpltry.PopupTooltip(element, options);
    });
    Simpltry.Widgets.register("click_tooltip", function(element, options) {
        Simpltry.BaseTooltip.setupWidget(element, options);
        new Simpltry.ClickTooltip(element, options);
    });
}