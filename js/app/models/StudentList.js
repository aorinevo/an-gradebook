define(['backbone','models/Student'],function(Backbone,Student){
	var StudentList = Backbone.Collection.extend({
        model: Student,
        comparator: function( model ) {
  				return model.get( 'lastname' );
		}
	});
	return StudentList;
});
