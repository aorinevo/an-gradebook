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
 		keyPressHandler: function(e) {
            if (e.keyCode == 27) this.deleteCancel();
            if (e.keyCode == 13) this.submitForm();
            return this;
        },                  
        deleteCancel: function() {
            this.remove();           
            return false;
        },
        submitForm: function(){        	
          $('#delete-student-form').submit();
        },        
        deleteSave: function(ev) {
        	ev.preventDefault();
            var studentInformation = $(ev.currentTarget).serializeObject();
			var x = studentInformation.id;
            var todel = this.model;
            todel.set({delete_options: studentInformation.delete_options});
            var self = this;
			todel.destroy({success: function (model,response){
				self.remove();                               		        		
        	}});           
        }
    });
})(jQuery, AN || {});