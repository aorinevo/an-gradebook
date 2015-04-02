define(['backbone'],function(Backbone){ 
	var CourseGradebook = Backbone.Model.extend({
  	url: function(){
  		if(this.get('role').get('role')==='instructor'){
  	     	return ajaxurl + '?action=get_gradebook_entire&gbid=' + parseInt(this.get('course').get('id'));
  	     }else{
  	     	return ajaxurl + '?action=get_student_gradebook_entire&gbid=' + parseInt(this.get('course').get('id'));  	     	
  	     }
  		}
	});
	return CourseGradebook;
});
