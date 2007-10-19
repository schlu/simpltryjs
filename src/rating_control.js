/*
Copyright (c) 2006-2007 Nicholas Schlueter (http://widgets.simpltry.com, http://simpltry.com)

Simpltry Widgets is freely distributable under the terms of an MIT-style license.
For details, see the MIT-LICENSE file in the distribution

Dependencies: 
  Prototype: 1.6.0_rc1+
  script.aculo.us: 1.8.0_pre1+
*/
if(!Simpltry) var Simpltry = {};
Simpltry.RatingControl = Class.create({
  DefaultOptions: {
    onSelect: Prototype.emptyFunction,
    selected: null
  },
  initialize: function(container, options) {
    this.setOptions(options);
    this.container = $(container);
    this.ratings = {};
    this.container.immediateDescendants().each(function(child, i) {
        this.ratings[i + 1] = $(child);
    }.bind(this));
    this.attachEvents();
    if(this.options.selected) {
        this.markUpTo(this.ratings[this.options.selected]);
    }
  },
  setOptions: function(options) {
    this.options = Object.extend(Object.clone(this.DefaultOptions), options || {});
  },
  attachEvents: function() {
    Object.values(this.ratings).each(function(rating, i){
      rating.observe("mouseover",this.mouseOver.bindAsEventListener(this)).observe("mouseout",this.mouseOut.bindAsEventListener(this)).observe("click", this.onClick.bindAsEventListener(this, i));
    }.bind(this));
  },
  mouseOver: function(event) {
    this.markUpTo(event.element());
  },
  markUpTo: function(element) {
    this.clear(false);
    $R(1,Object.keys(this.ratings).length, false).each(function(r){
      this.ratings[r].addClassName("simpltryRatingControlHighlight");
      if(this.ratings[r] == element) {
        throw $break;
      }
    }.bind(this));
  },
  mouseOut: function(event) {
    this.clear(true);
  },
  onClick: function(event, i) {
    this.options.selected = i + 1;
    this.options.onSelect(i + 1);
  },
  clear: function(preserveSelected) {
    $R(1,Object.keys(this.ratings).length, false).each(function(r){
      if(preserveSelected) {
        if((!this.options.selected || this.options.selected < r)) {
          this.ratings[r].removeClassName("simpltryRatingControlHighlight");  
        } else {
          this.ratings[r].addClassName("simpltryRatingControlHighlight"); 
        }
      } else {
        this.ratings[r].removeClassName("simpltryRatingControlHighlight");
      }
    }.bind(this));
  }
});

if(Simpltry.Widgets) {
  Simpltry.Widgets.register('rating', function(element, options) {
    new Simpltry.RatingControl(element, options);
  });
}