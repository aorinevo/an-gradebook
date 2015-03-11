(function($,AN){
	AN.Views.EditAssignmentView = AN.Views.Base.extend({
 		id: 'base-modal',
    	className: 'modal fade',
        events: {
            'hidden.bs.modal' : 'editCancel',
			'keyup'  : 'keyPressHandler',    			                                   
            'click #edit-assignment-save': 'submitForm',
            'submit #edit-assignment-form': 'editSave'
        },
        initialize: function(){
            var assignment = this.model;      
            $('body').append(this.render().el);
            $('#assign-date-datepicker, #assign-due-datepicker').datepicker();
            $('#assign-date-datepicker, #assign-due-datepicker').datepicker('option','dateFormat','yy-mm-dd');
            if(assignment){                  
            $('#assign-date-datepicker').datepicker('setDate', assignment.get('assign_date'));                                                            
            $('#assign-due-datepicker').datepicker('setDate', assignment.get('assign_due'));       		    		 
            }     	
            return this;
        },
        render: function() {
            var assignment = this.model;
            if(this.model){
                var gradebook = AN.GlobalVars.courses.findWhere({id : this.model.get('gbid')+""});            
            } else {
            	var gradebook = AN.GlobalVars.courses.findWhere({selected: true});            
            }
            if (assignment) {
                var template = _.template($('#edit-assignment-template').html(), {
                    assignment: assignment,
                    gradebook: gradebook
                });
                this.$el.html(template);             
            } else {
                var template = _.template($('#edit-assignment-template').html(), {
                    assignment: null,
                    gradebook: gradebook
                });
                this.$el.html(template);
            }     
			this.$el.modal('show');
			var self = this;
			_.defer(function(){
				this.inputName = self.$('input[name="assign_name"]');
				var strLength= inputName.val().length;
				$("#assign_visibility_options option[value='" + self.model.get('assign_visibility') + "']").attr("selected", "selected");
			});    			    		              
            return this;
        },   
		keyPressHandler: function(e) {
            if (e.keyCode == 27) this.editCancel();
            if (e.keyCode == 13) this.submitForm();
            return this;
        },             
        editCancel: function() {
			this.$el.data('modal', null);           
            this.remove();
            return false;
        },
        submitForm: function(){   
          $('#edit-assignment-form').submit();
        },
        editSave: function(ev) {
            ev.preventDefault();
            var assignmentInformation = $(ev.currentTarget).serializeObject(); 
			var x = $(ev.currentTarget).serializeObject().id;           
            var toadd = AN.GlobalVars.assignments.findWhere({id : parseInt(x)});
            if(toadd){
            	toadd.save(assignmentInformation,{wait: true});          	
            } else {
             	delete(assignmentInformation['id']);
            	var toadds = new AN.Models.Assignment(assignmentInformation);
            	toadds.save(assignmentInformation,{success: function(model,response){
            		AN.GlobalVars.assignments.add(response['assignmentDetails']); 
                	_.each(response['assignmentStudents'], function(cell) {
                    	AN.GlobalVars.cells.add(cell)
                	});             		 
            		}
            	});            	
            }
			this.$el.modal('hide');
            return false;
        }
    });
})(jQuery, AN || {});    