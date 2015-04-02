define(['backbone', 'models/User'],function(Backbone, User){ 
	var UserCourseList = Backbone.Collection.extend({
		model: User,
        comparator: function( model ) {
  				return model.get( 'lastname' );
		}
	});
	return UserCourseList;
});
