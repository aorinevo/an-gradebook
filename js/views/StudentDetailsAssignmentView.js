(function($,AN){
	AN.Views.StudentDetailsAssignmentView = AN.Views.Base.extend({
 		id: 'base-modal',
    	className: 'modal fade',
        initialize: function(){     
            $('body').append(this.render().el);     	
            return this;
        },          
        render: function() {
            var self = this;
            var assignment = this.model;
            var template = _.template($('#student-details-assignment-template').html(), {
                    assignment: assignment
            });
            self.$el.html(template);                 
			this.$el.modal('show');   			    		              
            return this;
        }
    });
})(jQuery, AN || {});    