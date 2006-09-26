/*
Created On: 09/24/2006
Created By: Nicholas Schlueter -- http://www.simpltry.com
version: .5

This is freely available for noncommercial and commerical use.	I am not responsible for support and 
if this script causes harm directly or indirectly I am not liable for any damages.	Using any part of this 
Code means you agree to the aformentioned conditions.  Please alter this code however you see fit. I do 
ask that you leave every from this point up in tact.

Dependencies: 
	Prototype: 1.5.0_rc0+
	script.aculo.us
	    -builder
	simpltry
	    -tooltip
*/

if(!Simpltry) var Simpltry = {};
Simpltry.DataGrid = Class.create();

Simpltry.DataGrid.css = {
    dataGrid: "simpltryDataGrid",
    headerRow: "simpltryDataGridHeaderRow",
    dataRow: "simpltryDataGridDataRow",
    oddRow: "simpltryDataGridOddRow",
    evenRow: "simpltryDataGridEvenRow",
    sorted: "simpltryDataGridSorted",
    sortedReverse: "simpltryDataGridSortedReverse",
    headerControl: "simpltryDataGridHeaderControl"
}

Simpltry.DataGrid.prototype = {
	initialize: function(container, data) {
		this.container = $(container);
		this.data = data || {};
		this.removedColumns = {};
		this.numberColumn = {};
		this.resetDefaults();
		this.footerData = {};
		if(this.data.rows.length > 0) {
        	this.sum = {};
        	this.average = {};
        	var numCols = this.data.rows[0].length - 1;
        	$R(0, numCols, false).each(function(i) {
        	    this.numberColumn[i] = true;
        	    this.footerData[i] = null;
        	}.bind(this));
        	this.data.rows.each(function(row) {
        	    $R(0, numCols, false).each(function(i) {
            	    if(this.numberColumn[i] && isNaN(parseFloat(row[i]))) {
            	        this.numberColumn[i] = false;
            	    }
        	    }.bind(this));
        	}.bind(this));
			this.render();
		}
	},
	
	resetDefaults: function(){
    	this.sortedBy = null;
    	this.sortedReverse = false;
    	this.groupedBy = null;
	},
	
	buildThead: function(headers){
	    var thead = Builder.node('thead');
	    var tr = Builder.node('tr', {className: Simpltry.DataGrid.css.headerRow});
	    headers.each(function(header, i) {
	        if(!this.removedColumns[i]) {
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
	        }
	    }.bind(this));
	    thead.appendChild(tr);
	    return thead;
	},
	
	buildTbody: function(rows) {
	    var tbody = Builder.node('tbody');
	    rows.each(function(row,i) {
	        var tr = Builder.node('tr', {className: Simpltry.DataGrid.css.dataRow + " " + (i%2 != 0 ? Simpltry.DataGrid.css.evenRow : Simpltry.DataGrid.css.oddRow)});
	        row.each(function(cell, k) {
	            if(!this.removedColumns[k]) {
    	            var td = Builder.node('td', {}, [cell]);
    	            tr.appendChild(td);
    	        }
	        }.bind(this));
	        if(this.groupedBy != null && rows.length > i + 1 && rows[i][this.groupedBy] != rows[i+1][this.groupedBy]) {
	            $A(tr.getElementsByTagName('TD')).each(function(td) {
	                td.style.paddingBottom = "13px";
                });
	        }
	        tbody.appendChild(tr);
		}.bind(this));
		return tbody;
	},
	
	buildTfoot: function(footerData){
	    var renderFooter = false;
	    var tfoot = Builder.node('tfoot');
	    var tr = Builder.node('tr');
	    tfoot.appendChild(tr);
    	var numCols = this.data.rows[0].length - 1;
	    $R(0, numCols, false).each(function(i) {
            if(!this.removedColumns[i]) {
    	        var td = Builder.node('td', {}, [footerData[i] || ""]);
    	        if(footerData[i]) renderFooter = true;
    	        tr.appendChild(td)
	        }
        }.bind(this));
        if(renderFooter) {
            return tfoot;
        } else {
            return false;
        }
	},
	
	sortData: function(column){
	    this.data.rows = this.data.rows.sortBy(function(v){
		    if(this.numberColumn[column]) {
		        return parseFloat(v[column]);
		    } else {
		        return v[column].toLowerCase();
		    }
		}.bind(this));
	},
	
	sort: function(column, reverse) {
	    this.resetDefaults();
		
		this.sortData(column);
		
		if(reverse) {
		    this.data.rows = this.data.rows.reverse();
		}
		
		this.sortedBy = column;
		this.sortedReverse = reverse;

		this.render();
	},
	
	group: function(column){
	    this.resetDefaults();
	    this.headerControl[column].close();
		this.sortData(column);
		
		this.groupedBy = column;

		this.render();
	},
	
	remove: function(column){
	    this.removedColumns[column] = true;
	    this.headerControl[column].close();
	    this.render();
	},
	
	sumColumn: function(column){
	   var sum = 0;
	   this.data.rows.collect(function(row) {return row[column]}).each(function(cell) {sum += parseFloat(cell)});
	   this.footerData[column] = "sum: " + sum;
	   this.render();
	},
	
	averageColumn: function(column){
	   var sum = 0;
	   this.data.rows.collect(function(row) {return row[column]}).each(function(cell) {sum += parseFloat(cell)});
	   this.footerData[column] = "average: " + Math.round((sum / this.data.rows.length) * 100)/100;
	   this.render();
	},
	
    addHeaderControls: function(){
        this.headerControl = {};
        var displayedCols = [];
        var numCols = this.data.rows[0].length - 1;
        $R(0, numCols, false).each(function(i) {
            if(!this.removedColumns[i]) {
                displayedCols.push(i);
            }
        }.bind(this));
        $$("#" + this.container.id + " ." + Simpltry.DataGrid.css.headerRow + " th").each(function(header, i) {
            if(header.id == null || header.id == "") header.id = this.container.id + "_header" + i;
            var headerControl = Builder.node("div", {className: Simpltry.DataGrid.css.headerControl, style: "display:none"});
            headerControl.id = header.id + "_tooltip";
            var ul = Builder.node("ul");
            var groupLi = Builder.node("li", {}, ['group by']);
            groupLi.onclick = this.group.bind(this, displayedCols[i]);
            ul.appendChild(groupLi);
            var removeLi = Builder.node("li", {}, ['remove']);
            removeLi.onclick = this.remove.bind(this, displayedCols[i]);
            headerControl.appendChild(ul);
            if(this.numberColumn[displayedCols[i]]) {
                var sumLi = Builder.node("li", {}, ['sum']);
                sumLi.onclick = this.sumColumn.bind(this, displayedCols[i]);
                ul.appendChild(sumLi);
                var averageLi = Builder.node("li", {}, ['average']);
                averageLi.onclick = this.averageColumn.bind(this, displayedCols[i]);
                ul.appendChild(averageLi);
            }
            ul.appendChild(removeLi);
            document.body.appendChild(headerControl);
            this.headerControl[displayedCols[i]] = new Simpltry.PopupTooltip(header);
        }.bind(this));
    },
    
    removeHeaderControls: function(){
        $$("#" + this.container.id + " ." + Simpltry.DataGrid.css.headerRow + " th").each(function(header, i) {
            var popup = $(header.id + "_tooltip");
            if(popup) {
                popup.remove();
            }
        });
    },
	
	render: function() {
	    this.removeHeaderControls();
		this.container.innerHTML = '';
		var table = Builder.node('table', {className:Simpltry.DataGrid.css.dataGrid});
		table.appendChild(this.buildThead(this.data.headers));
		table.appendChild(this.buildTbody(this.data.rows));
		var footer = this.buildTfoot(this.footerData);
		if(footer) {
		    table.appendChild(footer);
		}
		this.container.appendChild(table);
		this.addHeaderControls();
	}
	
};
