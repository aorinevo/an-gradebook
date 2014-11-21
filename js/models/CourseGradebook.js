AN.Models.CourseGradebook = (function(my,AN){
	my = AN.Models.Base.extend({
  	url: function(options){
  	     	return ajaxurl + '?action=get_gradebook_entire&gbid=' + AN.GlobalVars.courses.findWhere({selected: true}).get('id');
  		}
	});
	return my;
})(AN.Models.CourseGradebook||{},AN);