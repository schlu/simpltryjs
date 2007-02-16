/*
Created On: 09/15/2006
Created By: Nicholas Schlueter -- http://www.simpltry.com
version: .5

This is freely available for noncommercial and commerical use.	I am not responsible for support and 
if this script causes harm directly or indirectly I am not liable for any damages.	Using any part of this 
Code means you agree to the aformentioned conditions.	 Please alter this code however you see fit. I do 
ask that you leave every from this point up in tact.

Dependencies: 
	Prototype: 1.5.0_rc0+
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