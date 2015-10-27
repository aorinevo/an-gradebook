define(['jquery','backbone','underscore', 'views/EditCourseView'],
function($,Backbone,_, EditCourseView){
	var CourseView = Backbone.View.extend({
		tagName: 'tr',
        events: {
            'click li.course-submenu-delete' : 'deleteCourse',
            'click li.course-submenu-export2csv' : 'exportToCSV',            
            'click li.course-submenu-edit': 'editCourse'            
        },
        initialize: function(options) {
			this.options = options.options;
           	//_(this).extend(this.options.gradebook_state);     
            this.course = this.model;  
            this.courseList = this.collection;
            this.listenTo(this.model, 'change', this.render);
            //this.role = this.roles.findWhere({gbid: parseInt(this.course.get('id'))}); 	
        },
        close: function() {
        	this.remove();
        },
        exportToCSV: function(ev){
        	ev.preventDefault();
        	this.model.export2csv();
        },
        deleteCourse: function(ev) {
        	ev.preventDefault();
        	this.model.set({selected: false});
        	this.model.destroy(); 
        },
        editCourse: function() {
        	console.log(this.course);
            var view = new EditCourseView({model: this.course, collection: this.courseList, options: this.options});
            return false;
        },             
        render: function() {
        	var self = this;
            var template = _.template($('#course-view-template').html());
            var compiled = template({course : this.course}); 
            return this.$el.html(compiled)    	        
           
        }
    });
    return CourseView;
});
    