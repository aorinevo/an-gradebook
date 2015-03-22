define(['backbone'],function(Backbone){ 
	var Student = Backbone.Model.extend({
        defaults: {
            firstname: 'john',
            lastname: 'doe',
            selected: false,
            user_login: null
        },
        url: function(){
        	console.log('ajaxing');
        	if(this.get('id')){
        		return ajaxurl + '?action=student&id='+this.get('id')+'&gbid='+this.get('gbid')+'&delete_options='+this.get('delete_options');
        	} else {
        		return ajaxurl + '?action=student';
        	}
        }
	});
	return Student;
});
