;(function ($) {
	
	var pluginName = 'loadingQueue';
	
	var queue = new Array();
	
	var loading = false;
	
	var buildUrl = function(image, options) {
		
		var url = null;
		
		if(options) {
			
			$.each(options, function(prefix, size) {
				
				if(!url || screen.width > size.width && screen.height > size.width) {
					url = image.data('basePath') + prefix + image.data('fileName');
				}
			});
			
		} else if(image.data('src')) {
			
			url = image.data('src');
		
		} else {
			
			url = image.data('basePath') + image.data('fileName');
		}
		
		return url;
	};
	
	var dequeue = function () {
		
		var item = queue.shift();
		
		if(item) {
			
			loading = true;
			
			if(!item.image.is('img')) {
				dequeue();
				return;
			}
			
			var src = buildUrl(item.image, item.options);
			
			item.image
				.on('load', function() {
					
					item.image.trigger('loaded');
					
					dequeue();
				})
				.on('error', function() {
					
					dequeue();
				})
				.attr('src', src);
			
		} else {
			loading = false;
		}
	};
		
	var enqueue = function(image, options) {
		
		queue.push({
			image: $(image),
			options: options
		});				
	};
		
	$.fn[pluginName] = function (options) {
		
		$(this).each(function() {
			
			enqueue($(this), options);
			
			if(!loading) {
				dequeue();
			}
			
		});		
		
		return this;
	};
	
})(jQuery);
