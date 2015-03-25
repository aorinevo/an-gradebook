(function(AN){
	AN.Collections.ANGradebooks = AN.Collections.Base.extend({
  	model: AN.Models.ANGradebook,
  	url: function(){
  	     	return ajaxurl + '?action=get_courses';
  		}
	});
})(AN || {});