/*
Copyright (c) 2006-2007 Nicholas Schlueter (http://widgets.simpltry.com, http://simpltry.com)

Simpltry Widgets is freely distributable under the terms of an MIT-style license.
For details, see the MIT-LICENSE file in the distribution

Dependencies: 
	Prototype: 1.5.1+
	script.aculo.us: effects
*/
if(!Simpltry) var Simpltry = {};
Simpltry.Effect = {};
Simpltry.Effect.XBlindOut = function(element, options) {
	element = $(element);
	var elementDimensions = element.getDimensions();
	return new Effect.Scale(element, 100, Object.extend({ 
		scaleContent: false, 
		scaleY: false,
		scaleFrom: 0,
		scaleMode: {originalHeight: elementDimensions.height, originalWidth: elementDimensions.width},
		restoreAfterFinish: true,
		afterSetup: function(effect) {
			effect.element.makeClipping();
			effect.element.setStyle({width: '0px'});
			effect.element.show(); 
		},	
		afterFinishInternal: function(effect) {
			effect.element.undoClipping();
		}
	}, options || {}));
};
Simpltry.Effect.XBlindIn = function(element, options) {
  element = $(element);
  element.makeClipping();
  return new Effect.Scale(element, 0,
    Object.extend({ scaleContent: false, 
      scaleY: false, 
      restoreAfterFinish: true,
      afterFinishInternal: function(effect) {
        effect.element.hide();
        effect.element.undoClipping();
      } 
    }, options || {})
  );
};