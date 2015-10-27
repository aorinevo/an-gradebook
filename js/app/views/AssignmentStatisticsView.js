define(['jquery','backbone','underscore','goog!visualization,1,packages:[corechart]'],
function($,Backbone,_){
	var AssignmentStatisticsView = Backbone.View.extend({
 		id: 'base-modal',
    	className: 'modal fade',
        events: { 
            'hidden.bs.modal' : 'editCancel',               
			'keyup'  : 'keyPressHandler'
        },		
		initialize: function(options){			   
			google.load('visualization', '1.0', {'packages':['corechart']});  		     			
            $('body').append(this.render().el);
            return this;   		   
		},	
		drawPieChart: function(data) {
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
		},			
		displayPieChart: function(){
			var self = this;
            var assignment = this.model;	
			$.get(ajaxurl, { 
						action: 'get_pie_chart',
						amid : assignment.get('id'),
						gbid : assignment.get('gbid')
					},
					function(data){		
						//drawLineChart();		
						self.drawPieChart({grades: data['grades'],assign_name: assignment.get('assign_name')});
					}, 
					'json');    	
			return this;					
		},	
        render: function() {
            var self = this;
            var assignment = this.model;
            var template = _.template($('#stats-assignment-template').html());
            var compiled = template({assignment: assignment});
            self.$el.html(compiled);             
            this.displayPieChart();                                            
			this.$el.modal('show');       
            return this;
        },
        editCancel: function() {
			this.$el.data('modal', null);         
            this.remove();            
            return false;
        },
 		keyPressHandler: function(e) {
            if (e.keyCode == 27) this.editCancel();
            if (e.keyCode == 13) this.submitForm();
            return this;
        }        
    });
	return AssignmentStatisticsView;
});