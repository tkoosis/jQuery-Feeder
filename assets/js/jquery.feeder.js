/*
 * -- Feeder - jQuery plugin for pulling in multiple feed sources (metadata supported) --
 * Author: Telly Koosis // telly (at) incalas.com
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://creativecommons.org/licenses/by-sa/3.0/
 */

(function($) {
	
	var DEBUG = true;
	
	// log shortcut
	function log() {
	    if(DEBUG)
        	if (window.console && window.console.log)
        		window.console.log('[feeder] ' + Array.prototype.join.call(arguments,''));	        
	};
	
	$.fn.feeder = function(options) {
		log(this);
		
		//build main options before element iteration
		var opts = $.extend({}, $.fn.feeder.defaults, options);
		
		// iterate and get feed for each matched element
		return this.each(function() {
			$this = $(this);

			var o = $.meta ? $.extend({}, opts, $this.data()) : opts;  // build element specific options
			if (!o.selector) o.selector = $this; // output inside parent if selector not defined
			
			o.outputFormat = $.fn.feeder.getOutputFormat(this.tagName); 
				
			log("Feed: " + o.feed);
			log("Auth: " + o.auth);
			log("Quantity: " + o.quantity);
			log("Selector: " + o.selector);
			log("Output: " + o.outputFormat);
			log("Date Format: " + o.dateFormat);
			
			var getFeed = $.fn.feeder.feeds[o.feed];
			if ($.isFunction(getFeed)){
				o.displayStatus = "loading";
				$.fn.feeder.setDsiplay(o);
				getFeed(o);
			}else{
				log('unknown feed: ' + o.feed + '; feed pull terminating');
				return false;
			}		
		});
	};

	$.fn.feeder.setDsiplay = function(opts){
		switch(opts.displayStatus)
		{
			case "loading":
			    var loadingUI = opts.loadAnimation ? "<img src='" + opts.loadAnimation + "' alt='Loading...'/>" : "Loading...";
				$(opts.selector).empty().append(loadingUI);
				break;
			default:
				$(opts.selector).empty();// default clear selector content
		}
	};

	// determine output type based on container element type
	$.fn.feeder.getOutputFormat = function(containerType){
		var outputType;
		//log("Parent Element type is: " + containerType);
		switch(containerType)
		{
			case "OL":
			case "UL":
				outputType = "li";
				break;
			case "DL":
				outputType = "dt";
				break;
			case "DT":
				outputType = "dd";
				break;
			default:
			 	outputType = "div"; // default
		}
		
		//log("Output Format is: " + outputType);

		return outputType;	
	};

	$.fn.feeder.display = function(opts) {
		log(":: Entering feeder.display ::");
		log(":: opts.selector here is "+ opts.selector +" ::");
		opts.displayStatus = "complete"; 
		$(opts.selector).empty().append(opts.returnFeed);
	};

	// report on obj
	$.fn.feeder.reporter = function(obj){
		var objInfo = "";
		for(property in obj) {
	    	objInfo += (property + ": " + obj[property] + "\n");
		}
		//alert("== OBJECT PARAMS & VALUES ==\n" + objInfo);
		return objInfo;
	};
	
	$.fn.feeder.cleanStr = function(dirtyStr){
		var trimmedStr, cleanedStr = "";
		trimmedStr = jQuery.trim(dirtyStr);// trim()
		cleanedStr = trimmedStr.replace(/\s+/g,'-').replace(/[^a-zA-Z0-9\-]/g,'').replace(/\-{2,}/g,'-').toLowerCase(); //all lowercase, replace spaces with "-"
		
		return cleanedStr;
	};	

    $.fn.feeder.formatData = function(feed){
		log(":: Formatting Data ::");
		var formattedData = ""; // reset
		var feedLength = feed["entries"].length - 1; // zer0-based
		var index = 0;
		log(":: Feed Length :: " + feedLength);
		
		if (feedLength > 0){
			while (index <= feedLength) // zero based
			{
				formattedData += "<" + o.outputFormat + " class='" + $.fn.feeder.cleanStr(feed.entries[index].via["name"]) + "'>"; // open feed container

				// date - needs formatting options
				formattedData += "<" + o.outputFormat + " class='date'>"; // open date
				formattedData += feed.entries[index].date;
	    		formattedData += "</" + o.outputFormat + ">"; // close date

				// content
				formattedData += "<" + o.outputFormat + " class='content'>"; // open content
				formattedData += feed.entries[index].body;
	    		formattedData += "</" + o.outputFormat + ">"; // close date

				// link - pending, may not be possible

				// comments, if any - delicious only
				if ($.fn.feeder.cleanStr(feed.entries[index].via["name"]) == "delicious"){
					if (feed.entries[index].comments){
						formattedData += "<" + o.outputFormat + " class='comments'>"; // open comments
						for (comment in feed.entries[index].comments){
							formattedData += "<" + o.outputFormat + " class='comment'>"; // open comment
							formattedData += feed.entries[index].comments[comment]["body"];
							formattedData += "</" + o.outputFormat + ">"; // close comment
						}
						formattedData += "</" + o.outputFormat + ">"; // close comments
					}
				}

				// source
				formattedData += "<" + o.outputFormat + " class='source'>"; // open source
				formattedData += "<a href='" + feed.entries[index].via["url"] + "' target='_blank'>" + feed.entries[index].via["name"] + "</a>";
	    		formattedData += "</" + o.outputFormat + ">"; // close source
				formattedData += "</" + o.outputFormat + ">"; // close feed container					
				index++; // next entry
			}    
            	log(":: Friend Feed Comment body :: " + formattedData);
				return formattedData;
		}else{
            log(":: Friend Feed Comment body :: NO RESULTS FOUND");
		    return "No results."
		}


	// feed definitions
	$.fn.feeder.feeds = {
			friendfeed: function(o) {
			// API: http://friendfeed.com/api/documentation
			log(":: Getting Friend Feed ::");	
			$.getJSON("http://friendfeed-api.com/v2/feed/"+o.auth+"?num="+o.quantity+"&maxcomments=auto&maxlikes=0&callback=?",
				function(data){
					log(":: Got Friend Feed ::");	
					o.returnFeed = formatData(eval(data));
					log(":: Sending to display ::");
					$.fn.feeder.display(o); // send to display
				});
				
				
			}
		}
	};

	// defaults
	$.fn.feeder.defaults = {
		feed: 		null, // feed to get (active options: 'friendfeed'), required
		auth: 		null, // necessary feed account name/id, default = null, required
		selector: 	null, // selector to append results to, default: parent element, optional
		output: 	null, // output format type (li, div), automatically determined by parent type
		quantity:	1, //  number of results to return, default = 20
		returnFeed: "", // formatted string of feed, default = feed dependant
		dateFormat: "%Y-%m-%dT%H:%M:%SZ",// formatting of feed dates, inactive
		loadAnimation:	"" // just use a text string if not set
	};
	
})(jQuery);