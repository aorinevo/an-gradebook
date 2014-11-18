AN.Collections.ANGradebooks = (function(my){
	my = AN.Collections.Base.extend({
  	model: AN.Models.ANGradebook,
  	url: function(){
  	     	return ajaxurl + '?action=get_courses';
  		}
	});
	return my;
})(AN.Collections.ANGradebooks||{});