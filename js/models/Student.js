(function(AN) {
	AN.Models.Student = AN.Models.Base.extend({
        defaults: {
            firstname: 'john',
            lastname: 'doe',
            selected: false
        },
        url: function(){
        	if(this.get('id')){
        		return ajaxurl + '?action=student&id='+this.get('id')+'&gbid='+this.get('gbid')+'&delete_options='+this.get('delete_options');
        	} else {
        		return ajaxurl + '?action=student';
        	}
        }
	});
})(AN || {});