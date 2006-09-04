function setup() {
    new Simpltry.ColorPicker("picker", {onSelect: function(color){alert(color)}, size: "small", cellWidth: 30, cellHeight: 30});
}
Event.observe(window, "load", setup, false);