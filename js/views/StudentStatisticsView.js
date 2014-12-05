(function($,my){
	AN.Views.StudentStatisticsView = AN.Views.Base.extend({
		id: 'stats-student-container-container',
        events: {
            'click button#stats-student-close': 'editCancel',
            'click a#an-piechart': 'displayPieChart',
            'click a#an-linechart': 'displayLineChart',            
            'click a.media-modal-close' : 'editCancel'
        },		
		initialize: function(){	   
            var student = AN.GlobalVars.students.findWhere({
                selected: true
            });      
            $('body').append(this.render().el);
            return this;   		   
		},		
		displayLineChart: function(){
			$('.media-router').children().removeClass('active');
			$('#an-piechart').addClass('active');
            var student = AN.GlobalVars.students.findWhere({
                selected: true
            });			
			$.get(ajaxurl, { 
						action: 'get_line_chart',
						uid : this.model.get('id'),
						gbid : this.model.get('gbid')
					},
					function(data){	
						data.length ==1 ? $('.media-frame-content').html('<div style="padding: 10px;"> There is no content to display </div>') : drawLineChart(data);							
					}, 
					'json');    	
			return this;					
		},	
        render: function() {
            var self = this;
            var student = AN.GlobalVars.students.findWhere({
                selected: true
            });
            var template = _.template($('#stats-student-template').html(), {
                    student: student
            });
            self.$el.html(template);             
            this.displayLineChart();                                            
            this.$el.append('<div class="media-modal-backdrop"></div>');           
            return this;
        },
        editCancel: function() {
            this.remove();            
            return false;
        }
    });
})(jQuery, AN || {});   
	