 var AN = AN || {};
  AN.Models = AN.Models || {};
  AN.Collections = AN.Collections || {};
  AN.Views = AN.Views || {};
  AN.Routers = AN.Routers || {};
  AN.Funcs = AN.Funcs || {};
  AN.GlobalVars = AN.GlobalVars || {};  
  
  AN.Models.Base = Backbone.Model.extend();

  AN.Collections.Base = Backbone.Collection.extend({
    model: AN.Models.Base
  });

  AN.Views.Base = Backbone.View.extend();
  AN.Routers.Base = Backbone.Router.extend();

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
          title: 'Student Grades vs. Class Average',
          'width': '700',
		  'height': '300',          
          vAxis: 
          	{
          	 maxValue : 100,
          	 minValue : 0
          	}
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }      

(function($){    
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
    };
})(jQuery);