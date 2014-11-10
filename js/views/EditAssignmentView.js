AN.Views.EditAssignmentView = (function($,my){
	my = AN.Views.Base.extend({
        id: 'edit-assignment-form-container-container',
        events: {
            'click button#edit-assignment-cancel': 'editCancel',
            'click a.media-modal-close' : 'editCancel', 
			'keyup'  : 'keyPressHandler',    			                                   
            'click #edit-assignment-save': 'submitForm',
            'submit #edit-assignment-form': 'editSave'
        },
        initialize: function(){
            var assignment = AN.GlobalVars.assignments.findWhere({
                selected: true
            });        
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
            var self = this;
            var assignment = AN.GlobalVars.assignments.findWhere({
                selected: true
            });
            var gradebook = AN.GlobalVars.courses.findWhere({
                selected: true
            });
            if (assignment) {
                var template = _.template($('#edit-assignment-template').html(), {
                    assignment: assignment,
                    gradebook: gradebook
                });
                self.$el.html(template);             
            } else {
                var template = _.template($('#edit-assignment-template').html(), {
                    assignment: null,
                    gradebook: gradebook
                });
                self.$el.html(template);
            }     
            this.$el.append('<div class="media-modal-backdrop"></div>');   
			_.defer(function(){
				this.inputName = self.$('input[name="assign_name"]');
				var strLength= inputName.val().length;
				inputName.focus();				
				inputName[0].setSelectionRange(strLength, strLength);
			});                      
            return this;
        },
        toggleEditDelete: function(){
            var y = AN.GlobalVars.assignments.findWhere({selected: true});
            if(y){
              $('#add-assignment, #edit-assignment, #delete-assignment, #add-student').attr('disabled',false);
            }else{          
              $('#edit-assignment, #delete-assignment').attr('disabled',true); 
            }    
            $('#add-assignment, #add-student').attr('disabled',false);            
        },      
		keyPressHandler: function(e) {
            if (e.keyCode == 27) this.editCancel();
            if (e.keyCode == 13) this.submitForm();
            return this;
        },             
        editCancel: function() {
            this.remove();
			this.toggleEditDelete();
            return false;
        },
        submitForm: function(){        	
          $('#edit-assignment-form').submit();
        },
        editSave: function(ev) {
            ev.preventDefault();
            var assignmentInformation = $(ev.currentTarget).serializeObject(); //action: "add_assignment" or action: "update_assignments" is hidden in the edit-course-template 
            $.post(ajaxurl, assignmentInformation, function(data, textStatus, jqXHR) {
                if(assignmentInformation['action']=='update_assignments'){
                	var x = AN.GlobalVars.assignments.get(data['id']);
                	_.each(data, function(valz, keyz){
                	   var y = JSON.parse('{"' + keyz + '":"' + valz + '"}');
                	   x.set(y);
                	});
                } else {
                	var x = _.map(data['assignmentDetails'], function(y){
                		return isNaN(y) ? y : parseInt(y);
                	});
                	AN.GlobalVars.assignments.add(data['assignmentDetails']);
                	_.each(data['assignmentStudents'], function(cell) {
                    	AN.GlobalVars.cells.add(cell)
                	});              
                }               
            }, 'json');
            this.remove();
			this.toggleEditDelete();       
            return false;
        }
    });
    return my;
})(jQuery, AN.Views.EditAssignmentView || {});    