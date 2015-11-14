define(['backbone','underscore'],function(Backbone,_){ 
	var Settings = Backbone.Model.extend({
        defaults : {
    		administrator: true,
    		editor: false,
        	contributor: false,
        	author: false,
    		subscriber: false
    	},	
        url: function(){
        	if(this.get('action')!=='save'){
        		return ajaxurl + '?action=an_gradebook_get_settings';
        	} else {
        		return ajaxurl + '?action=an_gradebook_set_settings';        		
        	}
        },
        parse: function(response){
        	return response.gradebook_administrators;
        }
	});
	return Settings;
});
