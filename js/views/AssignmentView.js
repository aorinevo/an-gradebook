(function($,AN){
	AN.Views.AssignmentView = AN.Views.Base.extend({
        tagName: 'th',
        className: 'assignment manage-column sortable asc',
        events: {
            'click li.assign-submenu-sort': 'sortColumn',
            'click .dashicons-menu': 'toggleAssignmentMenu',
            'click li.assign-submenu-delete' : 'deleteAssignment',
            'click li.assign-submenu-edit' : 'editAssignment',         
            'click li.assign-submenu-stats' : 'statsAssignment',            
            'mouseenter div.column-frame' : 'mouseEnter',
            'mouseleave div.column-frame' : 'mouseLeave'
        },
        initialize: function() {
			this.listenTo(this.model, 'change:assign_name', this.render);         
            this.listenTo(this.model, 'change:sorted', this.sortColumnCSS);
            this.listenTo(this.model, 'change:visibility', this.visibilityColumnCSS);            
            this.listenTo(this.model, 'remove', this.close);
        },
        mouseEnter: function(){
        	this.$el.addClass('hover');
        	this.model.set({hover: true});
        },
        close: function(){
			this.remove();			
        },
        mouseLeave: function(){
        	this.$el.removeClass('hover');	
        	this.model.set({hover: false});	
        },
        toggleAssignmentMenu: function(){
        	var _assign_menu = $('#column-assign-id-'+this.model.get('id'));
        	if( _assign_menu.css('display') === 'none'){
				_assign_menu.toggle(1, function(){
        			var self = this;				
					$(document).one('click',function(){
						$(self).hide();
					});		
				});
			}
        },
        render: function() {  
            this.visibilityColumnCSS();             
        	var order = this.model.get('sorted') === 'asc' ? 'down' : 'up';
			var template = _.template($('#assignment-view-template').html(), {
                    assignment: this.model
                });
        	this.$el.html(template);         	
            return this;
        },
        sortColumn: function(ev){
        	var y = AN.GlobalVars.assignments.findWhere({selected: true});
        	y && y.set({selected: false});
            if (this.model.get('sorted')) {
            	if (this.model.get('sorted')=== 'desc') {
                	this.model.set({sorted: 'asc'});
            	} else {
                	this.model.set({sorted: 'desc'});            
            	}
            } else {
                var x = AN.GlobalVars.assignments.find(function(model){
                	return model.get('sorted').length >0;
                });
                x && x.set({ sorted: '' });
                this.model.set({ sorted: 'asc' });
            }        	
        },
        sortColumnCSS: function() {
            if (this.model.get('sorted')) {
        		var desc = this.$el.hasClass('desc');
        		this.$el.toggleClass( "desc", !desc ).toggleClass( "asc", desc );   
            } else {
                this.$el.removeClass('asc desc');
                this.$el. addClass('asc');			
            }
        },              
        visibilityColumnCSS: function(ev) {
            if (this.model.get('visibility')) {
                this.$el.removeClass('hidden');
            } else {
                this.$el.addClass('hidden');
            }
        },
        statsAssignment: function(){
            var view = new AN.Views.AssignmentStatisticsView({model: this.model}); 
            return this;			
        }, 
        editAssignment: function(ev) {    
            var view = new AN.Views.EditAssignmentView({model: this.model});           
            return this;
        },               
        deleteAssignment: function() {
			this.model.destroy({success: 
				function (model){
	            	model.set({ selected: false });                      		
        		}}
            );        
        }                
    });
})(jQuery, AN || {});