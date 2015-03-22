require.config({
    //By default load any module IDs from js/lib
    paths : {
    	'models' : '../app/models',
    	'views' : '../app/views'
    },
	shim: {
		'bootstrap':['jquery']       
    }
});


require(['jquery', '../app/GradeBook'],
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

