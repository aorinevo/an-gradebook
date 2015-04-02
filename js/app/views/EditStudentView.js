define(['jquery','backbone','underscore','models/User'],
function($,Backbone,_,User){
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
			this.options = options.options;
           	_(this).extend(this.options.gradebook_state);
            this.course = this.courses.findWhere({'selected': true});     
            this.student = this.model || null;       	           
            $('body').append(this.render().el);     	
            return this;
        },        
        render: function() {
		    var self = this;     
            var gradebook = this.course;
            var template = _.template($('#edit-student-template').html());
            var compiled = template({student: this.student, gradebook: gradebook});                
            self.$el.html(compiled);  
            this.$el.modal('show');            
			_.defer(function(){
				self.inputName = self.$('input[name="first_name"]');
				var strLength= self.inputName.val().length;
				//inputName.focus();				
				//inputName[0].setSelectionRange(strLength, strLength);
			}); 					
            return self;
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
            if(this.student){
            	studentInformation.id = parseInt(studentInformation.id);
            	this.student.save(studentInformation, {wait: true});
				this.$el.modal('hide');              	
            } else {
             	delete(studentInformation['id']);
            	var toadds = new User(studentInformation);
            	toadds.save(studentInformation,{success: function(model){
                		_.each(model.get('cells'), function(cell) {
                  	  		self.cells.add(cell);
              			});
              			var _student = new User(model.get('student'));
                		self.students.add(_student);                       	 
                		self.$el.modal('hide');   
            		}
            	});            	
            }            				
            return false;
        }
    });
    return EditStudentView;
});