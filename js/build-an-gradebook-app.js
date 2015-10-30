({
    //By default load any module IDs from js/lib
    baseUrl: '.',
    paths : {
    	'models' : 'app/models',
    	'views' : 'app/views',
    	'jquery' : 'lib/jquery',
		'jquery-ui' : 'lib/jquery-ui/jquery-ui.min',    	
    	'backbone': 'lib/backbone',
    	'underscore': 'lib/underscore',
    	'bootstrap': 'lib/bootstrap/js/bootstrap.min',
    	'goog': 'lib/goog',
    	'bootstrap3-typeahead': 'lib/bootstrap3-typeahead/bootstrap3-typeahead',
		'async': 'lib/async', 
		'propertyParser' : 'lib/propertyParser'   	
    },
    name: 'an-gradebook-app',
    out: 'an-gradebook-app-min.js',
	shim: {
		'bootstrap':{
			deps: ['jquery']
		}
    }
})
