(function(AN){
	AN.Models.Course = AN.Models.Base.extend({
        defaults: {
            name: 'Calculus I',
            school: 'Bergen',
            semester: 'Fall',
            year: '2014',
            selected: false
        },
        url: function(){        	
        	if(this.get('id')){
        		return ajaxurl + '?action=course&id='+this.get('id');
        	} else{
        		return ajaxurl + '?action=course';
        	}
        },
        export2csv: function(){
        	window.location.assign(ajaxurl + '?action=get_csv&id='+this.get('id'));
        }
	});
})(AN || {});