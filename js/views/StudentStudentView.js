(function($,AN){
	AN.Views.StudentStudentView = AN.Views.Base.extend({
        tagName: 'tr',
        events: {
            'click .dashicons-menu': 'toggleStudentMenu',       
            'click li.student-submenu-stats' : 'studentStatistics',                         
        },
        initialize: function() {                    
            this.listenTo(AN.GlobalVars.courses, 'remove change:selected', this.close); 
        },    
        render: function() {
            var template = _.template($('#student-view-template').html(), {
                    student: this.model
                }); 
            this.$el.html(template);
            var gbid = parseInt(AN.GlobalVars.courses.findWhere({selected: true}).get('id')); //anq: why is this not already an integer??
            var x = AN.GlobalVars.cells.where({
            	uid: parseInt(this.model.get('id')),		//anq: why is this not already an integer??
            	gbid: gbid
            	});
           	x = _.sortBy(x,function(model){ return model.get('assign_order');});        	
            var self = this;
            _.each(x, function(cell) {
            	console.log(cell);
                var view = new AN.Views.StudentCellView({
                    model: cell
                });
                self.$el.append(view.render().el);
            });
            return this;
        },
        toggleStudentMenu: function(){
        	var _student_menu = $('#row-student-id-'+this.model.get('id'));
        	if( _student_menu.css('display') === 'none'){
        		var view = this;
				_student_menu.toggle(1, function(){
        			var self = this;				
					$(document).one('click',function(){
						$(self).hide();
						//view.model.set({hover:false}); 
					});		
				});
			}
        },        
        studentStatistics: function(ev){
        	ev.preventDefault();    
            var view = new AN.Views.StudentStatisticsView({ model: this.model});          
        },       
        close: function() {
            this.remove();
        }
    });
})(jQuery, AN || {});