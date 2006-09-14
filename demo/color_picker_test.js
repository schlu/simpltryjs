function setup() {
    new Simpltry.ColorPicker("picker1", {onSelect: function(color){alert(color)}, size: "small"});
    new Simpltry.ColorPicker("picker2", {onSelect: function(color){alert(color)}, size: "small", cellWidth: 30, cellHeight: 30});
    new Simpltry.ColorPicker("picker3", {onSelect: function(color){alert(color)}, size: "large"});
    new Simpltry.ColorPicker("picker4", {onSelect: function(color){alert(color)}, size: "large", cellWidth: 30, cellHeight: 30});
}
Event.observe(window, "load", setup, false);