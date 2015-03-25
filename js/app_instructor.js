config = {
    //By default load any module IDs from js/lib
    paths : {
    	'models' : 'app/models',
    	'views' : 'app/views',
    	'jquery' : 'lib/jquery',
		'jquery-ui' : 'lib/jquery-ui',    	
    	'backbone': 'lib/backbone',
    	'underscore': 'lib/underscore',
    	'bootstrap': 'lib/bootstrap',
    	'goog': 'lib/goog',
		'async': 'lib/async', 
		'propertyParser' : 'lib/propertyParser'   	
    },
	shim: {
		'bootstrap':['jquery']       
    }
};

require.config(config);

require(['jquery', 'app/GradeBook','bootstrap'],
function($,GradeBook){       
    	$.fn.serializeObject = function() {
        	var o = {};
        	var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    }
    var App = new GradeBook();
});

