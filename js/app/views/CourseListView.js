define(['jquery','backbone','underscore','models/CourseList','views/EditCourseView','views/CourseView'],
function($, Backbone, _, CourseList,EditCourseView,CourseView){
var CourseListView = Backbone.View.extend({
        events: {
            'click a#add-course': 'editCourse'         
        },
	    initialize: function(){
	        var self = this;
	        this._subviews = [];
			this.courseList = new CourseList();
			this.courseList.fetch({success: function(model,response,options){ 
				self.listenTo(self.courseList, 'add', self.render);
				self.listenTo(self.courseList, 'remove', self.render);				
				self.render();
			}});				       
	    },   
  		clearSubViews : function(){
  			var self = this;
  			console.log(self._subviews);
		  	_.each(self._subviews,function(view){
		  	   view.close();
		  	});
		  	this._subviews = [];    			 
  		},	      
        render: function(){
        	var self = this;
            var template = _.template($('#course-list-template').html());
            var compiled = template({});
            $('#wpbody-content').prepend(this.$el.html(compiled));
            _.each(self.courseList.models,function(course){
            	var courseView = new CourseView({model: course, collection: self.courseList});
				$('.angb-course-list-tbody').append(courseView.render());                         	
	        });
            return this;        
        }, 
        editCourse: function(ev) {   
            var view = new EditCourseView({collection: this.courseList});
            return false;
        },
        addCourse: function(course) {
            var view = new CourseView({model: course, collection: this.courseList, options: this.options});
            $('#courses').append(view.render().el);
        },
 		close: function(){
			console.log('clearing subviews in course list view'); 		 			
 			this.clearSubViews();
 		  	console.log('removing course list view'); 		
 		  	this.remove();
 		}
    });
   return CourseListView;
});