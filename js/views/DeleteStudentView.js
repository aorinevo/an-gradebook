(function($,AN){
	AN.Views.DeleteStudentView = AN.Views.Base.extend({
        id: 'delete-student-form-container-container',
        events: {
            'click button#delete-student-cancel': 'deleteCancel',
            'click a.media-modal-close' : 'deleteCancel', 
			'keyup'  : 'keyPressHandler',                            
            'click #delete-student-delete': 'submitForm',            
            'submit #delete-student-form': 'deleteSave'
        },
        initialize: function(){     
            $('body').append(this.render().el);     	
            return this;
        },        
        render: function() {
            var self = this;
            var student = this.model;
            var gradebook = AN.GlobalVars.courses.findWhere({
        		selected: true
            });
            if (student) {
                var template = _.template($('#delete-student-template').html(), {
                    student: student,
                    gradebook: gradebook
                });
                self.$el.html(template);
            }
            this.$el.append('<div class="media-modal-backdrop"></div>');                                              
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
            if (e.keyCode == 27) this.deleteCancel();
            if (e.keyCode == 13) this.submitForm();
            return this;
        },                  
        deleteCancel: function() {
            this.remove();           
			this.toggleEditDelete();
            return false;
        },
        submitForm: function(){        	
          $('#delete-student-form').submit();
        },        
        deleteSave: function(ev) {
            var studentInformation = $(ev.currentTarget).serializeObject();
			var x = studentInformation.id;
            var todel = this.model;
            todel.set({delete_options: studentInformation.delete_options});
            var self = this;
			todel.destroy({success: function (model,response){
	        	model.set({
                    selected: false
                });                    
                self.toggleEditDelete();                 		        		
        	}});           
            this.remove();
            this.toggleEditDelete();
            return false;
        }
    });
})(jQuery, AN || {});