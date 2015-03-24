define(['jquery','backbone','underscore','models/StudentCourseList','models/CellList', 'models/StudentList', 'models/AssignmentList',
	'views/StudentCourseView','views/StudentGradebookView'],
function($, Backbone, _, StudentCourseList, CellList, StudentList, AssignmentList, StudentCourseView, StudentGradebookView){
var App = Backbone.View.extend({
        events: {
            'click button#add-course': 'editCourse',            
            'click #an-courses-container' : 'toggleEditDelete'
        },
        initialize: function(options) {	
        	$('#wpbody-content').append(this.render().el);      
			this.courses = new StudentCourseList([]);  
			this.cells = new CellList([]);
			this.students = new StudentList([]);
			this.assignments = new AssignmentList([]); 
			this.options = options || {};               			 	
			this.options.gradebook_state = { courses: this.courses, students: this.students, assignments: this.assignments, cells: this.cells };			
            this.courses.fetch();                       
            this.listenTo(this.courses, 'change:selected', this.showGradebook);
            this.listenTo(this.courses, 'add', this.addCourse);            
            return this;
        },
        render: function(){
            template = _.template($('#student-courses-interface-template').html());
            this.$el.html(template);
            return this;        
        },
        showGradebook: function(course) {      
			if (course.get('selected')===true){
                var gradebook = new StudentGradebookView({options: this.options});          
            } 
            return this;
        },
        addCourse: function(course) {
            var view = new StudentCourseView({model: course, options: this.options});
            $('#courses').append(view.render().el);
        }        
    });
   return App;
});