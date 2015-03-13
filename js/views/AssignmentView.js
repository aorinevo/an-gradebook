(function($,AN){
	AN.Views.AssignmentView = AN.Views.Base.extend({
        tagName: 'th',
        className: 'assignment-tools assignment',
        events: {
            'click li.assign-submenu-sort': 'sortColumn',
            'click .dashicons-menu': 'toggleAssignmentMenu',
            'click li.assign-submenu-delete' : 'deleteAssignment',
            'click li.assign-submenu-edit' : 'editAssignment',         
            'click li.assign-submenu-left' : 'shiftAssignmentLeft',              
            'click li.assign-submenu-right' : 'shiftAssignmentRight',               
            //'click li.assign-submenu-publish' : 'togglePublish',             
            'click li.assign-submenu-stats' : 'statsAssignment',            
            'mouseenter div.column-frame' : 'mouseEnter',
            'mouseleave div.column-frame' : 'mouseLeave'
        },
        initialize: function() {
			this.listenTo(this.model, 'change:assign_name', this.render);         
            this.listenTo(this.model, 'change:sorted', this.sortColumnCSS);
            this.listenTo(this.model, 'change:visibility', this.visibilityColumnCSS);   
            this.listenTo(AN.GlobalVars.students, 'add remove', this.close);      
            this.listenTo(AN.GlobalVars.assignments, 'add remove change:sorted change:assign_order', this.close);                           
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
        shiftAssignmentLeft: function(ev){
        	ev.preventDefault();          
        	var x = AN.GlobalVars.assignments.findWhere({assign_order: this.model.get('assign_order')-1});
        	x.save({assign_order: this.model.get('assign_order')});
			this.model.save({assign_order: this.model.get('assign_order')-1});
        },	
        shiftAssignmentRight: function(ev){
        	ev.preventDefault();          
        	var x = AN.GlobalVars.assignments.findWhere({assign_order: this.model.get('assign_order')+1});
        	x.save({assign_order: this.model.get('assign_order')});
			this.model.save({assign_order: this.model.get('assign_order')+1});
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
			var template = _.template($('#assignment-view-template').html(), {
                    assignment: this.model,
                    min: _.min(AN.GlobalVars.assignments.models, function(assignment){ return assignment.get('assign_order');}),
                    max: _.max(AN.GlobalVars.assignments.models, function(assignment){ return assignment.get('assign_order');})                
                });
        	this.$el.html(template);         	
        	return this;
        },
        sortColumn: function(ev){
        	ev.preventDefault();  
            if (this.model.get('sorted')) {
            	if (this.model.get('sorted') === 'desc') {
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
                this.$el.addClass('asc');			
            }
        },              
        visibilityColumnCSS: function(ev) {
            if (this.model.get('visibility')) {
                this.$el.removeClass('hidden');
            } else {
                this.$el.addClass('hidden');
            }
        },
        statsAssignment: function(ev){
        	ev.preventDefault();  
            var view = new AN.Views.AssignmentStatisticsView({model: this.model}); 		
        }, 
        editAssignment: function(ev) {
        	ev.preventDefault();                	      
            var view = new AN.Views.EditAssignmentView({model: this.model});           
        },               
        deleteAssignment: function(ev) {
			ev.preventDefault();          
			this.model.destroy({success: 
				function (model){
	            	var _x = model.get('assign_order'); 
	            	var _y = _.max(AN.GlobalVars.assignments.models, function(assignment){ return assignment.get('assign_order');});                     		
	            	for( i = _x; i < _y.get('assign_order'); i++){
	            		var _z = AN.GlobalVars.assignments.findWhere({assign_order: i+1});
	            		_z.save({assign_order: i});
	            	}	            	
        		}}
            );        
        },
        close: function(){     
			this.remove();			
        }                     
    });
})(jQuery, AN || {});