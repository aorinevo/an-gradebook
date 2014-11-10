AN.Collections.Students = AN.Collections.Base.extend({
        model: AN.Models.Student,
        comparator: function( model ) {
  				return model.get( 'lastname' );
		}
});