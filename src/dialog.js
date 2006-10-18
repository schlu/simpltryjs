/*
Created On: 05/15/2006
Last Updated On: 08/23/2006
Created By: Nicholas Schlueter -- http://www.simpltry.com
Version: 0.6

This is freely available for noncommercial and commerical use.	I am not responsible for support and 
if this script causes harm directly or indirectly I am not liable for any damages.	Using any part of this 
Code means you agree to the aformentioned conditions.  Please alter this code however you see fit. I do 
ask that you leave every from this point up in tact.

Dependencies: 
	Prototype: 1.5.0_rc0+
	script.aculo.us: 1.6.1+
		-effects
		-dragdrop
	Simpltry
		-window_properties.js
*/
if(!Simpltry) var Simpltry = {};


Simpltry.Dialog = {};
Simpltry.Dialog.State = {
	activeDialog: [],
	opaqueDivUp: null,
	hasActiveDialogs: function() {return Simpltry.Dialog.State.activeDialog.length > 0},
	highestIndex: 1000,
	highestId: 0,
    setOpaqueSize: function() {
        var contentSize = Simpltry.WindowProperties.getContentSize(Simpltry.Dialog.State.opaqueDialog);
        Element.setStyle(Simpltry.Dialog.State.opaqueDialog, {width: contentSize.width + "px", height: contentSize.height + "px"});
    }
};
Simpltry.Dialog.css = {
	title: "simpltryDialogTitle",
	dialog: "simpltryDialog"
};
Simpltry.Dialog.DefaultOptions = {
	opacity: .6,
	width: 300,
	title: "Confirm?",
	makeDraggable: true,
	repositionOnScroll: true,
	displayTitle: true,
	height:null
};

Simpltry.Dialog.removeAll = function() {Simpltry.Dialog.State.activeDialog.each(function(dialog){dialog.removeDialog()})};

Simpltry.Dialog.Button = Class.create();
Simpltry.Dialog.Button.prototype = {
	initialize: function(buttonText, dialogBox, options) {
		this.options = Object.extend({onClick: Prototype.emptyFunction}, options || {});
		this.element = document.createElement('input');
		this.element.type = 'submit';
		this.element.value = buttonText;
		this.element.onclick = function(event) {this.options.onClick(event);dialogBox.removeDialog();return false;}.bindAsEventListener(this);
	}
};
Simpltry.Dialog.Base = {};
Simpltry.Dialog.Base.prototype = {
    initialize: function(options, buttons){
        this.setup(options, buttons);
        this.show();
    },
	_show: Prototype.emptyFunction,
	onDisplay: Prototype.emptyFunction,
	show: function() {
		this.id = ++Simpltry.Dialog.State.highestId;
		if(Simpltry.Dialog.State.opaqueDialog == null) {
			var opaqueLayer = document.createElement('div');
			$(opaqueLayer);
			Simpltry.Dialog.State.opaqueDialog = opaqueLayer;
			Element.setStyle(opaqueLayer, {position: "absolute", top:"0", left:"0", display: "block", zIndex: 1000, background: "#fff"});
			Simpltry.Dialog.State.setOpaqueSize();
			opaqueLayer.id = "dialog_opaque_layer";
			Element.setOpacity(opaqueLayer, this.options.opacity);
			document.body.appendChild(opaqueLayer);
			$$('select').each(function(element) {Element.hide(element)});
			Event.observe(window, "resize", Simpltry.Dialog.State.setOpaqueSize, false);
		}
				
		this.dialogLayer = document.createElement('div');
		this.dialogLayer.id = "dialog_layer" + this.id;
		$(this.dialogLayer);
		this.dialogLayer.addClassName("dialog");
		Element.setStyle(this.dialogLayer, {position: "absolute", zIndex: ++Simpltry.Dialog.State.highestIndex});
		var browserSize = Simpltry.WindowProperties.getBrowserSize();
		if(typeof(this.options.width) == 'number') {
			this.dialogLayer.style.width = this.options.width + "px";
		} else {
			this.dialogLayer.style.width = this.options.width;
		}
		
		if(this.options.height) {
			if(typeof(this.options.height) == 'number') {
				this.dialogLayer.style.height = this.options.height + "px";
			} else {
				this.dialogLayer.style.height = this.options.height;
			}
			this.dialogLayer.style.overflow = "auto";
		}
		
		if(this.options.displayTitle) {
			var titleLayer = document.createElement('div');
			titleLayer.id = "dialog_title" + this.id;
			$(titleLayer);
			titleLayer.addClassName("dialog_title");
			titleLayer.appendChild(document.createTextNode(this.options.title));
			this.dialogLayer.appendChild(titleLayer);
		}
		
		this._show();
		
		document.body.appendChild(this.dialogLayer);
		this.positionDialog();
		this.hasBeenMoved = false;
		if(this.options.makeDraggable) {
			new Draggable(this.dialogLayer,{handle: titleLayer});
			titleLayer.style.cursor = "move";
			Draggables.addObserver(this);
		}
		Event.observe(window, "keypress", this.onKeyPress.bindAsEventListener(this), false);
		if(this.options.repositionOnScroll) Event.observe(window, "scroll", this.onScroll.bindAsEventListener(this), false);
		var inputs = $A(this.dialogLayer.getElementsByTagName('input'));
		if(inputs.length > 0 && !inputs[0].disabled) inputs.first().focus();
		this.isRemoved = false;
		Simpltry.Dialog.State.activeDialog.push(this);
		this.onDisplay();
	},
	positionDialog: function() {
		var dims = this.dialogLayer.getDimensions();
		if(!this.dims || dims.width != this.dims.width || dims.height != this.dims.height) {
			this.dims = dims;
			var browserSize = Simpltry.WindowProperties.getBrowserSize();
			this.topOffset = (browserSize.height / 2) - (this.dims.height / 2);
			this.leftOffset = (browserSize.width / 2) - (this.dims.width / 2);
		}
		this.dialogLayer.style.top = (Simpltry.WindowProperties.getVerticalScroll() + this.topOffset) + "px";
		this.dialogLayer.style.left = (Simpltry.WindowProperties.getHorizontalScroll() + this.leftOffset) + "px";
	},
	onKeyPress: function(event) {
		if(event.keyCode == Event.KEY_ESC && !this.isRemoved) {
			this.removeDialog();
			Event.stop(event);
		}
	},
	onScroll: function(event) {
		if(!this.isRemoved) {
			this.positionDialog();
		}
	},
	onEnd: function() {
		this.setOffset();
	},
	removeDialog: function() {
		this.dialogLayer.style.display = "none";
		Element.remove(this.dialogLayer);
		this.isRemoved = true;
		Simpltry.Dialog.State.activeDialog = Simpltry.Dialog.State.activeDialog.reject(function(dialog){return dialog.id == this.id;}.bind(this))
		if(!Simpltry.Dialog.State.hasActiveDialogs()) {
			Simpltry.Dialog.State.opaqueDialog.style.display = "none";
			Element.remove(Simpltry.Dialog.State.opaqueDialog);
			if(this.options.makeDraggable) Draggables.removeObserver(this);
			$$('select').each(function(element) {Element.show(element)});
			Simpltry.Dialog.State.opaqueDialog = null;
			Event.stopObserving(window, "resize", Simpltry.Dialog.State.setOpaqueSize, false);
		}
	},
	setOffset: function() {
		var offset = Position.positionedOffset(this.dialogLayer);
		this.leftOffset = offset[0] - Simpltry.WindowProperties.getHorizontalScroll();
		this.topOffset = offset[1] - Simpltry.WindowProperties.getVerticalScroll();
		var reposition = false;
		var browserSize = Simpltry.WindowProperties.getBrowserSize();
		if((this.topOffset + this.dialogLayer.getDimensions().height + 20) > browserSize.height) {
			this.topOffset -= (this.topOffset + this.dialogLayer.getDimensions().height) - (browserSize.height - 20);
			reposition = true;
		}
		if((this.leftOffset + this.dialogLayer.getDimensions().width + 20) > browserSize.width) {
			this.leftOffset -= (this.leftOffset + this.dialogLayer.getDimensions().width) - (browserSize.width - 20);
			reposition = true;
		}
		
		if(reposition) this.positionDialog();
	}
}

Simpltry.Dialog.Ajax = Class.create();
Object.extend(Object.extend(Simpltry.Dialog.Ajax.prototype, Simpltry.Dialog.Base.prototype),
	{
		setup:function(options, buttons) {
		    options = Object.extend(Object.extend({},Simpltry.Dialog.DefaultOptions), options || {});
			this.options = Object.extend({
				additionalText: "loading . . . "
			}, options);
			this.options.makeDraggable = false;
			this.options.displayTitle = false;
			this.buttons = buttons || [];
		},
		_show: function(){
			var additionalTextLayer = document.createElement('div');
			additionalTextLayer.id = "dialogLoadingLayer";
			additionalTextLayer.style.margin = "5px";
			additionalTextLayer.style.paddingLeft = "4px";
			additionalTextLayer.style.paddingRight = "4px";
			additionalTextLayer.innerHTML = this.options.additionalText;
			this.dialogLayer.appendChild(additionalTextLayer);
			var ajaxUpdateLayer = document.createElement('div');
			ajaxUpdateLayer.id = "ajaxUpdateLayer";
			this.dialogLayer.appendChild(ajaxUpdateLayer);
		},
		onDisplay: function() {
			new Ajax.Updater('ajaxUpdateLayer', this.options.url, {
				onComplete: function() {Element.remove($('dialogLoadingLayer'));this.positionDialog();}.bind(this),
				evalScripts: true,
				method: "get"
			});
		}
	});

Simpltry.Dialog.Confirm = Class.create();
Object.extend(Object.extend(Simpltry.Dialog.Confirm.prototype, Simpltry.Dialog.Base.prototype), {
	setup: function(options, buttons) {
		options = Object.extend(Object.extend({},Simpltry.Dialog.DefaultOptions), options || {});
		this.options = Object.extend({
			additionalText: null
		}, options);
		this.buttons = [];
		(buttons || []).each(function(button) {
			this.addButton(button.text || "ok", button);
		}.bind(this));
	},
	addButton: function(buttonText, options) {
		var newButton = new Simpltry.Dialog.Button(buttonText, this, options);
		this.buttons.push(newButton);
	},
	_show: function() {
		if(this.options.additionalText) {
			var additionalTextLayer = document.createElement('div');
			additionalTextLayer.style.paddingLeft = "4px";
			additionalTextLayer.style.paddingRight = "4px";
			additionalTextLayer.innerHTML = this.options.additionalText;
			this.dialogLayer.appendChild(additionalTextLayer);
		}
		var buttonLayer = document.createElement('div');
		buttonLayer.style.textAlign = "center";
		buttonLayer.style.marginTop = "5px";
		buttonLayer.style.marginBottom = "2px";
		this.buttons.each(function(currentButton) { buttonLayer.appendChild(currentButton.element) } );
		this.dialogLayer.appendChild(buttonLayer);
	}
	
});

Simpltry.Dialog.Alert = function(alertText, options) {
	options = Object.extend({title: "Alert!", additionalText: alertText}, options || {});
	var dialog = new Simpltry.Dialog.Confirm(options,[{}]);
	return dialog;
};
