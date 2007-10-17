if(!Simpltry) var Simpltry = {};

Simpltry.WindowProperties = {
  getContentSize: function(ignore) {
    if(ignore) {
        ignore.hide();
    }
    var browserSize = document.viewport.getDimensions();
    if(ignore) {
        ignore.show();
    }
    return browserSize;
  }
};