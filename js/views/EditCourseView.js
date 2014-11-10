AN.Views.EditCourseView = (function($,my){
	my = AN.Views.Base.extend({
        id: 'edit-course-form-container-container',
        events: {
            'click button#edit-course-cancel': 'editCancel',
            'click a.media-modal-close' : 'editCancel',
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
            this.$el.append('<div class="media-modal-backdrop"></div>');
			_.defer(function(){
				this.inputName = self.$('input[name="name"]');
				var strLength= inputName.val().length;
				inputName.focus();				
				inputName[0].setSelectionRange(strLength, strLength);
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
            this.remove();            
			this.toggleEditDelete();
            return false;
        },
        submitForm: function(){
        	$('#edit-course-form').submit();
        },
        editSave: function(ev) {
            var courseInformation = $(ev.currentTarget).serializeObject(); //action: "add_course" or action: "update_course" is hidden in the edit-course-template 
            $.post(ajaxurl, courseInformation, function(data, textStatus, jqXHR) {
                if(courseInformation['action']=='update_course'){
                	var x = AN.GlobalVars.courses.get(data['id']);
                	_.each(data, function(valz, keyz){
                	   var y = JSON.parse('{"' + keyz + '":"' + valz + '"}');
                	   x.set(y);
                	});
                } else {
	                AN.GlobalVars.courses.add(data);                
                }
            }, 'json');
			this.toggleEditDelete();       
            this.remove();
            return false;
        }
    });
    return my;
})(jQuery, AN.Views.EditCourseView || {});
     
    