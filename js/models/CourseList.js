AN.Collections.Courses = (function(my){
	my = AN.Collections.Base.extend({
	model: AN.Models.Course,
  	url: function(){
  	     	return ajaxurl + '?action=get_courses';
  		}
	});
	return my;	
})(AN.Collections.Courses||{});
	