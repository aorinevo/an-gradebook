define(['backbone'],function(Backbone){ 
	var CourseGradebook = Backbone.Model.extend({
  	url: function(){
  	     	return ajaxurl + '?action=get_gradebook_entire&gbid=' + parseInt(this.get('id'));
  		}
	});
	return CourseGradebook;
});
