if(!Simpltry) var Simpltry = {};

Simpltry.demoCheck = function(event) {
    locations = new String(window.location).split("?");
    if(locations.length == 2) {
        if(locations[1].indexOf("demo=true") != -1) {
            new Effect.ScrollTo('demo');
        }
    }
}


Event.observe(window,"load",Simpltry.demoCheck, false);