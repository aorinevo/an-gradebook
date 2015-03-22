define(['jquery','backbone','underscore','models/CourseList','models/CellList', 'models/StudentList', 'models/AssignmentList',
	'views/CourseView','views/EditCourseView','views/GradebookView'],
function($, Backbone, _, CourseList, StudentList, CellList, AssignmentList, CourseView, EditCourseView, GradebookView){
var App = Backbone.View.extend({
        events: {
            'click button#add-course': 'editCourse',            
            'click #an-courses-container' : 'toggleEditDelete'
        },
        initialize: function(options) {	
        	$('#wpbody-content').append(this.render().el);      
			this.courses = new CourseList([]);  
			this.cells = new CellList([]);
			this.students = new StudentList([]);
			this.assignments = new AssignmentList([]); 
			this.options = options || {};               			 	
			this.options.gradebook_state = { courses: this.courses, students: this.students, assignments: this.assignments, cells: this.cells };			
            this.courses.fetch();      
            console.log(this.options);                  
            this.listenTo(this.courses, 'change:selected', this.showGradebook);
            console.log(this.courses);
            this.listenTo(this.courses, 'add', this.addCourse);
            return this;
        },
        render: function(){
            template = _.template($('#courses-interface-template').html());
            this.$el.html(template);
            return this;        
        },
        showGradebook: function(course) { 
        	console.log(course);       
			if (course.get('selected')===true){
                var gradebook = new GradebookView({options: this.options});          
            } 
            return this;
        },   
        editCourse: function(ev) {
        	if($(ev.currentTarget)[0]['id']==='add-course'){
            	var x = this.courses.findWhere({selected: true});
            	if(x){
            	x.set({selected: false});
            	}
            }       
            console.log(this.courses);
            var view = new EditCourseView({collection: this.courses});
            return false;
        },
        addCourse: function(course) {
            var view = new CourseView({model: course, collection: this.courses});
            $('#courses').append(view.render().el);
        }
    });
   return App;
});