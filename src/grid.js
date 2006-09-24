if(!Simpltry) var Simpltry = {};
Simpltry.DataGrid = Class.create();

Simpltry.DataGrid.css = {
    dataGrid: "simpltryDataGrid",
    headerRow: "simpltryDataGridHeaderRow",
    dataRow: "simpltryDataGridDataRow",
    oddRow: "simpltryDataGridOddRow",
    evenRow: "simpltryDataGridEvenRow",
    sorted: "simpltryDataGridSorted",
    sortedReverse: "simpltryDataGridSortedReverse"
}

Simpltry.DataGrid.prototype = {
	initialize: function(container, data) {
		this.container = $(container);
		this.data = data || {};
		this.sortedBy = null;
		this.sortedReverse = false;
		if(this.data.rows.length > 0) {
			this.render();
		}
	},
	
	buildThead: function(headers){
	    var thead = Builder.node('thead');
	    var tr = Builder.node('tr', {className: Simpltry.DataGrid.css.headerRow});
	    headers.each(function(header, i) {
	        var th = Builder.node("th", {}, [header]);
	        if(this.sortedBy == i) {
	            if(this.sortedReverse) {
	                th.addClassName(Simpltry.DataGrid.css.sortedReverse);
	            } else {
	                th.addClassName(Simpltry.DataGrid.css.sorted);
	            }
	        }
	        th.onclick = this.sort.bind(this,i, (this.sortedBy == i && !this.sortedReverse));
	        tr.appendChild(th);
	    }.bind(this));
	    thead.appendChild(tr);
	    return thead;
	},
	
	buildTbody: function(rows) {
	    var tbody = Builder.node('tbody');
	    rows.each(function(row,i) {
	        var tr = Builder.node('tr', {className: Simpltry.DataGrid.css.dataRow + " " + (i%2 != 0 ? Simpltry.DataGrid.css.evenRow : Simpltry.DataGrid.css.oddRow)});
	        row.each(function(cell) {
	            var td = Builder.node('td', {}, [cell]);
	            tr.appendChild(td);
	        });
	        tbody.appendChild(tr);
		}.bind(this));
		return tbody;
	},
	
	sort: function(column, reverse) {
		this.data.rows = this.data.rows.sortBy(function(v){
		    return v[column].toLowerCase();
		});
		
		if(reverse) {
		    this.data.rows = this.data.rows.reverse();
		}
		
		this.sortedBy = column;
		this.sortedReverse = reverse;

		this.render();
	},
	
	render: function() {
		this.container.innerHTML = '';
		var table = Builder.node('table', {className:Simpltry.DataGrid.css.dataGrid});
		table.appendChild(this.buildThead(this.data.headers));
		table.appendChild(this.buildTbody(this.data.rows));
		this.container.appendChild(table);
	},
	
};
