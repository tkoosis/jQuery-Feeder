/*
 * -- jQuery Feeder Plugin Feed Definitions -- 
 * This script is a plugin for the jQuery Feeder Plugin
 * Idea credited to: M. Alsup - http://malsup.com/jquery/cycle/
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://creativecommons.org/licenses/by-sa/3.0/
 *
 * The functions below define one-time feed initialization for the named feeds.
 * Feel free to update with specific feed request types, unique formatting callback handing, etc.
 * To save file size, remove any of them that you don't need.
 *
 */
(function($) {

    
	// twitter - json
	$.fn.feeder.feeds.twitter = function(o){
	    var url = ""
		console.log(":: Entering twitter feed ::");	
		// http://apiwiki.twitter.com/REST+API+Documentation
        // $.ajax(URL, {
        //             crossDomain:true, 
        //             dataType: "jsonp", 
        //             success:function(data,text,xhqr){
        //                 $.each(data, function(i, item) {
        //                     alert(item);
        //                 });
        //             }
        //         });
		
		$.getJSON("http://twitter.com/statuses/user_timeline/"+o.auth+".json?count="+o.quantity+"&callback=?",
			function(data){
				// format data here...
    		}
		);
	};

	// INACTIVE: delicious - json
	$.fn.feeder.feeds.delicious = function(o)
	{
		//http://delicious.com/help/feeds
		$.getJSON("http://feeds.delicious.com/v2/json/"+o.auth+"?count="+o.quantity+"&callback=?",
			function(data) {
				// format data here...
			}
		);
	};

	// INACTIVE: flickr - json
	$.fn.feeder.feeds.flickr = function(o)
	{
		//http://www.flickr.com/services/api/
		//http://www.flickr.com/services/api/keys/
		$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?id="+o.auth+"&format=json&jsoncallback=?",
	        function(data) {
				// format data here...
	        }
		);
	};
})(jQuery);
