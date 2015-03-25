define(['backbone'],function(Backbone){ 
	var StudentCourse = Backbone.Model.extend({
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
        	} else {
        		return ajaxurl + '?action=course';
        	}
        }
	});
	return StudentCourse;
});