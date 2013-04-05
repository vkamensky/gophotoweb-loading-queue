;(function ($) {
	
	var pluginName = 'loadingQueue';
	
	var queue = new Array();
	
	var loading = false;
	
	var buildUrl = function(image, options) {
		
		var url = null;
		
		$.each(options, function(prefix, size) {
			
			if(!url || screen.width > size.width && screen.height > size.width) {
				url = image.data('basePath') + prefix + image.data('fileName');
			}
		});
		
		return url;
	};
	
	var dequeue = function () {
		
		var item = queue.shift();
		
		if(item) {
			
			loading = true;
			
			if(!item.image.is('img')) {
				item.def.reject(item.image);
				dequeue();
				return;
			}
			
			var src = buildUrl(item.image, item.options);
			
			item.image
				.on('load', function() {
					
					item.def.resolve(item.image);
					dequeue();
				})
				.on('error', function() {
					
					item.def.reject(item.image);
					dequeue();
				})
				.attr('src', src);
			
		} else {
			loading = false;
		}
	};
		
	var enqueue = function(image, options) {
		
		var def = $.Deferred();
		
		queue.push({
			def: def,
			image: $(image),
			options: options
		});
				
		return def.promise();
	};
		
	$.fn[pluginName] = function (options) {
		
		var def = enqueue($(this), options);
		
		if(!loading) {
			dequeue();
		}
		
		return def;
	};
	
})(jQuery);
