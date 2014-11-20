AN.Views.FilterAssignmentsView = (function($,my){
	my = AN.Views.Base.extend({
        id: 'filter-assignments-form-container-container',
        events: {
            'click a.media-modal-close' : 'editCancel',
            'keyup'  : 'keyPressHandler',        
            'click #filter-assignments-filter': 'submitForm',
            'submit #filter-assignments-form': 'filterAssignment'
        },
        initialize: function(){  
            var course = AN.GlobalVars.courses.findWhere({
                selected: true
            });      
            $('body').append(this.render().el);
            return this;                
        },
        render: function() {
            var self = this;
            var course = AN.GlobalVars.courses.findWhere({
                selected: true
            });
            var _x = _.map(AN.GlobalVars.assignments.models, function(model){return model.get('assign_category');});
            var _assign_categories = _.without(_.uniq(_x),"");
            if (_assign_categories) {
                var template = _.template($('#filter-assignments-template').html(), {
                    assign_categories: _assign_categories
                });
                self.$el.html(template);                              
            } else {
                var template = _.template($('#filter-assignments-template').html(), {
                    assign_categories: null
                });
                self.$el.html(template);                
            }                        
            this.$el.append('<div class="media-modal-backdrop"></div>');           
            return this;
        },                
        keyPressHandler: function(e) {
            if (e.keyCode == 27) this.editCancel();
            if (e.keyCode == 13) this.submitForm();
            return this;
        },                 
        editCancel: function() {
            this.remove();            
            return false;
        },
        submitForm: function(){
        	$('#filter-assignments-form').submit();
        },
        filterAssignment: function(ev) {
            var assignmentInformation = $(ev.currentTarget).serializeArray(); 
			var _x = $(ev.currentTarget).serializeObject().filter_option;           
            var _toHide = AN.GlobalVars.assignments.filter(
	            function(assign){
               		return assign.get('assign_category') != _x;
            	}
        	);
            var _toShow = AN.GlobalVars.assignments.filter(
	            function(assign){
               		return assign.get('assign_category') === _x;
            	}
        	);  
        	if( _x === "-1"){
        		AN.GlobalVars.assignments.each(function(assign){
                	assign.set({visibility: true});
				});
        	} else {      	
        		_.each(_toHide,function(assign){
                	assign.set({visibility: false});
            	});
            	_.each(_toShow,function(assign){
                	assign.set({visibility: true});
            	});
            }
            this.remove();
            return false;
        }
    });
    return my;
})(jQuery, AN.Views.FilterAssignmentView || {});
     
    