({
    //By default load any module IDs from js/lib
    baseUrl: '.',
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
    	'propertyParser': 'lib/propertyParser'  	    	
    },
    name: 'app_instructor',
    out: 'app-instructor-min.js',
	shim: {
		'bootstrap':['jquery']       
    }
})