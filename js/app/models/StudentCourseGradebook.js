define(['backbone'],function(Backbone){ 
	var StudentCourseGradebook = Backbone.Model.extend({
  	url: function(){
  	     	return ajaxurl + '?action=get_student_gradebook_entire&gbid=' + parseInt(this.get('id'));
  		}
	});
	return StudentCourseGradebook;
});