define(['backbone','models/Course'],function(Backbone,Course){ 
	var Courses = Backbone.Collection.extend({
	model: Course,
  	url: function(){
  	     	return ajaxurl + '?action=get_courses';
  		}
	});
	return Courses;
});
	