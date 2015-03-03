(function($,my){
	AN.Views.EditCourseView = AN.Views.Base.extend({
 		id: 'base-modal',
    	className: 'modal fade',
        events: {
            'hidden.bs.modal' : 'editCancel',
            'keyup'  : 'keyPressHandler',        
            'click #edit-course-save': 'submitForm',
            'submit #edit-course-form': 'editSave'
        },
        initialize: function(){  
            var course = AN.GlobalVars.courses.findWhere({
                selected: true
            });      
            $('body').append(this.render().el);
            return this;                
        },
        render: function() {
            var self = this;
            var course = AN.GlobalVars.courses.findWhere({
                selected: true
            });
            if (course) {
                var template = _.template($('#edit-course-template').html(), {
                    course: course
                });
                self.$el.html(template);                              
            } else {
                var template = _.template($('#edit-course-template').html(), {
                    course: null
                });
                self.$el.html(template);                
            }                        
            this.$el.modal('show');
			_.defer(function(){
				this.inputName = self.$('input[name="name"]');
				var strLength= inputName.val().length;
				//inputName.focus();				
				//inputName[0].setSelectionRange(strLength, strLength);
			});            
            return this;
        },       
        toggleEditDelete: function(){
            var x = AN.GlobalVars.courses.findWhere({selected: true});
            if(x){
              $('#edit-course, #delete-course').attr('disabled', false);
            }else{
              $('#edit-course, #delete-course').attr('disabled', true); 
            }         
            $('#add-course').attr('disabled', false);            
        },         
        keyPressHandler: function(e) {
            if (e.keyCode == 27) this.editCancel();
            if (e.keyCode == 13) this.submitForm();
            return this;
        },                 
        editCancel: function() {
			this.$el.data('modal', null);        
            this.remove();      
			this.toggleEditDelete();                                  
            return false;
        },
        submitForm: function(){
        	$('#edit-course-form').submit();
        },
        editSave: function(ev) {
            var courseInformation = $(ev.currentTarget).serializeObject(); //action: "add_course" or action: "update_course" is hidden in the edit-course-template 
			var x = $(ev.currentTarget).serializeObject().id;           
            var toadd = AN.GlobalVars.courses.findWhere({id : x});
            if(toadd){
            	toadd.save(courseInformation,{wait: true});
            } else {
             	delete(courseInformation['id']);
            	var toadds = new AN.Models.Course(courseInformation);
            	toadds.save(courseInformation,{success: function(model){
            		 AN.GlobalVars.courses.add(model);  
            		}
            	});            	
            }
			this.$el.modal('hide');               
            return false;
        }
    });
})(jQuery, AN || {});
     
    