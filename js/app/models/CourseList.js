define(['backbone','models/Course'],function(Backbone,Course){ 
	var Courses = Backbone.Collection.extend({
		model: Course,
		url: function(){
			return ajaxurl + '?action=course_list';
		},
		comparator: 'year',
		parse: function(response){
			return response.course_list;
		}
	});
	return Courses;
});
	