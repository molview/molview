/*!
MolView v2.2 (http://molview.org)
Copyright (c) 2014, Herman Bergwerf
ALL RIGHTS RESERVED
*/

//jQuery plugin
$.fn.share = function(url, display_count, message)
{
	var default_msg = "View chemical structures using this free webapp!";
	
	this.children().each(function()
	{
		if($(this).hasClass("share-facebook"))
		{
			var self = $(this);
			self.empty().unbind();
			
			if(display_count)
			{
				AJAX({
					url: "https://api.facebook.com/method/fql.query?query=" + encodeURIComponent("select total_count from link_stat where url='" + (url.fb || url.all) + "'") + "&format=json&callback=?",
					dataType: "jsonp",
					success: function(data)
					{
						self.data("total_count", data[0].total_count);
						$("<span></span>").html("" + data[0].total_count + " Likes")
							.appendTo(self);
					}
				});
			}
			else $("<span></span>").html("Facebook").appendTo(self);
			
			self.on("click", function()
			{
				window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url.fb || url.all));
			});
		}
		else if($(this).hasClass("share-twitter"))
		{
			var self = $(this);
			self.empty().unbind();
				
			if(display_count)
			{
				AJAX({
					url: "http://cdn.api.twitter.com/1/urls/count.json?url=" + encodeURIComponent(url.twitter || url.all) + "&callback=?",
					dataType: "jsonp",
					success: function(data)
					{
						self.data("count", data.count);
						$("<span></span>").html("" + data.count + " Tweets")
							.appendTo(self);
					}
				});
			}
			else $("<span></span>").html("Twitter").appendTo(self);
			
			self.on("click", function()
			{
				window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(message || default_msg) + "&url=" + encodeURIComponent(url.twitter || url.all) + "&via=molview");
			});
		}
		else if($(this).hasClass("share-googleplus"))
		{
			var self = $(this);
			self.empty().unbind();
				
			if(display_count)
			{
				AJAX({
					url: "gplus.php?url=" + encodeURIComponent(url.gplus || url.all),
					dataType: "json",
					success: function(data)
					{
						self.data("count", data.count);
						$("<span></span>").html("" + data.count + " +1's")
							.appendTo(self);
					}
				});
			}
			else $("<span></span>").html("Google+").appendTo(self);
			
			self.on("click", function()
			{
				window.open("https://plus.google.com/share?hl=en-US&url=" + encodeURIComponent(url.gplus || url.all));
			})
		}
	});
};

