/*
Copyright (c) 2006-2007 Nicholas Schlueter (http://widgets.simpltry.com, http://simpltry.com)

Simpltry Widgets is freely distributable under the terms of an MIT-style license.
For details, see the MIT-LICENSE file in the distribution

Dependencies: 
	Prototype: 1.5.1+
*/
if(!Simpltry) var Simpltry = {};
Simpltry.RatingControl = Class.create();
Simpltry.RatingControl.DefaultOptions = {
	onSelect: Prototype.emptyFunction,
	selected: null
};
Object.extend(Simpltry.RatingControl.prototype, {
	initialize: function(container, options) {
		this.setOptions(options);
		this.container = $(container);
		this.ratings = $H();
		var i = 1;
		$A(this.container.childNodes).each(function(child) {
			if(child.tagName) {
				this.ratings[i++] = $(child);
			} else {
				return;
			}
		}.bind(this));
		this.attachEvents();
		if(this.options.selected) {
		    this.markUpTo(this.ratings[this.options.selected]);
		}
	},
	setOptions: function(options) {
		this.options = $H(Simpltry.RatingControl.DefaultOptions);
		Object.extend(this.options, options || {});
	},
	attachEvents: function() {
		this.ratings.values().each(function(rating){
			rating.onmouseover = this.mouseOver.bindAsEventListener(this);
		}.bind(this));
		this.ratings.values().each(function(rating){
			rating.onmouseout = this.mouseOut.bindAsEventListener(this);
		}.bind(this));
		this.ratings.values().each(function(rating, i) {
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
		$R(1,this.ratings.keys().length, false).each(function(r){
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
		$R(1,this.ratings.keys().length, false).each(function(r){
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
        new Simpltry.RatingControl(element.id, options);
    });
}