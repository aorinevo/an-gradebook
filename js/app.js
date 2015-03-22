require.config({
    //By default load any module IDs from js/lib
    paths : {
    	'models' : '../app/models',
    	'views' : '../app/views'
    },
	shim: {
		'config': {exports: 'AN'},
        'jquery': { exports: '$' },
        'underscore': { exports: '_' },
        'backbone': { deps: ['underscore', 'jquery'], exports: 'Backbone'},
		'bootstrap':['jquery']       
    }
});


require(['jquery', '../app/GradeBook', 'goog!visualization,1,packages:[corechart]'],
function($,GradeBook){   
	google.load('visualization', '1.0', {'packages':['corechart']});  
 
	function drawPieChart(data) {
		// Create the data table.
        var datag = new google.visualization.DataTable();
		datag.addColumn('string', 'Grades');
        datag.addColumn('number', 'Number');
        datag.addRows([
    		['A', data['grades'][0]],
			['B', data['grades'][1]],
        	['C', data['grades'][2]],
        	['D', data['grades'][3]],
        	['F', data['grades'][4]]
        ]);

        // Set chart options
        var optionsg = {'title': data['assign_name'],
                       'width': '300',
                       'height': '300',
                       'backgroundColor': 'none'};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
         chart.draw(datag, optionsg);
	}
	function drawLineChart(data) {
		var data = google.visualization.arrayToDataTable(data);

        var options = {
			'title': 'Student Grades vs. Class Average',
          	'width': '700',
		  	'height': '300',          
          	'vAxis': {
          	 	maxValue : 100,
          	 	minValue : 0
          	}
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);
	}  
	       
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

