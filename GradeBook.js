(function($,AN) {
    AN.GlobalVars.cells = new AN.Collections.Cells([]);
    AN.GlobalVars.assignments = new AN.Collections.Assignments([]);      
    AN.GlobalVars.students = new AN.Collections.Students([]);      
    AN.GlobalVars.courses = new AN.Collections.Courses([]); 
    AN.GlobalVars.courseGradebook = new AN.Models.CourseGradebook();
	AN.GlobalVars.anGradebooks = new AN.Collections.ANGradebooks([]);
	
    AN.Views.App = AN.Views.Base.extend({
        el: '#an-gradebooks',
        events: {
            'click button#add-course': 'editCoursePre',
            'click button#delete-course': 'deleteCourse',
            'click button#edit-course': 'editCourse',
            'click .course': 'showGradebook',
            'click #an-courses-container' : 'toggleEditDelete'
        },
        initialize: function() {	        
            template = _.template($('#courses-interface-template').html(), {});
            this.$el.html(template);
            $('#edit-course, #delete-course').attr('disabled',true);
            AN.GlobalVars.courses.fetch();
            this.listenTo(AN.GlobalVars.courses, 'add', this.addCourse);
            return this;
        },
        showGradebook: function() {
            var x = AN.GlobalVars.courses.findWhere({selected: true});
            if (x) {
                this.toggleEditDelete();
                var gradebook = new AN.Views.Gradebook({
                    model: x
                });
                $('#an-gradebooks').append(gradebook.render().el);
            	gradebook.toggleEditDelete();
            } else {
				this.toggleEditDelete();           
            }
            return this;
        },
        toggleEditDelete: function(){
            var x = AN.GlobalVars.courses.findWhere({selected: true});
            if(x){
              $('#edit-course, #delete-course').attr('disabled',false);
            }else{
              $('#edit-course, #delete-course').attr('disabled', true); 
            }         
        },    
        editCoursePre: function(){
            var x = AN.GlobalVars.courses.findWhere({selected: true});
            if(x){
            x.set({selected: false});
            }
            this.editCourse();            
        },    
        editCourse: function() {
        	$('#myModal').show();        
            $('#courses-interface-buttons-container').children().attr('disabled', true);
            var view = new AN.Views.EditCourseView();
            return false;
        },
        addCourse: function(course) {
            var view = new AN.Views.CourseView({
                model: course
            });
            $('#courses').append(view.render().el);
        },
        deleteCourse: function() {
            var todel = AN.GlobalVars.courses.findWhere({
                selected: true
            });
            var self = this;
            $.post(ajaxurl, {
                action: 'delete_course',
                id: todel.get('id')
            }, function(data, textStatus, jqXHR) {
                todel.set({
                    selected: false
                });
                AN.GlobalVars.courses.remove(todel.get('id'));
                self.toggleEditDelete();
            }, 'json');
        }
    });
    AN.GlobalVars.app = new AN.Views.App();
})(jQuery,AN);