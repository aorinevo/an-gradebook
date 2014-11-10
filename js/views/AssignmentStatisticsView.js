AN.Views.AssignmentStatisticsView = (function($, my){
	my = AN.Views.Base.extend({
		id: 'stats-assignment-container-container',
        events: {
            'click button#stats-assignment-close': 'editCancel',
            'click a#an-piechart': 'displayPieChart',
            'click a#an-linechart': 'displayLineChart',            
            'click a.media-modal-close' : 'editCancel'
        },		
		initialize: function(){	   
            var assignment = AN.GlobalVars.assignments.findWhere({
                selected: true
            });      
            $('body').append(this.render().el);
            return this;   		   
		},		
		displayPieChart: function(){
			$('.media-router').children().removeClass('active');
			$('#an-piechart').addClass('active');
            var assignment = AN.GlobalVars.assignments.findWhere({
                selected: true
            });			
			$.get(ajaxurl, { 
						action: 'get_pie_chart',
						amid : assignment.get('id'),
						gbid : assignment.get('gbid')
					},
					function(data){		
						//drawLineChart();		
						drawPieChart({grades: data['grades'],assign_name: assignment.get('assign_name')});
					}, 
					'json');    	
			return this;					
		},	
        render: function() {
            var self = this;
            var assignment = AN.GlobalVars.assignments.findWhere({
                selected: true
            });
            var template = _.template($('#stats-assignment-template').html(), {
                    assignment: assignment
            });
            self.$el.html(template);             
            this.displayPieChart();                                            
            this.$el.append('<div class="media-modal-backdrop"></div>');           
            return this;
        },
        editCancel: function() {
            this.remove();            
            return false;
        }
    });
    return my;
})(jQuery, AN.Views.AssignmentStatisticsView);