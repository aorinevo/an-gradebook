AN.Models.Course = (function(my){
	my = AN.Models.Base.extend({
        defaults: {
            name: 'Calculus I',
            school: 'Bergen',
            semester: 'Fall',
            year: '2014',
            selected: false
        }
	});
	return my
})(AN.Models.Course || {});