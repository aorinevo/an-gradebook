(function($) {
    AN.GlobalVars.cells = new AN.Collections.Cells([]);
	AN.GlobalVars.assignments = new AN.Collections.Assignments([]); 
    AN.GlobalVars.students = new AN.Collections.Students([]);    
    AN.GlobalVars.courses = new AN.Collections.Courses([]);    
    AN.GlobalVars.courseGradebook = new AN.Models.CourseGradebook();
    
    
    AN.Views.App = AN.Views.Base.extend({
        el: '#an-gradebooks',
        events: {
            'click .course': 'showGradebook'
        },
        initialize: function() {        
            template = _.template($('#student-courses-interface-template').html(), {});
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
        addCourse: function(course) {
            var view = new AN.Views.StudentCourseView({
                model: course
            });
            $('#courses').append(view.render().el);
        }
    });
    var app = new AN.Views.App();
})(jQuery);