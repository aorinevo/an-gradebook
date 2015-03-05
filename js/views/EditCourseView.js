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
        initialize: function(model){  
            $('body').append(this.render().el);
            return this;                
        },
        render: function() {
            var self = this;
            var _course = this.model;            
            if (_course) {
                var template = _.template($('#edit-course-template').html(), {
                    course: _course
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
        keyPressHandler: function(e) {
        	var self = this;
			switch(e.keyCode){
				case 27: 
					self.$el.modal('hide');  
					break;
				case 13: 		
					self.submitForm();
					break;
			}					
            return this;
        },                 
        editCancel: function() {
			this.$el.data('modal', null);        
            this.remove();                                      
            return false;
        },
        submitForm: function(){
        	$('#edit-course-form').submit();
        },
        editSave: function(ev) {
        	var self = this;
            var courseInformation = $(ev.currentTarget).serializeObject(); //action: "add_course" or action: "update_course" is hidden in the edit-course-template 
			var x = $(ev.currentTarget).serializeObject().id;           
            var toadd = AN.GlobalVars.courses.findWhere({id : x});
            if(toadd){
            	toadd.save(courseInformation,{wait: true});
					 self.$el.modal('hide');              	
            } else {
             	delete(courseInformation['id']);
            	var toadds = new AN.Models.Course(courseInformation);
            	toadds.save(courseInformation,{success: function(model){
            		 AN.GlobalVars.courses.add(model);  
					 self.$el.modal('hide');                		 
            		}
            	});            	
            }           
            return false;
        }
    });
})(jQuery, AN || {});
     
    