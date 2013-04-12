;(function ($) {
	
	var pluginName = 'loadingQueue';
	
	var LoadingQueue = function() {
		
		var self = this;
		
		this.queue = new Array();
		
		this.loading = false;
		
		this.buildUrl = function(image, options) {
			
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
		
		this.dequeue = function () {
			
			var item = this.queue.shift();
			
			if(item) {
				
				this.loading = true;
				
				if(!item.image.is('img')) {
					this.dequeue();
					return;
				}
				
				var src = this.buildUrl(item.image, item.options);
				
				item.image
					.on('load', function() {
											
						item.image.trigger('loaded');
						
						self.dequeue();
					})
					.on('error', function() {
						
						self.dequeue();
					})
					.attr('src', src);
				
			} else {
				this.loading = false;
			}
		};
			
		this.enqueue = function(image, options) {
			
			this.queue.push({
				image: $(image),
				options: options
			});				
		};
	};	
		
	$.fn[pluginName] = function (options) {
		
		var q = new LoadingQueue();
		
		$(this).each(function() {
			
			q.enqueue($(this), options);
			
			if(!q.loading) {
				q.dequeue();
			}
			
		});		
		
		return this;
	};
	
})(jQuery);
