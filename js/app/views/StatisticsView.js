define(['jquery','backbone','underscore','goog!visualization,1,packages:[corechart]'],
function($,Backbone,_){
	var StatisticsView = Backbone.View.extend({
 		id: 'base-modal',
    	className: 'modal fade',
        events: {
            'hidden.bs.modal' : 'editCancel',  
        },		
		initialize: function(options){	
			google.load('visualization', '1.0', {'packages':['corechart']});  
			this.options = options.options;
           	_(this).extend(this.options.gradebook_state);   		
            this.student = this.students.findWhere({selected: true});      
            $('body').append(this.render().el);
            return this;   		   
		},		
		drawLineChart: function(data) {
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
		}, 				
		displayLineChart: function(){	
			var self = this;	
			$.get(ajaxurl, { 
						action: 'get_line_chart',
						uid : this.model.get('id'),
						gbid : this.model.get('gbid')
					},
					function(data){	
						if( data.length === 1 ){
							$('.media-frame-content').html('<div style="padding: 10px;"> There is no content to display </div>');
						} else {
							self.drawLineChart(data);							
						}
					}, 
					'json');    	
			return this;					
		},	
        render: function() {
            var self = this;
            var template = _.template($('#stats-student-template').html(), {
                    student: self.student
            });
            self.$el.html(template);             
            this.displayLineChart();                                            
			this.$el.modal('show');        
            return this;
        },
        editCancel: function() {
			this.$el.data('modal', null);           
            this.remove();            
            return false;
        }
    });
	return StatisticsView;
});   
	