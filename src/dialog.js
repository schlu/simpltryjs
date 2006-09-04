/*
Created On: 05/15/2006
Last Updated On: 08/23/2006
Created By: Nicholas Schlueter -- http://www.simpltry.com
Version: 0.6

This is freely available for noncommercial and commerical use.  I am not responsible for support and 
if this script causes harm directly or indirectly I am not liable for any damages.  Using any part of this 
Code means you agree to the aformentioned conditions.  Please alter this code however you see fit. I do 
ask that you leave every from this point up in tact.

Dependencies: 
    Prototype: 1.5.0_rc0+
    script.aculo.us: 1.6.1+
        -effects
        -dragdrop
*/
var WindowProperties = {
    getHorizontalScroll: function() {
        return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
    },
    getVerticalScroll: function() {
        return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    },
    getBrowserSize: function() {
        var bWidth;
        var bHeight;
        if(document.documentElement && document.documentElement.clientHeight) {
            bWidth = document.documentElement.clientWidth - 8;
            bHeight = document.documentElement.clientHeight;
        } else {
            bWidth = document.body.clientWidth;
            bHeight = document.body.clientHeight;
        }
        return {width: bWidth, height: bHeight};
    },
    getContentSize: function() {
        var bodyHeight;
        var bodyWidth;
        if (window.innerHeight && window.scrollMaxY) {
  		    bodyHeight = window.innerHeight + window.scrollMaxY;
  	    } else if (document.body.scrollHeight > document.body.offsetHeight){
  		    bodyHeight = document.body.scrollHeight;
  	    } else {
  		    bodyHeight = document.body.offsetHeight;
  	    } 
  	    if (window.innerWidth && window.scrollMaxX) {
  		    bodyWidth = document.body.scrollWidth + window.scrollMaxX;
  	    } else if (document.body.scrollWidth > document.body.offsetWidth){
  		    bodyWidth = document.body.scrollWidth;
  	    } else {
  		    bodyWidth = document.body.offsetWidth;
  	    }
        var browserSize = WindowProperties.getBrowserSize();
        var calculatedHeight = browserSize.height;
        var calculatedWidth = browserSize.width;
        
        if(bodyWidth > calculatedWidth) calculatedWidth = bodyWidth;
        if(bodyHeight > calculatedHeight) calculatedHeight = bodyHeight;
        return {height: calculatedHeight, width: calculatedWidth};
    }
};

var Dialog = {};
Dialog.State = {
    activeDialog: [],
    opaqueDivUp: null,
    hasActiveDialogs: function() {return Dialog.State.activeDialog.length > 0},
    highestIndex: 1000,
    highestId: 0
};
Dialog.DefaultOptions = {
    opacity: .6,
    width: 300,
    title: "Confirm?",
    makeDraggable: true,
    dialogColor: "#ccc",
    titleColor: "#fff",
    repositionOnScroll: true,
    displayTitle: true,
    height:null
};

Dialog.removeAll = function() {Dialog.State.activeDialog.each(function(dialog){dialog.removeDialog()})};

Dialog.Button = Class.create();
Dialog.Button.prototype = {
    initialize: function(buttonText, dialogBox, options) {
        this.options = Object.extend({onClick: Prototype.emptyFunction}, options || {});
        this.element = document.createElement('input');
        this.element.type = 'submit';
        this.element.value = buttonText;
        this.element.onclick = function(event) {this.options.onClick(event);dialogBox.removeDialog();return false;}.bindAsEventListener(this);
    }
};
Dialog.Base = {};
Dialog.Base.prototype = {
    _show: Prototype.emptyFunction,
    onDisplay: Prototype.emptyFunction,
    show: function() {
        this.id = ++Dialog.State.highestId;
        if(Dialog.State.opaqueDialog == null) {
            var opaqueLayer = document.createElement('div');
            $(opaqueLayer);
            opaqueLayer.style.position = "absolute";
            opaqueLayer.style.top = "0";
            opaqueLayer.style.left = "0";
            opaqueLayer.id = "dialog_opaque_layer";
            var contentSize = WindowProperties.getContentSize();
            opaqueLayer.style.width = contentSize.width + "px";
            opaqueLayer.style.height = contentSize.height + "px";
            opaqueLayer.style.display = "block";
            Element.setOpacity(opaqueLayer, this.options.opacity);
            opaqueLayer.style.zIndex = 1000;
            opaqueLayer.style.background = "#fff";
            document.body.appendChild(opaqueLayer);
            Dialog.State.opaqueDialog = opaqueLayer;
            $$('select').each(function(element) {Element.hide(element)});
        }
                
        this.dialogLayer = document.createElement('div');
        this.dialogLayer.id = "dialog_layer" + this.id;
        $(this.dialogLayer);
        this.dialogLayer.addClassName("dialog");
        this.dialogLayer.style.position = "absolute";
        var browserSize = WindowProperties.getBrowserSize();
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
        this.dialogLayer.style.zIndex = ++Dialog.State.highestIndex;
        this.dialogLayer.style.background = this.options.dialogColor;
        
        if(this.options.displayTitle) {
            var titleLayer = document.createElement('div');
            titleLayer.id = "dialog_title" + this.id;
            $(titleLayer);
            titleLayer.addClassName("dialog_title");
            titleLayer.style.padding = "2px";
            titleLayer.style.margin = "2px";
            titleLayer.style.background = this.options.titleColor;
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
        if(inputs.length > 0) inputs.first().focus();
        this.isRemoved = false;
        Dialog.State.activeDialog.push(this);
        this.onDisplay();
    },
    positionDialog: function() {
        var dims = this.dialogLayer.getDimensions();
        if(!this.dims || dims.width != this.dims.width || dims.height != this.dims.height) {
            this.dims = dims;
            var browserSize = WindowProperties.getBrowserSize();
            this.topOffset = (browserSize.height / 2) - (this.dims.height / 2);
            this.leftOffset = (browserSize.width / 2) - (this.dims.width / 2);
        }
        this.dialogLayer.style.top = (WindowProperties.getVerticalScroll() + this.topOffset) + "px";
        this.dialogLayer.style.left = (WindowProperties.getHorizontalScroll() + this.leftOffset) + "px";
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
        Dialog.State.activeDialog = Dialog.State.activeDialog.reject(function(dialog){return dialog.id == this.id;}.bind(this))
        if(!Dialog.State.hasActiveDialogs()) {
            Dialog.State.opaqueDialog.style.display = "none";
            Element.remove(Dialog.State.opaqueDialog);
            if(this.options.makeDraggable) Draggables.removeObserver(this);
            $$('select').each(function(element) {Element.show(element)});
            Dialog.State.opaqueDialog = null;
        }
    },
    setOffset: function() {
        var offset = Position.positionedOffset(this.dialogLayer);
        this.leftOffset = offset[0] - WindowProperties.getHorizontalScroll();
        this.topOffset = offset[1] - WindowProperties.getVerticalScroll();
        var reposition = false;
        var browserSize = WindowProperties.getBrowserSize();
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

Dialog.Ajax = Class.create();
Object.extend(Object.extend(Dialog.Ajax.prototype, Dialog.Base.prototype),
    {
        initialize: function(options) {
            options = Object.extend(Object.extend({},Dialog.DefaultOptions), options || {});
            this.options = Object.extend({
                additionalText: "loading . . . "
            }, options);
            this.options.makeDraggable = false;
            this.options.displayTitle = false;
            this.buttons = [];
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
                evalScripts: true
            });
        }
    });

Dialog.Confirm = Class.create();
Object.extend(Object.extend(Dialog.Confirm.prototype, Dialog.Base.prototype), {
    initialize: function(options, buttons) {
        options = Object.extend(Object.extend({},Dialog.DefaultOptions), options || {});
        this.options = Object.extend({
            additionalText: null
        }, options);
        this.buttons = [];
        (buttons || []).each(function(button) {
            this.addButton(button.text || "ok", button);
        }.bind(this));
    },
    addButton: function(buttonText, options) {
        var newButton = new Dialog.Button(buttonText, this, options);
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

Dialog.Alert = function(alertText, options) {
    options = Object.extend({title: "Alert!", additionalText: alertText}, options || {});
    var dialog = new Dialog.Confirm(options);
    dialog.addButton('ok');
    dialog.show();
    return dialog;
};
