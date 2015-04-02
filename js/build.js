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
    name: 'an-gradebook-app',
    out: 'an-gradebook-app-min.js',
	shim: {
		'bootstrap':['jquery']       
    }
})