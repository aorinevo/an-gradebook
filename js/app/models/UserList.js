define(['backbone', 'models/User'],function(Backbone, User){ 
	var UserCourseList = Backbone.Collection.extend({
		model: User,
		search: '',
        comparator: 'last_name',
		url: function(){
		   return ajaxurl + '?action=angb_user_list&search='+this.search;
		}        
	});
	return UserCourseList;
});
