AN.Views.DeleteStudentView = (function($,my){
	my = AN.Views.Base.extend({
        id: 'delete-student-form-container-container',
        events: {
            'click button#delete-student-cancel': 'deleteCancel',
            'click a.media-modal-close' : 'deleteCancel', 
			'keyup'  : 'keyPressHandler',                            
            'click #delete-student-delete': 'submitForm',            
            'submit #delete-student-form': 'deleteSave'
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
            if (e.keyCode == 27) this.editCancel();
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
            var studentInformation = $(ev.currentTarget).serializeObject(); //action: "delete_student" is hidden in the delete-student-template 
            console.log(studentInformation);
            $.post(ajaxurl, studentInformation, function(data, textStatus, jqXHR) {
                var x = AN.GlobalVars.students.get(studentInformation['id']);       
                console.log(x);     
                x.set({
                    selected: false
                });
                console.log(x);
                var z = AN.GlobalVars.anGradebooks.findWhere({uid: x.get('id').toString(), gbid: x.get('gbid').toString()});
                console.log(z);
                AN.GlobalVars.anGradebooks.remove(z.get('id'));              
            }, 'json');            
            this.remove();
            this.toggleEditDelete();
            return false;
        }
    });
    return my;
})(jQuery, AN.Views.DeleteStudentView || {});