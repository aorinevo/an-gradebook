define(['backbone','models/User'],function(Backbone,User){ 
	var UserList = Backbone.Collection.extend({
		model: User,
		role: 'all_roles',
		course: 'all_courses',
		_sort: 'last_name',
		comparator : function(model1,model2){			
			var self = this;
			if(this._sort != 'role'){
				return model1.get('user_meta')[this._sort].localeCompare(model2.get('user_meta')[self._sort]);
			} else {
				return model1.get('roles')[0].localeCompare(model2.get('roles')[0]);
			}		
		},
		filterUsers: function(options){			
			var self = this;		
			self = _.extend(self,options);
			return _.filter(self.models,function(_user){
				console.log(_user);
				var _bol = _user.isRole(self.role) && _user.user_can(self.course);	
				return _bol;
			});	
		},  		
		url: function(){
		   return ajaxurl + '?action=ants_user_list&role='+this['role'];
		}
    });
    return UserList;
});

