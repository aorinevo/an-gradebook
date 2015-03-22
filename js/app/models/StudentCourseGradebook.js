(function(AN){
	AN.Models.CourseGradebook = AN.Models.Base.extend({
  	url: function(options){
  	     	return ajaxurl + '?action=get_student_gradebook_entire&gbid=' + AN.GlobalVars.courses.findWhere({selected: true}).get('id');
  		}
	});
})(AN || {});