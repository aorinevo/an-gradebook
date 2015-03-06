(function($,my){
	AN.Views.EditStudentView = AN.Views.Base.extend({
 		id: 'base-modal',
    	className: 'modal fade',
        events: {
            'hidden.bs.modal' : 'editCancel',
			'keyup'  : 'keyPressHandler',  
			'keydown #user_login' : 'getUsersLogin',                          
            'click #edit-student-save': 'submitForm',            
            'submit #edit-student-form': 'editSave'
        },
        initialize: function(){          
            $('body').append(this.render().el);     	
            return this;
        },        
        render: function() {
		    var self = this;        
            var student = self.model;
            var gradebook = AN.GlobalVars.courses.findWhere({
        		selected: true
            });
            if (student) {
                var template = _.template($('#edit-student-template').html(), {
                    student: student,
                    gradebook: gradebook
                });
                self.$el.html(template);
            } else {
                var template = _.template($('#edit-student-template').html(), {
                    student: null,
                    gradebook: gradebook
                });
                self.$el.html(template);
            }     
            this.$el.modal('show');            
			_.defer(function(){
				self.inputName = self.$('input[name="firstname"]');
				var strLength= self.inputName.val().length;
				//inputName.focus();				
				//inputName[0].setSelectionRange(strLength, strLength);
			}); 					
            return self;
        },
        toggleEditDelete: function(){      
            var x = AN.GlobalVars.students.findWhere({selected: true});
            if(x){
              $('#add-student, #edit-student, #delete-student, #add-assignment').attr('disabled',false);
            }else{           
              $('#edit-student, #delete-student').attr('disabled',true);
            }     
            $('#add-student, #add-assignment').attr('disabled',false);
        },   
 		keyPressHandler: function(e) {
            if (e.keyCode == 27) this.editCancel();
            if (e.keyCode == 13) this.submitForm();
            return this;
        },  
        getUsersLogin: function(){
			this.availableTags = [
      			"testing"
    		];  
        },                
        editCancel: function() {
			this.$el.data('modal', null);            
            this.remove();           
			this.toggleEditDelete();
            return false;
        },
        submitForm: function(){        	
          $('#edit-student-form').submit();
        },        
        editSave: function(ev) {
            var studentInformation = $(ev.currentTarget).serializeObject();
			var x = $(ev.currentTarget).serializeObject().id;
            var toadd = AN.GlobalVars.students.findWhere({id : parseInt(x)});
            if(toadd){
            	studentInformation.id = parseInt(x);
            	toadd.save(studentInformation,{wait: true});
            } else {
             	delete(studentInformation['id']);
            	var toadds = new AN.Models.Student(studentInformation);
            	toadds.save(studentInformation,{success: function(model,response){
                	_.each(response['assignment'], function(assignment) {
                  	  	AN.GlobalVars.cells.add(assignment);
              		});
                	AN.GlobalVars.students.add(response['student']);                       	 
            		}
            	});            	
            }
			this.$el.modal('hide');
            return false;
        }
    });
})(jQuery, AN || {});	