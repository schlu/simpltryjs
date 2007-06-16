/*
Copyright (c) 2006-2007 Nicholas Schlueter (http://widgets.simpltry.com, http://simpltry.com)

Simpltry Widgets is freely distributable under the terms of an MIT-style license.
For details, see the MIT-LICENSE file in the distribution

Dependencies: 
    Prototype: 1.5.1+
    script.aculo.us: 1.7.1_beta3+
        -builder
*/

if(!Simpltry) var Simpltry = {};

Simpltry.ColorPicker = Class.create();

Simpltry.ColorPicker.css = {
    table: "colorPicker",
    color: "colorPickerColor"
};

Simpltry.ColorPicker.DefaultOptions = {
    size: "large",
    onSelect: Prototype.emptyFunction
};
Object.extend(Simpltry.ColorPicker.prototype, {
    initialize: function(container, options) {
        this.container = $(container);
        this.options = Object.extend(Object.extend({}, Simpltry.ColorPicker.DefaultOptions), options || {});
        this.rows = this.populateColors();
        this.container.appendChild(this.createPicker());
        return this;
    },
    populateColors: function() {
        if(this.options.size == "large") {
            return this.largeRows;
        } else if(this.options.size == "small") {
            return this.smallRows;
        }
    },
    createPicker: function() {
        var pThis = this;
        var p = Builder.node("table", {cellspacing: 1, cellpadding: 0, style: "border: thin solid #ccc", className: Simpltry.ColorPicker.css.table}, [Builder.node("tbody", {},
            this.rows.collect(function(row) {
                return Builder.node("tr", {}, 
                    row.collect(function(color) {
                        var td = Builder.node("td", {
                            className: Simpltry.ColorPicker.css.color
                        }, [" "]);
                        Element.setStyle(td, {border:"1px solid #ccc",backgroundColor:"#" + color});
                        td.onmouseover = pThis.cellMouseOver.bindAsEventListener(pThis);
                        td.onmouseout = pThis.cellMouseOut.bindAsEventListener(pThis);
                        td.onclick = function() {pThis.options.onSelect(color);};
                        return td;
                    })
                );
            })
        )]);
        return p;
    },
    cellMouseOver: function(event) {
        Element.setStyle(Event.element(event), {borderColor: 'red'});
    },
    cellMouseOut: function(event) {
        Element.setStyle(Event.element(event), {borderColor: '#ccc'});
    },
    largeRows: [
        ["ffffff", "ffcccc", "ffcc99", "ffff99", "ffffcc", "99ff99", "99ffff", "ccffff", "ccccff", "ffccff"],
        ["cccccc", "ff9999", "ff9966", "ffff66", "ffff33", "66ff99", "33ffff", "66ffff", "9999ff", "ff99ff"],
        ["c0c0c0", "ff6666", "ff9900", "ffcc66", "ffff00", "33ff33", "66cccc", "33ccff", "6666cc", "cc66cc"],
        ["999999", "cc0000", "ff6600", "ffcc33", "ffcc00", "33cc00", "00cccc", "3366ff", "6633cc", "cc33cc"],
        ["666666", "990000", "cc6600", "cc9933", "999900", "009900", "339999", "3333ff", "6600cc", "993399"],
        ["333333", "660000", "993300", "996633", "666600", "006600", "336666", "000099", "333399", "663366"],
        ["000000", "330000", "663300", "663333", "333300", "003300", "003333", "000066", "330099", "330033"]
    ],
    smallRows: [
        ["ffffff", "00ff00", "008000", "0000ff"],
        ["c0c0c0", "ffff00", "ff00ff", "000080"],
        ["808080", "ff0000", "800080", "000000"]
    ]
});

if(Simpltry.Widgets) {
    Simpltry.Widgets.register('color_picker', function(element, options) {
        new Simpltry.ColorPicker(element.id, options);
    });
}
