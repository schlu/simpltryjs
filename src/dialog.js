/*
Copyright (c) 2006-2007 Nicholas Schlueter (http://widgets.simpltry.com, http://simpltry.com)

Simpltry Widgets is freely distributable under the terms of an MIT-style license.
For details, see the MIT-LICENSE file in the distribution

Dependencies: 
  Prototype: 1.6.0_rc1+
  script.aculo.us: 1.8.0_pre1+
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
  hasActiveDialogs: function() {return Simpltry.Dialog.State.activeDialog.length > 0;},
  highestIndex: 1000,
  highestId: 0,
  setOpaqueSize: function() {
    var contentSize = Simpltry.WindowProperties.getContentSize(Simpltry.Dialog.State.opaqueDialog);
    Simpltry.Dialog.State.opaqueDialog.setStyle({
      top: document.viewport.getScrollOffsets().top + "px", 
      left: document.viewport.getScrollOffsets().left + "px",
      width: (contentSize.width-15) + "px", 
      height: contentSize.height + "px"
    });
  }
};
Simpltry.Dialog.css = {
  title: "simpltryDialogTitle",
  dialog: "simpltryDialog"
};

Simpltry.Dialog.removeAll = function() {Simpltry.Dialog.State.activeDialog.each(function(dialog){dialog.removeDialog();});};

Simpltry.Dialog.Button = Class.create({
  initialize: function(buttonText, dialogBox, options) {
    this.options = Object.extend({onClick: Prototype.emptyFunction}, options || {});
    this.element = document.createElement('input');
    this.element.type = 'submit';
    this.element.value = buttonText;
    this.element.onclick = function(event) {this.options.onClick(event);dialogBox.removeDialog();return false;}.bindAsEventListener(this);
  }
});
Simpltry.Dialog.Base = Class.create({
  DefaultOptions: {
    opacity: .6,
    width: 300,
    title: "Confirm?",
    makeDraggable: true,
    repositionOnScroll: true,
    displayTitle: true,
    height:null
  },
  initialize: function(options, buttons){
    this.options = Object.extend(Object.clone(this.DefaultOptions), options || {});
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
      document.body.appendChild(opaqueLayer);
      opaqueLayer.setStyle({position: "absolute", top:"0", left:"0", display: "block", zIndex: 1000, background: "#fff", opacity: 0});
      Simpltry.Dialog.State.setOpaqueSize();
      opaqueLayer.id = "dialog_opaque_layer";
      new Effect.Opacity(opaqueLayer, {
        to: this.options.opacity, 
        from: 0, 
        duration: .3,
        afterFinish: this.afterDim.bind(this)});
      $$('select').each(Element.hide);
      Event.observe(window, "resize", Simpltry.Dialog.State.setOpaqueSize);
    }
  },
  afterDim: function() {
    this.dialogLayer = $(document.createElement('div'));
    this.dialogLayer.id = "dialog_layer" + this.id;
    this.dialogLayer.addClassName("dialog");
    this.dialogLayer.setStyle({position: "absolute", zIndex: ++Simpltry.Dialog.State.highestIndex});
    var browserSize = document.viewport.getDimensions();
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
    Event.observe(document, "keypress", this.onKeyPress.bindAsEventListener(this), false);
    Event.observe(window, "keypress", this.onKeyPress.bindAsEventListener(this), false);
    if(this.options.repositionOnScroll) Event.observe(window, "scroll", this.onScroll.bindAsEventListener(this));
    var inputs = $A(this.dialogLayer.getElementsByTagName('input'));
    if(inputs.length > 0 && !inputs[0].disabled) inputs.first().focus();
    this.isRemoved = false;
    Simpltry.Dialog.State.activeDialog.push(this);
    this.onDisplay();
  },
  positionDialog: function() {
    Simpltry.Dialog.State.setOpaqueSize();
    var dims = this.dialogLayer.getDimensions();
    if(!this.dims || dims.width != this.dims.width || dims.height != this.dims.height) {
      this.dims = dims;
      var browserSize = document.viewport.getDimensions();
      this.topOffset = (browserSize.height / 2) - (this.dims.height / 2);
      this.leftOffset = (browserSize.width / 2) - (this.dims.width / 2);
    }
    this.dialogLayer.setStyle({
      top: (document.viewport.getScrollOffsets().top + this.topOffset) + "px",
      left: (document.viewport.getScrollOffsets().left + this.leftOffset) + "px"
    });
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
    Simpltry.Dialog.State.activeDialog = Simpltry.Dialog.State.activeDialog.reject(function(dialog){return dialog.id == this.id;}.bind(this));
    if(!Simpltry.Dialog.State.hasActiveDialogs()) {
      Simpltry.Dialog.State.opaqueDialog.style.display = "none";
      Element.remove(Simpltry.Dialog.State.opaqueDialog);
      if(this.options.makeDraggable) Draggables.removeObserver(this);
      $$('select').each(Element.show);
      Simpltry.Dialog.State.opaqueDialog = null;
      Event.stopObserving(window, "resize", Simpltry.Dialog.State.setOpaqueSize, false);
    }
  },
  setOffset: function() {
    var offset = this.dialogLayer.positionedOffset();
    this.leftOffset = offset[0] - document.viewport.getScrollOffsets().left;
    this.topOffset = offset[1] - document.viewport.getScrollOffsets().top;
    var reposition = false;
    var browserSize = document.viewport.getDimensions();
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
});

Simpltry.Dialog.Ajax = Class.create(Simpltry.Dialog.Base, {
  initialize:function($super, options, buttons) {
    this.options = Object.extend({
      additionalText: "loading . . . ",
      method: "get",
      makeDraggable: false,
      displayTitle: false
    }, options || {});
    this.buttons = buttons || [];
    $super(this.options, buttons);
  },
  _show: function(){
    var additionalTextLayer = (document.createElement('div'));
    additionalTextLayer.id = "dialogLoadingLayer";
    additionalTextLayer.setStyle({
      margin: "5px",
      padding: "0 4px"
    });
    additionalTextLayer.update(this.options.additionalText);
    this.dialogLayer.appendChild(additionalTextLayer);
    var ajaxUpdateLayer = document.createElement('div');
    ajaxUpdateLayer.id = "ajaxUpdateLayer";
    this.dialogLayer.appendChild(ajaxUpdateLayer);
  },
  onDisplay: function() {
    new Ajax.Updater('ajaxUpdateLayer', this.options.url, {
      onComplete: function() {Element.remove($('dialogLoadingLayer'));this.positionDialog();}.bind(this),
      evalScripts: true,
      parameters: this.options.parameters,
      method: this.options.method
    });
  }
});

Simpltry.Dialog.Confirm = Class.create(Simpltry.Dialog.Base, {
  initialize: function($super, options, buttons) {
    this.options = Object.extend({
      additionalText: null
    }, options || {});
    this.buttons = [];
    (buttons || []).each(function(button) {
      this.addButton(button.text || "ok", button);
    }.bind(this));
    $super(this.options, buttons);
  },
  addButton: function(buttonText, options) {
    var newButton = new Simpltry.Dialog.Button(buttonText, this, options);
    this.buttons.push(newButton);
  },
  _show: function() {
    if(this.options.additionalText) {
      var additionalTextLayer = $(document.createElement('div'));
      additionalTextLayer.setStyle({
        padding: "0 4px"
      });
      additionalTextLayer.update(this.options.additionalText);
      this.dialogLayer.appendChild(additionalTextLayer);
    }
    var buttonLayer = $(document.createElement('div'));
    buttonLayer.setStyle({
      textAlign: "center",
      marginTop: "5px",
      marginBottom: "2px"
    });
    this.buttons.each(function(currentButton) { buttonLayer.appendChild(currentButton.element); } );
    this.dialogLayer.appendChild(buttonLayer);
  }
});

Simpltry.Dialog.Alert = function(alertText, options) {
  options = Object.extend({title: "Alert!", additionalText: alertText}, options || {});
  var dialog = new Simpltry.Dialog.Confirm(options,[{}]);
  return dialog;
};
