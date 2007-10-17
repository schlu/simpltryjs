/*
Copyright (c) 2006-2007 Nicholas Schlueter (http://widgets.simpltry.com, http://simpltry.com)

Simpltry Widgets is freely distributable under the terms of an MIT-style license.
For details, see the MIT-LICENSE file in the distribution

Dependencies: 
	Prototype: 1.6.0_rc1+
  script.aculo.us: 1.8.0_pre1+
*/
if(!Simpltry) var Simpltry = {};
Simpltry.RatingControlDefaultOptions = {
	onSelect: Prototype.emptyFunction,
	selected: null
};
Simpltry.RatingControl = Class.create({
	initialize: function(container, options) {
		this.setOptions(options);
		this.container = $(container);
		this.ratings = {};
		var i = 1;
		$A(this.container.childNodes).each(function(child) {
			if(child.tagName) {
				this.ratings[i++] = $(child);
			} else {
				return;
			}
		}.bind(this));
		this.ratingsHash = $H(this.ratings);
		this.attachEvents();
		if(this.options.selected) {
		    this.markUpTo(this.ratings[this.options.selected]);
		}
	},
	setOptions: function(options) {
		this.options = Object.extend(Object.clone(Simpltry.RatingControlDefaultOptions), options || {});
	},
	attachEvents: function() {
		this.ratingsHash.values().each(function(rating){
			rating.onmouseover = this.mouseOver.bindAsEventListener(this);
		}.bind(this));
		this.ratingsHash.values().each(function(rating){
			rating.onmouseout = this.mouseOut.bindAsEventListener(this);
		}.bind(this));
		this.ratingsHash.values().each(function(rating, i) {
			rating.onclick = function(event) {
				this.options.selected = i + 1;
				this.options.onSelect(i + 1);
			}.bindAsEventListener(this);
		}.bind(this));
	},
	mouseOver: function(event) {
		var rating = Event.element(event);
		this.markUpTo(rating);
	},
	markUpTo: function(element) {
	    this.clear(false);
		$R(1,this.ratingsHash.keys().length, false).each(function(r){
			this.ratings[r].addClassName("simpltryRatingControlHighlight");
			if(this.ratings[r] == element) {
				throw $break;
			}
		}.bind(this));
	},
	mouseOut: function(event) {
		this.clear(true);
	},
	clear: function(preserveSelected) {
		$R(1,this.ratingsHash.keys().length, false).each(function(r){
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