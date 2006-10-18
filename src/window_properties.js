Simpltry.WindowProperties = {
	getHorizontalScroll: function() {
		return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
	},
	getVerticalScroll: function() {
		return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
	},
	getBrowserSize: function() {
		var bWidth;
		var bHeight;
		if(document.documentElement && document.documentElement.clientHeight) {
			bWidth = document.documentElement.clientWidth - 8;
			bHeight = document.documentElement.clientHeight;
		} else {
			bWidth = document.body.clientWidth;
			bHeight = document.body.clientHeight;
		}
		return {width: bWidth, height: bHeight};
	},
	getContentSize: function(ignore) {
	    if(ignore) {
	        ignore.hide();
	    }
		var bodyHeight;
		var bodyWidth;
		if (window.innerHeight && window.scrollMaxY) {
			bodyHeight = window.innerHeight + window.scrollMaxY;
		} else if (document.body.scrollHeight > document.body.offsetHeight){
			bodyHeight = document.body.scrollHeight;
		} else {
			bodyHeight = document.body.offsetHeight;
		} 
		if (window.innerWidth && window.scrollMaxX) {
			bodyWidth = document.body.scrollWidth + window.scrollMaxX;
		} else if (document.body.scrollWidth > document.body.offsetWidth){
			bodyWidth = document.body.scrollWidth;
		} else {
			bodyWidth = document.body.offsetWidth;
		}
		var browserSize = Simpltry.WindowProperties.getBrowserSize();
		if(ignore) {
		    ignore.show();
		}
		var calculatedHeight = browserSize.height;
		var calculatedWidth = browserSize.width;
		
		if(bodyWidth > calculatedWidth) calculatedWidth = bodyWidth;
		if(bodyHeight > calculatedHeight) calculatedHeight = bodyHeight;
		return {height: calculatedHeight, width: calculatedWidth};
	}
};