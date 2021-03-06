/*
Copyright (c) 2006-2007 Nicholas Schlueter (http://widgets.simpltry.com, http://simpltry.com)

Simpltry Widgets is freely distributable under the terms of an MIT-style license.
For details, see the MIT-LICENSE file in the distribution

Dependencies: 
  Prototype: 1.6.0_rc1+
  script.aculo.us: 1.8.0_pre1+
  Simpltry
    -window_properties.js
*/
if(!Simpltry) var Simpltry = {};
Simpltry.Tooltip = {};
Simpltry.Tooltip.DefaultOptions  = {
  offsetLeft: 0,
  offsetTop: 0,
  direction: "below",
  toggle: true,
  relative: "anchor"
};
Simpltry.Tooltip.Base = Class.create({
  initialize: function(element, options) {
    this.setOptions(options);
    this.element = $(element);
    if(this.options.tooltip) {
        this.popup = $(this.options.tooltip);
    } else {
        this.popup = $(this.element.id + '_tooltip');
    }
    this.setPopupPosition();
    $$("body")[0].appendChild(this.popup);
    this.attachEvents();
    this.element.observe("tooltip:displayed", this.hideSelectBoxes.bind(this));
    this.element.observe("tooltip:closed", this.showSelectBoxes.bind(this));
    if(this.options.relative == "cursor") {
      Event.observe(document, "mousemove", this.setMouse.bindAsEventListener(this));
    }
  },
  setOptions: function(options) {
    this.options = Object.clone(Simpltry.Tooltip.DefaultOptions);
    Object.extend(this.options, options || {});
  },
  setPopupPosition: function() {
    var offset = this.element.cumulativeOffset();
    var leftPosition = topPosition = 0;
    var elementDimentions = this.element.getDimensions();
    if(this.options.relative == "anchor") {
      if(this.options.direction == "right") {
        leftPosition = offset[0] + elementDimentions.width;
        topPosition = offset[1];
      } else if(this.options.direction == "below") {
        leftPosition = offset[0];
        topPosition = offset[1] + elementDimentions.height;
      } else if(this.options.direction == "left") {
        leftPosition = offset[0] - this.popup.getDimensions().width;
        topPosition = offset[1];
      } 
    } else if(this.options.relative == "cursor") {
      if(this.lastX && this.lastY) {
        leftPosition = this.lastX;
        topPosition = this.lastY;
      }
    }
    leftPosition += this.options.offsetLeft;
    topPosition += this.options.offsetTop;

    if(this.options.direction == "right"){
      if($(document.body).getDimensions().width - (offset[0] + this.popup.getDimensions().width) + 8 < 0) {
        leftPosition = offset[0] + elementDimentions.width - this.popup.getDimensions().width;
        topPosition = offset[1] + elementDimentions.height + 8;
      }
    } else if(this.options.direction == "below") {
      var distanceFromScreenTop = document.body.getDimensions().height - (offset[1] + this.popup.getDimensions().height) + 8;
      if(distanceFromScreenTop < 0) topPosition += distanceFromScreenTop;
    }
    this.popup.setStyle({position: 'absolute', left: leftPosition + "px", top: topPosition + "px"});
    
  },
  attachEvents: Prototype.emptyFunction,
  display: function() {
    this.setPopupPosition();
    this.element.fire("tooltip:displayed");
    this.popup.show();
  },
  close: function() {
    this.element.fire("tooltip:closed");
    this.popup.hide();
  },
  setMouse: function(event) {
    this.lastX = Event.pointerX(event);
    this.lastY = Event.pointerY(event);
  },
  hideSelectBoxes: function() {
    var tooltip_offsets = {top: parseInt(this.popup.getStyle("top"), 10), left: parseInt(this.popup.getStyle("left"), 10)};
    var tooltip_info = {left: tooltip_offsets.left, top: tooltip_offsets.top, right: tooltip_offsets.left + this.popup.getWidth(), bottom: tooltip_offsets.top + this.popup.getHeight()};

    this.popup.select_boxes = $$("select").findAll(function(box) {
      var box_offsets = box.cumulativeOffset();
      var box_info = {left: box_offsets.left, top: box_offsets.top, right: box_offsets.left + box.getWidth(), bottom: box_offsets.top + box.getHeight()};

      // if any of box is between tooltip left + right, and any of box is between tooltip top + bottom 
      // and which have no visibility or visibility: "visible"
      if(box_info.top > tooltip_info.bottom || box_info.bottom < tooltip_info.top ||
        box_info.left > tooltip_info.right || box_info.right < tooltip_info.left)
        return false;

      //else
      if(box.getStyle("visibility") == undefined || box.getStyle("visibility") == "visible")
        return true;
    });

    this.popup.select_boxes.each(function(box) {
      box.setStyle({visibility: "hidden"});
    });
  },
  showSelectBoxes: function() {
    if(this.popup.select_boxes)
      this.popup.select_boxes.each(function(box) {
        box.setStyle({visibility: "visible"});
      });
  }
});
Simpltry.ClickTooltip = Class.create(Simpltry.Tooltip.Base, {
  attachEvents: function() {
    $(this.element).observe("click", this.onClick.bind(this));
    document.body.observe("click", this.blurIfNotTooltip.bindAsEventListener(this));
  },
  onClick: function(event) {
    if(event.element().tagName == "A" || event.findElement("a")) event.stop();
    if(this.options.toggle) {
      if(this.popup.visible()) {
        this.close();
      } else {
        this.display();
      }
    } else {
      this.display();
    }
  },
  blurIfNotTooltip: function(event) {
    var clicked = Event.element(event);
    if(this.popup.visible() && clicked != this.element && clicked != this.popup && !clicked.descendantOf(this.popup) && !clicked.descendantOf(this.element)) {
      this.close();
    }
  }
});

Simpltry.MouseoverTooltip = Class.create(Simpltry.Tooltip.Base, {
  attachEvents: function() {
    this.element.observe("mouseover", this.elementMouseOver.bindAsEventListener(this));
    this.element.observe("mouseout", this.elementMouseOut.bindAsEventListener(this));
    this.popup.observe("mouseover", this.popupMouseOver.bindAsEventListener(this));
    this.popup.observe("mouseout", this.popupMouseOut.bindAsEventListener(this));
  },
  elementMouseOver: function(e) {
    this.element.addClassName('toolTipMouseOver');
    this.checkMouseOver.bind(this).delay(.25);
  },
  popupMouseOver: function(e) {
    this.popup.addClassName('toolTipMouseOver');
    this.checkMouseOver.bind(this).delay(.25);
  },
  elementMouseOut: function(e) {
    this.element.removeClassName('toolTipMouseOver');
    this.checkMouseOut.bind(this).delay(.25);
  },
  popupMouseOut: function(e) {
    this.popup.removeClassName('toolTipMouseOver');
    this.checkMouseOut.bind(this).delay(.25);
  },
  checkMouseOut: function() {
    if(!this.popup.hasClassName('toolTipMouseOver') && !this.element.hasClassName('toolTipMouseOver')) this.close();
  },
  checkMouseOver: function() {
    if(!this.popup.visible() && (this.popup.hasClassName('toolTipMouseOver') || this.element.hasClassName('toolTipMouseOver'))) this.display();
  }
});

Simpltry.Tooltip.setupWidget = function(element, options) {
  element = $(element);
  if(options['tooltipText']) {
    var tooltip = Builder.node('div', {className:"simpltryTooltip"}, options['tooltipText']);
    Element.setStyle(tooltip, {display: "none"});
    document.body.appendChild(tooltip);
    options['tooltip'] = tooltip;
    delete(options['tooltipText']);
  }
  if(!options['tooltip']) {
    options['tooltip'] = element.next();
  }
};

if(Simpltry.Widgets) {
  Simpltry.Widgets.register("mouseover_tooltip", function(element, options) {
    Simpltry.Tooltip.setupWidget(element, options);
    new Simpltry.MouseoverTooltip(element, options);
  });
  Simpltry.Widgets.register("click_tooltip", function(element, options) {
    Simpltry.Tooltip.setupWidget(element, options);
    new Simpltry.ClickTooltip(element, options);
  });
}