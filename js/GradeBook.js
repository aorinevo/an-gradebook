(function($,AN) {
    AN.GlobalVars.cells = new AN.Collections.Cells([]);
    AN.GlobalVars.assignments = new AN.Collections.Assignments([]);      
    AN.GlobalVars.students = new AN.Collections.Students([]);      
    AN.GlobalVars.courses = new AN.Collections.Courses([]); 
    AN.GlobalVars.courseGradebook = new AN.Models.CourseGradebook();
	
    AN.Views.App = AN.Views.Base.extend({
        el: '#an-gradebooks',
        events: {
            'click button#add-course': 'editCourse',            
            'click .course': 'showGradebook',
            'click #an-courses-container' : 'toggleEditDelete'
        },
        initialize: function() {	        
            template = _.template($('#courses-interface-template').html(), {});
            this.$el.html(template);
            AN.GlobalVars.courses.fetch();
            this.listenTo(AN.GlobalVars.courses, 'add', this.addCourse);
            return this;
        },
        showGradebook: function() {
            var x = AN.GlobalVars.courses.findWhere({selected: true});
            if (x) {
                var gradebook = new AN.Views.Gradebook({
                    model: x
                });
                $('#an-gradebooks').append(gradebook.render().el);            
            } 
            return this;
        },   
        editCourse: function(ev) {
        	if($(ev.currentTarget)[0]['id']==='add-course'){
            	var x = AN.GlobalVars.courses.findWhere({selected: true});
            	if(x){
            	x.set({selected: false});
            	}
            }       
            var view = new AN.Views.EditCourseView();
            return false;
        },
        addCourse: function(course) {
            var view = new AN.Views.CourseView({
                model: course
            });
            $('#courses').append(view.render().el);
        }
    });
    new AN.Views.App();
})(jQuery, AN || {});