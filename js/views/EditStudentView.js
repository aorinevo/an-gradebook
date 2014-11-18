AN.Views.EditStudentView = (function($,my){
	my = AN.Views.Base.extend({
        id: 'edit-student-form-container-container',
        events: {
            'click button#edit-student-cancel': 'editCancel',
            'click a.media-modal-close' : 'editCancel', 
			'keyup'  : 'keyPressHandler',                            
            'click #edit-student-save': 'submitForm',            
            'submit #edit-student-form': 'editSave'
        },
        initialize: function(){
            var student = AN.GlobalVars.students.findWhere({
                selected: true
            });       
            $('body').append(this.render().el);     	
            return this;
        },        
        render: function() {
            var self = this;
            var student = AN.GlobalVars.students.findWhere({
                selected: true
            });
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
            this.$el.append('<div class="media-modal-backdrop"></div>');
			_.defer(function(){
				this.inputName = self.$('input[name="firstname"]');
				var strLength= inputName.val().length;
				inputName.focus();				
				inputName[0].setSelectionRange(strLength, strLength);
			});                                                 
            return this;
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
        editCancel: function() {
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
                	AN.GlobalVars.anGradebooks.add(response['anGradebook']);                            	 
            		}
            	});            	
            }
            this.remove();
            this.toggleEditDelete();
            return false;
        }
    });
	return my;
})(jQuery, AN.Views.EditStudentView || {});	