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

Simpltry.DateUtil = {
  isValidDate: function(year, month, day){
    month = month;
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
  datePickerWrapper: "datePickerWrapper",
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
  controlTable: "datePickerControlTable",
  weekend: "datePickerWeekend",
  weekday: "datePickerWeekday",
  tbody: "datePickerTbody",
  cancelRow: "datePickerCancelRow",
  cancel: "datePickerCancel",
  selected: "datePickerSelected"
};
Simpltry.DatePicker.ths = ["sun","mon","tue","wed","thu","fri","sat"];
Simpltry.DatePicker.months = {1:"January", 2:"February", 3:"March", 4:"April", 5:"May", 6:"June", 7:"July", 8:"August", 9:"September", 10:"October", 11:"November", 12:"December"};
Simpltry.DatePicker.prototype = {
  initialize: function(container, options) {
    this.css = Simpltry.DatePicker.css;
    this.container = $(container);
    this.setOptions(options);
    if(this.options.month != null && this.options.year) {
      this.month = this.options.month;
      this.year = this.options.year;
    } else if(this.options.dateString) {
      try {
        var d = new Date(Date.parse(this.options.dateString));
        this.month = d.getMonth() + 1;
        this.year = d.getFullYear();
        this.day = d.getDate();
        this.options.selectedDate.month = this.month;
        this.options.selectedDate.year = this.year;
        this.options.selectedDate.day = this.day;
      } catch(e) {};
    }
    if(!this.month){
      var today = new Date();
      this.month = today.getMonth() + 1;
      this.year = today.getFullYear();
    }
    if(this.month == 0) {
      this.year -= 1;
      this.month = 12;
    } else if(this.month == 13) {
      this.year += 1;
      this.month = 1;
    }
    var tbody = Builder.node("tbody", {className: this.css.tbody}, [this.buildDateHeader()]);
    
    this.buildDates().each(function(row) {
      tbody.appendChild(row);
    });
    if(this.options.showCancel) tbody.appendChild(this.buildCancel());
    this.container.innerHTML = "";
    this.container.appendChild(Builder.node("div", {className: this.css.datePickerWrapper}, [this.buildDateControls(), Builder.node("table", {className: this.css.datePicker, cellspacing:0, cellpadding:0}, tbody)]));
  },
  setOptions: function(options) {
    this.options = {
      onSelect: Prototype.emptyFunction,
      onCancel: Prototype.emptyFunction,
      showCancel: false,
      selectedDate: {day:null, month:null, year:null}
    };
    Object.extend(this.options, options || {});
  },
  buildDateControls: function(){
    var tr = Builder.node("tr");
    var c1 = Builder.node("td", {className: this.css.backYear}, [this.buildA("<<")]);
    var c2 = Builder.node("td", {className: this.css.backMonth}, [this.buildA("<")]);
    var month = Builder.node("td", {className: this.css.monthHeader}, [Simpltry.DatePicker.months[this.month] + " " + this.year]);
    var c3 = Builder.node("td", {className: this.css.forwardMonth}, [this.buildA(">")]);
    var c4 = Builder.node("td", {className: this.css.forwardYear}, [this.buildA(">>")]);
    [[c1, -1, 0], [c2, 0, -1], [c3, 0, 1], [c4, 1, 0]].each(function(c) {$(c[0]).observe("click", this.changeEvent.bindAsEventListener(this, c[1], c[2]));}.bind(this));
    [c1, c2, month, c3, c4].each(function(c) {tr.appendChild(c);});
    return Builder.node("table", {className: this.css.controlTable}, [Builder.node("tbody", {}, [tr])]);;
  },
  buildA: function(text){
    return Builder.node("a", {href:"#"}, [text]);
  },
  changeEvent: function(event, yearDelta, monthDelta){
    Event.stop(event);
    this.change(this.year + yearDelta, this.month + monthDelta);
  },
  change: function(newYear, newMonth){
    new Simpltry.DatePicker(this.container, Object.extend(this.options, {year:newYear, month:newMonth}));
  },
  buildDateHeader: function() {
    var tr = Builder.node("tr", {className: this.css.headerRow});
    Simpltry.DatePicker.ths.each(function(th) {
      tr.appendChild(Builder.node("th", {className: this.css.dayHeader}, [th]));
    }.bind(this));
    return tr;
  },
  buildDates: function() {
    var today = new Date();
    var rows = [];
    var firstDate = new Date(this.year, this.month-1, 1);
    var currentRow = [];
    if(firstDate.getDay() != 0) {
      currentRow = $R(0, firstDate.getDay(), true).collect(function(i) {
        var blankNode = Builder.node("td", {className: this.css.tablePadding});
        blankNode.innerHTML = "&nbsp;";
        return blankNode;
      }.bind(this));
    }
    Simpltry.DateUtil.getDateObjects(this.year, this.month).each(function(date) {
      var td = $(Builder.node("td", {className: this.css.day}, [date.getDate()]));
      if(date.getDay() == 0 || date.getDay() == 6) {
        td.addClassName(this.css.weekend);
      } else {
        td.addClassName(this.css.weekday);
      }
      if(today.getDate() == date.getDate() && today.getMonth() == date.getMonth() && today.getFullYear() == date.getFullYear()) td.addClassName(this.css.today);
      if(this.options.selectedDate.day && this.options.selectedDate.day == date.getDate() && this.options.selectedDate.month == date.getMonth() + 1 && this.options.selectedDate.year == date.getFullYear()) {
        td.addClassName(this.css.selected);
        this.selectedCell = td;
      }
      td.observe("click", this.tdClick.bindAsEventListener(this, date));
      currentRow.push(td);
      if(currentRow.length % 7 == 0) {
        rows.push(Builder.node("tr", {className: this.css.tableRow}, currentRow));
        currentRow = [];
      }
    }.bind(this));
    if(currentRow.length > 0) {
      (7-currentRow.length).times(function(i) {
        currentRow.push($(Builder.node("td", {className: this.css.tablePadding})).update("&nbsp;"));
      }.bind(this));
      rows.push(Builder.node("tr", {className: this.css.tableRow}, currentRow));
    }
    return rows;
  },
  tdClick: function(event, date) {
    var td = Event.element(event);
    if(this.selectedCell) {
      this.selectedCell.removeClassName(this.css.selected);
    }
    this.selectedCell = td;
    this.options.selectedDate.day = date.getDate();
    this.options.selectedDate.month = date.getMonth() + 1;
    this.options.selectedDate.year = date.getFullYear();
    td.addClassName(this.css.selected);
    this.options.onSelect(this.options.selectedDate.year, date.getMonth() + 1, date.getDate());
  },
  buildCancel: function() {
    var tr = Builder.node('tr', {className: this.css.cancelRow});
    var td = Builder.node("td",{colspan:7});
    var div = Builder.node('div',{className: this.css.cancel}, ['cancel']);
    div.onclick = function(event) {if(this.day) {this.options.onCancel(this.year, this.month, this.day);}else{this.options.onCancel();}}.bindAsEventListener(this);
    td.appendChild(div);
    tr.appendChild(td);
    return tr;
  },
  currentDateString: function() {
    var currentDateString = null;
    if(this.options.selectedDate.month && this.options.selectedDate.day && this.options.selectedDate.year) currentDateString = this.options.selectedDate.month + "/" + this.options.selectedDate.day + "/" + this.options.selectedDate.year;
    return currentDateString;
  }
};

Simpltry.TimePicker = Class.create();
Simpltry.TimePicker.css = {
  timePicker: "timePicker",
  timePickerHourHeader: "timePickerHourHeader",
  timePickerMinuteHeader: "timePickerMinuteHeader",
  timePickerMinutes: "timePickerMinutes",
  timePickerMinute: "timePickerMinute",
  timePickerHours: "timePickerHours",
  timePickerHour: "timePickerHour",
  timePickerAmPm: "timePickerAmPm",
  timePickerAM: "timePickerAM",
  timePickerPM: "timePickerPM",
  timePickerMinuteSelected: "timePickerMinuteSelected",
  timePickerHourSelected: "timePickerHourSelected",
  timePickerAmPmSelected: "timePickerAmPmSelected",
  timePickerClose: "timePickerClose"
};
Simpltry.TimePicker.prototype = {
  initialize: function(container, options){
    this.css = Simpltry.TimePicker.css;
    this.container = $(container);
    this.setOptions(options);
    if(this.options.timeString) {
      if(matchParts = this.options.timeString.match(/^(\d{1,2}):(\d{2})(AM|PM)$/)) {
        this.options.selectedTime.hour = matchParts[1];
        this.options.selectedTime.minute = matchParts[2];
        this.options.selectedTime.amPm = matchParts[3];
      }
    }
    this.container.appendChild(this.buildTimes());
  },
  setOptions: function(options){
    this.options = {
      onTimeSelected: Prototype.emptyFunction,
      onClose: Prototype.emptyFunction,
      selectedTime: {hour:null, minute:null, amPm:null},
      showClose: false
    };
    Object.extend(this.options, options || {});
  },
  buildTimes: function() {
    var timePickerNodes = Builder.node("div", {className: this.css.timePicker}, [Builder.node("div", {className: this.css.timePickerHourHeader}, "Hour"), Builder.node("div", {className: this.css.timePickerMinuteHeader}, "Minute"), this.buildHours(), this.buildMinutes(), this.buildAmPm()]);
    if(this.options.showClose) {
      var closeNode = Builder.node("div", {className: this.css.timePickerClose}, "Close");
      $(closeNode).observe("click", function(event) {this.options.onClose();}.bindAsEventListener(this));
      timePickerNodes.appendChild(closeNode);
    }
    return timePickerNodes;
  },
  buildHours: function() {
    return Builder.node("div", {className: this.css.timePickerHours}, $w("12 1 2 3 4 5 6 7 8 9 10 11").collect(function(number) {
      var hourField = Builder.node("div", {className: this.css.timePickerHour + (this.options.selectedTime.hour == parseInt(number, 10) ? " " + this.css.timePickerHourSelected : "")}, number);
      $(hourField).observe("click", this.hourClicked.bindAsEventListener(this, number, this.css.timePickerHourSelected));
      return hourField;
    }.bind(this)));
  },
  buildMinutes: function() {
    return Builder.node("div", {className: this.css.timePickerMinutes}, $w("00 05 10 15 20 25 30 35 40 45 50 55").collect(function(number) {
      var minuteField = Builder.node("div", {className: this.css.timePickerMinute + (this.options.selectedTime.minute == parseInt(number, 10) ? " " + this.css.timePickerMinuteSelected : "")}, number);
      $(minuteField).observe("click", this.minuteClicked.bindAsEventListener(this, number));
      return minuteField;
    }.bind(this)));
  },
  buildAmPm: function() {
    return Builder.node("div", {className: this.css.timePickerAmPm}, $w("AM PM").collect(function(amPm) {
      var amPmField = Builder.node("div", {className: this.css["timePicker" + amPm] + (this.options.selectedTime.amPm == amPm ? " " + this.css.timePickerAmPmSelected : "")}, amPm);
      $(amPmField).observe("click", this.amPmClicked.bindAsEventListener(this, amPm, this.css.timePickerAmPmSelected));
      return amPmField;
    }.bind(this)));
  },
  minuteClicked: function(event, value){
    var target = Event.element(event);
    this.options.selectedTime.minute = value;
    this.valueClicked(target, this.css.timePickerMinuteSelected);
  },
  hourClicked: function(event, value){
    var target = Event.element(event);
    this.options.selectedTime.hour = value;
    this.valueClicked(target, this.css.timePickerHourSelected);
  },
  amPmClicked: function(event, value){
    var target = Event.element(event);
    this.options.selectedTime.amPm = value;
    this.valueClicked(target, this.css.timePickerAmPmSelected);
  },
  valueClicked: function(target, className){
    target.siblings().each(function(element) {element.removeClassName(className);});
    target.addClassName(className);
    this.fireTimeSelected();
  },
  fireTimeSelected: function() {
    if(this.options.selectedTime.hour && this.options.selectedTime.minute && this.options.selectedTime.amPm) this.options.onTimeSelected(this.options.selectedTime.hour, this.options.selectedTime.minute, this.options.selectedTime.amPm);
  },
  currentTimeString: function() {
    var currentTimeString = null;
    if(this.options.selectedTime.hour && this.options.selectedTime.minute && this.options.selectedTime.amPm) currentTimeString = this.options.selectedTime.hour + ":" + this.options.selectedTime.minute + this.options.selectedTime.amPm;
    return currentTimeString;
  }
};

Simpltry.buildDateField = function(element, options) {
  element.autoComplete = "false";
  var handle = element;
  if(options.handle) handle = $(options.handle);
  var popup = Builder.node("div", {id: handle.id + "_tooltip", style: "display:none;"}, ["test"]);
  document.body.appendChild(popup);
  var toolTip = new Simpltry.ClickTooltip(handle, {offsetLeft:9,toggle:true,direction:"right"});
  new Simpltry.DatePicker(popup, {
    onSelect: function(year, month, day) {
      element.value = month + "/" + day + "/" + year;
      toolTip.close();
    },
    onCancel: function() {
      toolTip.close();
    },
    showCancel: true,
    dateString: (element.value != "" ? element.value : null)
  });
};
Simpltry.buildDateTimeField = function(element, options) {
  element.autoComplete = "false";
  var dateParts = element.value.split(/ at /);
  var datePart = dateParts[0];
  var timePart = "";
  if(dateParts.length > 1) timePart = dateParts[1];
  var handle = element;
  if(options.handle) handle = $(options.handle);
  var popup = Builder.node("div", {id: handle.id + "_tooltip", style: "display:none;"});
  var timeDiv = Builder.node("div");
  var dateDiv = Builder.node("div");
  popup.appendChild(dateDiv);
  popup.appendChild(timeDiv);
  document.body.appendChild(popup);
  var toolTip = new Simpltry.ClickTooltip(handle, {offsetLeft:9,toggle:true,direction:"right"});
  var dp = new Simpltry.DatePicker(dateDiv, {
    onSelect: function(year, month, day) {
      var currentTimeString =  tp.currentTimeString();
      if(currentTimeString) {
        currentTimeString = " at " + currentTimeString;
      } else {
        currentTimeString = "";
      }
      element.value = month + "/" + day + "/" + year + currentTimeString;
    },
    dateString: datePart
  });
  var tp = new Simpltry.TimePicker(timeDiv, {
    timeString: timePart,
    showClose: true,
    onClose: function() {toolTip.close();},
    onTimeSelected: function(hour, minute, amPm){
      var currentDateString =  dp.currentDateString();
      if(currentDateString) {
        currentDateString += " at ";
      } else {
        currentDateString = "";
      }
      element.value = currentDateString + hour + ":" + minute + amPm;
    }
  });
};

if(Simpltry.Widgets) {
  Simpltry.Widgets.register('date_picker', function(element, options) {
    if(element.tagName == 'INPUT' && element.type == 'text') {
      Simpltry.buildDateField(element, options);
    } else {
      new Simpltry.DatePicker(element, options);
    }
  });
  Simpltry.Widgets.register('date_time_picker', function(element, options) {
    if(element.tagName == 'INPUT' && element.type == 'text') {
      Simpltry.buildDateTimeField(element, options);
    }
  });
}
