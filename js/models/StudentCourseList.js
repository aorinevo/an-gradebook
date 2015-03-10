(function(AN){
	AN.Collections.Courses = AN.Collections.Base.extend({
	model: AN.Models.Course,
  	url: function(){
  	     	return ajaxurl + '?action=get_student_courses';
  		}
	});
})(AN || {});
	