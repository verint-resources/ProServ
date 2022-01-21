/*! Widget to display Search Professional curator rules as announcements
	Based on JQuery UI Widget Factory
	J Elwood, Feb 2021
*/

(function($) { // Hide scope, no $ conflict
	'use strict';

	var definition = {
		options: {
			linktarget: '_blank',
			searchurl: '',
			query: 'alerts',
			maxlength: '5',
			searchcollection: '',
			displaydescription: true,
			searchqueryoptions: ''
		},
		_create: function() {
			this.element.addClass(this.widgetFullName || this.widgetBaseClass);
			this._refresh();
		},
		_refresh: function() {
			this.clear();
			var target = this.element;
			var options = this.options;
			var fb_api = options.searchurl + '/s/search.json?collection=';
				fb_api += options.searchcollection + '&query='; 
				fb_api += options.query + options.searchqueryoptions;
			var html = '';
			$.get( fb_api, function( data ) {
			    var length = data.response.curator.exhibits.length;
    			if(length > options.maxlength){
    				length = options.maxlength;
    			}
    			for(var i = 0; i < length; i++) {
    				var exhibit = data.response.curator.exhibits[i];
    				if(typeof exhibit.messageHtml == "undefined"){
    				        html += '<div class="curatoritem"><a target="' + options.linktarget + '" href="' + exhibit.linkUrl + '">'+ exhibit.titleHtml + '</a>'; 
    					if(options.displaydescription){
    						html += '<div class="itemdesc">'+ exhibit.descriptionHtml + '</div>';  
    					}
						html+= '</div>';
    				}
    				else {
    				    html += '<div class="curatoritem">' + exhibit.messageHtml + '</div>';
    				}
    			}	
			    target.append(html);
		    });

		},
		clear: function() {
			if (this.options.disabled) {
				return;
			}
			this.element.find('div.curatoritem').remove();
			this.element.find('div.itemdesc').remove();
		},
		query: function(value) {
			if (this.options.disabled) {
				return;
			}
			this.options.query = value;
			this._refresh();	
		},
		maxlength: function(value) {
			if (this.options.disabled) {
				return;
			}
			this.options.maxlength = value;
			this._refresh();	
		},
		_destroy: function() {
			this.element.removeClass(this.widgetFullName || this.widgetBaseClass);
			this.clear();
		}
	};

	if (!$.Widget.prototype._destroy) {
		$.extend(definition, {
			destroy: function() {
				this._destroy();
				$.Widget.prototype.destroy.call(this); 
			}
		});
	}

	if ($.Widget.prototype._getCreateOptions === $.noop) {
		$.extend(definition, {
			_getCreateOptions: function() {
				return $.metadata && $.metadata.get(this.element[0])[this.widgetName];
			}
		});
	}
	$.widget('cmpro.announcements', definition);

	// Make options more accessible
	$.cmpro.announcements.options = $.cmpro.announcements.prototype.options;

})(jQuery);