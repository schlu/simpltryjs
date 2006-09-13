/*
Created On: 09/01/2006
Created By: Nicholas Schlueter -- http://www.simpltry.com
version: .5

This is freely available for noncommercial and commerical use.	I am not responsible for support and 
if this script causes harm directly or indirectly I am not liable for any damages.	Using any part of this 
Code means you agree to the aformentioned conditions.  Please alter this code however you see fit. I do 
ask that you leave every from this point up in tact.

Dependencies: 
	Prototype: 1.5.0_rc0+
	script.aculo.us: 1.6.1+
		-builder
*/

if(!Simpltry) var Simpltry = {};

Simpltry.DateUtil = {
	isValidDate: function(year, month, day){
		month = month - 1;
		var d = new Date(year, month, day);
		return d.getMonth() == month;
	},
	getLastDay: function(year, month) {
		month = month - 1;
		var lastDate = new Date(year, month, 29);
		$R(29, 31, false).each(function(day) {
			if(Simpltry.DateUtil.isValidDate(year, month, day)) {
				lastDate = new Date(year, month, day);
			}
		});
		return lastDate;
	},
	getDateObjects: function(year, month) {
		month = month - 1;
		return $R(1, 31, false).collect(function(day) {
			if(day > 28 && !Simpltry.DateUtil.isValidDate(year, month, day)) {
				throw $break;
			} else {
				return new Date(year, month, day);
			}
		});
	}
};

Simpltry.DatePicker = Class.create();
Simpltry.DatePicker.css = {
	datePicker: "datePicker",
	backYear: "datePickerBackYear",
	backMonth: "datePickerBackMonth",
	forwardMonth: "datePickerForwardMonth",
	forwardYear: "datePickerforwardYear",
	today: "datePickerToday",
	dayHeader: "datePickerDayHeader",
	monthHeader: "datePickerMonthHeader",
	day: "datePickerDay",
	tablePadding: "datePickerTablePadding",
	tableRow: "datePickerTableRow",
	headerRow: "datePickerHeaderRow",
	controlRow: "datePickerControlRow",
	dayHeader: "datePickerHeaderRow",
	weekend: "datePickerWeekend",
	weekday: "datePickerWeekday",
	tbody: "datePickerTbody"
};
Simpltry.DatePicker.ths = {0:"sun", 1:"mon", 2:"tue", 3:"wed", 4:"thu", 5:"fri", 6:"sat"};
Simpltry.DatePicker.months = {1:"January", 2:"Febuary", 3:"March", 4:"April", 5:"May", 6:"June", 7:"July", 8:"August", 9:"September", 10:"October", 11:"November", 12:"December"};
Simpltry.DatePicker.DefaultOptions = {
	onSelect: Prototype.emptyFunction
};
Simpltry.DatePicker.prototype = {
	initialize: function(container, options){
		this.container = container;
		this.setOptions(options);
		if(this.options.month && this.options.year) {
			this.month = this.options.month;
			this.year = this.options.year;
		} else if(this.options.dateString) {
			try {
				var d = new Date(Date.parse(this.options.dateString));
				this.month = d.getMonth() + 1;
				this.year = d.getYear() + 1900;
			} catch(e) {}
		} 
		if(!this.month){
			var today = new Date();
			this.month = today.getMonth() + 1;
			this.year = today.getYear() + 1900; 
		}
		if(this.month == 0) {
			this.year -= 1;
			this.month = 12;
		} else if(this.month == 13) {
			this.year += 1;
			this.month = 1;
		}
		var table = Builder.node("table", {class: Simpltry.DatePicker.css.datePicker});
		var tbody = Builder.node("tbody", {class: Simpltry.DatePicker.css.tbody});
		tbody.appendChild(this.buildDateControls());
		tbody.appendChild(this.buildDateHeader());
		this.buildDates().each(function(row) {
			tbody.appendChild(row);
		});
		table.appendChild(tbody);
		$(this.container).innerHTML = "";
		$(this.container).appendChild(table);
	},
	setOptions: function(options) {
		this.options = $H(Simpltry.DatePicker.DefaultOptions);
		Object.extend(this.options, options || {});
	},
	buildDateControls: function(){
		var tr = Builder.node("tr", {class: Simpltry.DatePicker.css.controlRow});
		var c1 = Builder.node("td", {class: Simpltry.DatePicker.css.backYear}, [Builder.node("a", {href:"#"}, ["<<"])]);
		c1.onclick = function(event) {this.change(this.year-1, this.month); return false;}.bindAsEventListener(this);
		tr.appendChild(c1);
		var c2 = Builder.node("td", {class: Simpltry.DatePicker.css.backMonth}, [Builder.node("a", {href:"#"}, ["<"])]);
		c2.onclick = function(event) {this.change(this.year, this.month-1); return false;}.bindAsEventListener(this);
		tr.appendChild(c2);
		var month = Builder.node("td", {colspan: "3", class: Simpltry.DatePicker.css.monthHeader}, [Simpltry.DatePicker.months[this.month] + " " + this.year]);
		tr.appendChild(month);
		var c3 = Builder.node("td", {class: Simpltry.DatePicker.css.forwardMonth}, [Builder.node("a", {href:"#"}, [">"])]);
		c3.onclick = function(event) {this.change(this.year, this.month+1); return false;}.bindAsEventListener(this);
		tr.appendChild(c3);
		var c4 = Builder.node("td", {class: Simpltry.DatePicker.css.forwardYear}, [Builder.node("a", {href:"#"}, [">>"])]);
		c4.onclick = function(event) {this.change(this.year+1, this.month); return false;}.bindAsEventListener(this);
		tr.appendChild(c4);
		return tr
	},
	change: function(newYear, newMonth){
		new Simpltry.DatePicker(this.container, Object.extend(this.options, {year:newYear, month:newMonth}));
	},
	buildDateHeader: function() {
		var tr = Builder.node("tr", {class: Simpltry.DatePicker.css.headerRow});
		$R(0, 6, false).each(function(i) {
			var td = Builder.node("td", {class: Simpltry.DatePicker.css.dayHeader}, [Simpltry.DatePicker.ths[i]]);
			tr.appendChild(td);
		});
		return tr;
	},
	buildDates: function() {
		var today = new Date();
		var rows = [];
		var firstDate = new Date(this.year, this.month, 1);
		var currentRow = $R(0, firstDate.getDay(), true).collect(function(i) {
			var blankNode = Builder.node("td", {class: Simpltry.DatePicker.css.tablePadding});
			blankNode.innerHTML = "&nbsp;";
			return blankNode;
		});
		Simpltry.DateUtil.getDateObjects(this.year, this.month).each(function(date) {
			var td = Builder.node("td", {class: Simpltry.DatePicker.css.day}, [date.getDate()]);
			if(date.getDay() == 0 || date.getDay() == 6) {
				$(td).addClassName(Simpltry.DatePicker.css.weekend);
			} else {
				$(td).addClassName(Simpltry.DatePicker.css.weekday);
			}
			if(today.getDate() == date.getDate() && today.getMonth() == date.getMonth() && today.getYear() == date.getYear()) {
				$(td).addClassName(Simpltry.DatePicker.css.today);
			}
			td.onclick = function(event) {this.options.onSelect(date.getYear() + 1900, date.getMonth() + 1, date.getDate());}.bindAsEventListener(this);
			currentRow.push(td);
			if(currentRow.length % 7 == 0) {
				rows.push(Builder.node("tr", {class: Simpltry.DatePicker.css.tableRow}, currentRow));
				currentRow = [];
			}
		}.bind(this));
		if(currentRow.length > 0) {
			(7-currentRow.length).times(function(i) {
				var blankNode = Builder.node("td", {class: Simpltry.DatePicker.css.tablePadding});
				blankNode.innerHTML = "&nbsp;";
				currentRow.push(blankNode);
			});
			rows.push(Builder.node("tr", {class: Simpltry.DatePicker.css.tableRow}, currentRow));
		}
		return rows;
	}
};
