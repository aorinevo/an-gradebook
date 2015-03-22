define(['jquery','backbone','underscore','models/Student'],
function($,Backbone,_,Student){
	var EditStudentView = Backbone.View.extend({
 		id: 'base-modal',
    	className: 'modal fade',
        events: {
            'hidden.bs.modal' : 'editCancel',
			'keyup'  : 'keyPressHandler',  
			'keydown #user_login' : 'getUsersLogin',                          
            'click #edit-student-save': 'submitForm',            
            'submit #edit-student-form': 'editSave'
        },
        initialize: function(options){  
        	console.log(options);
			this.options = options.options;
			console.log(this.options);
           	_(this).extend(this.options.gradebook_state);
           	console.log(this);
            this.course = this.courses.findWhere({'selected': true});            	      
            $('body').append(this.render().el);     	
            return this;
        },        
        render: function() {
		    var self = this; 
		    console.log(this.model);       
            var student = self.model;
            var gradebook = this.course;
            if (student) {
            	console.log(student);
                var template = _.template($('#edit-student-template').html());
                var compiled = template({student: student, gradebook: gradebook});                
                self.$el.html(compiled);
            } else {
                var template = _.template($('#edit-student-template').html());
                var compiled = template({student: null,gradebook: gradebook});
                self.$el.html(compiled);
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
            return false;
        },
        submitForm: function(){        	
          $('#edit-student-form').submit();
        },        
        editSave: function(ev) {
        	var self = this;
            var studentInformation = $(ev.currentTarget).serializeObject();
            if(this.model){
            	studentInformation.id = parseInt(studentInformation.id);
            	this.model.save(studentInformation,{wait: true});
				this.$el.modal('hide');              	
            } else {
             	delete(studentInformation['id']);
            	var toadds = new Student(studentInformation);
            	toadds.save(studentInformation,{success: function(model,response){
                		_.each(response['assignment'], function(assignment) {
                  	  		self.cells.add(assignment);
              			});
                		self.students.add(response['student']);                       	 
                		self.$el.modal('hide');   
            		}
            	});            	
            }            				
            return false;
        }
    });
    return EditStudentView;
});