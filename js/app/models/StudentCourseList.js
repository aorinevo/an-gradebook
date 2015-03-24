define(['backbone','models/StudentCourse'],
function(Backbone,StudentCourse){ 
	var StudentCourses = Backbone.Collection.extend({
	model: StudentCourse,
  	url: function(){
  	     	return ajaxurl + '?action=get_student_courses';
  		}
	});
	return StudentCourses;
});