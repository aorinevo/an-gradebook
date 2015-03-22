(function($,AN){
	AN.Views.StudentAssignmentView = AN.Views.Base.extend({
        tagName: 'th',
        className: 'assignment manage-column sortable asc',
        events: {
            'click .dashicons-menu': 'toggleAssignmentMenu',           
            'click li.assign-submenu-stats' : 'statsAssignment',            
            'click li.assign-submenu-details' : 'detailsAssignment',              
            'mouseenter div.column-frame' : 'mouseEnter',
            'mouseleave div.column-frame' : 'mouseLeave'
        },
        initialize: function() {               
            this.listenTo(this.model, 'change:visibility', this.visibilityColumnCSS);   
            this.listenTo(AN.GlobalVars.courses, 'remove change:selected', this.close);             
        },
        mouseEnter: function(){
        	this.$el.addClass('hover');
        	this.model.set({hover: true});
        },
        mouseLeave: function(){
        	this.$el.removeClass('hover');	
        	this.model.set({hover: false});	
        },            
        toggleAssignmentMenu: function(){
        	var _assign_menu = $('#column-assign-id-'+this.model.get('id'));
        	if( _assign_menu.css('display') === 'none'){
        		var view = this;
				_assign_menu.toggle(1, function(){
        			var self = this;				
					$(document).one('click',function(){
						$(self).hide();
						view.model.set({hover:false}); 
					});		
				});
			}
        },
        render: function() {  
            this.visibilityColumnCSS();                         
        	var order = this.model.get('sorted') === 'asc' ? 'down' : 'up';
			var template = _.template($('#student-assignment-view-template').html(), {
                    assignment: this.model,
                    min: _.min(AN.GlobalVars.assignments.models, function(assignment){ return assignment.get('assign_order');}),
                    max: _.max(AN.GlobalVars.assignments.models, function(assignment){ return assignment.get('assign_order');})                
                });
        	this.$el.html(template); 	        	
        	return this;
        },            
        visibilityColumnCSS: function(ev) {
            if (this.model.get('visibility')) {
                this.$el.removeClass('hidden');
            } else {
                this.$el.addClass('hidden');
            }
        },
        detailsAssignment: function(ev){
        	ev.preventDefault();
            var view = new AN.Views.StudentDetailsAssignmentView({model: this.model});
        },
        statsAssignment: function(ev){
        	ev.preventDefault();        
            var view = new AN.Views.AssignmentStatisticsView({model: this.model}); 		
        }, 
        close: function(){     
			this.remove();			
        }                     
    });
})(jQuery, AN || {});