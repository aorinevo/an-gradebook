(function($, AN){
	AN.Views.AssignmentStatisticsView = AN.Views.Base.extend({
 		id: 'base-modal',
    	className: 'modal fade',
        events: { 
            'hidden.bs.modal' : 'editCancel',               
			'keyup'  : 'keyPressHandler'
        },		
		initialize: function(){	        
            $('body').append(this.render().el);
            return this;   		   
		},		
		displayPieChart: function(){
            var assignment = this.model;	
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
            var assignment = this.model;
            var template = _.template($('#stats-assignment-template').html(), {
                    assignment: assignment
            });
            self.$el.html(template);             
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
})(jQuery, AN || {});