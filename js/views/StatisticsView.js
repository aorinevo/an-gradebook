(function($,my){
	AN.Views.StatisticsView = AN.Views.Base.extend({
 		id: 'base-modal',
    	className: 'modal fade',
        events: {
            'hidden.bs.modal' : 'editCancel',  
        },		
		initialize: function(){	   
            var student = AN.GlobalVars.students.findWhere({
                selected: true
            });      
            $('body').append(this.render().el);
            return this;   		   
		},		
		displayLineChart: function(){
            var student = this.model;		
			$.get(ajaxurl, { 
						action: 'get_line_chart',
						uid : this.model.get('id'),
						gbid : this.model.get('gbid')
					},
					function(data){	
						if( data.length === 1 ){
							$('.media-frame-content').html('<div style="padding: 10px;"> There is no content to display </div>');
						} else {
							drawLineChart(data);							
						}
					}, 
					'json');    	
			return this;					
		},	
        render: function() {
            var self = this;
            var student = this.model;
            var template = _.template($('#stats-student-template').html(), {
                    student: student
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
})(jQuery, AN || {});   
	