define(['jquery','backbone','underscore','models/CourseList','models/CellList','models/Config', 'models/UserList', 'models/AssignmentList',
	'views/CourseView','views/EditCourseView','views/GradebookView'],
function($, Backbone, _, CourseList, CellList, Config, UserList, AssignmentList, CourseView, EditCourseView, GradebookView){
var App = Backbone.View.extend({
        events: {
            'click button#add-course': 'editCourse',            
            'click #an-courses-container' : 'toggleEditDelete'
        },
        initialize: function(options) {	 
        	var self = this;  
  $('#wpbody-content').append('<div id="loading-courses-container"><div class="row"><div id="loading-courses-spinner" class="col-md-4 col-md-offset-4"><span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>loading...</div></div></div>');            
        	this.config = new Config({});;  
			this.cells = new CellList([]);
			this.students = new UserList([]);
			this.roles = new UserList([]);				
			this.courses = new CourseList([]);		
			this.assignments = new AssignmentList([]); 
			this.options = options || {};  	
			this.options.gradebook_state = { roles: this.roles, courses: this.courses, 
				students: this.students, assignments: this.assignments, cells: this.cells };			                                         			 		
            this.config.fetch({success: function(){
            	$('#loading-courses-container').remove();
            	self.wp_role = self.config.get('wp_role');      	
            	$('#wpbody-content').append(self.render().el);        
                _.each(self.config.get('roles'), function(role) {
                    self.roles.add(role);
                });
                _.each(self.config.get('courses'), function(course) {
                    self.courses.add(course);
                });                
            }});                      
			this.listenTo(this.courses, 'change:selected', this.showGradebook);            			
            this.listenTo(this.courses, 'add', this.addCourse);                        
            return this;
        },
        render: function(){
            var template = _.template($('#courses-interface-template').html());
            var compiled = template({wp_role: this.wp_role});
            this.$el.html(compiled);
            return this;        
        },
        showGradebook: function(course) {    
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
            var view = new EditCourseView({options: this.options});
            return false;
        },
        addCourse: function(course) {
            var view = new CourseView({model: course, options: this.options});
            $('#courses').append(view.render().el);
        }
    });
   return App;
});