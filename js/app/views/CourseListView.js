define(['jquery','backbone','underscore','models/CourseList','views/EditCourseView','views/CourseView'],
function($, Backbone, _, CourseList,EditCourseView,CourseView){
   /**
    * A module representing a course list view.
    * @exports views/CourseListView
    */
var CourseListView = Backbone.View.extend({
	    initialize: function(){
	        var self = this;
            var _request = 0;                  
	        this._subviews = [];
			this.courseList = new CourseList();
			this.listenTo(this.courseList,'request',function(){	
				if(_request === 0){
		            $('#wpbody-content').prepend($('#ajax-template').html());						
		        }
				_request = _request + 1;
			});
			this.listenTo(this.courseList,'sync',function(){			
				_request = _request - 1;
				if(_request === 0 ){
					$('.ajax-loader-container').remove();
					self.listenTo(self.courseList, 'add', self.render);
					self.listenTo(self.courseList, 'remove', self.render);				
					self.render();					
				}
			});				
			this.courseList.fetch();				       
	    }, 
	    loadingData: function(){
        	var self = this;        	    
	    },
        events: {
            'click a#add-course': 'editCourse' ,    
	    	'click [class^=course-column-]' : 'sortCourseList'                
        },	
        checkStudentSortDirection: function(){
        	if( this.courseList.sort_direction === 'asc' ){
        		this.courseList.sort_direction = 'desc';
        	} else {
        		this.courseList.sort_direction = 'asc';
        	}
        },             
	    sortCourseList: function(ev){
	    	var column = ev.target.className.replace('course-column-','');
			this.courseList.sort_key = column;
			this.checkStudentSortDirection();			
			this.courseList.sort();
			this.render();
	    },
  		clearSubViews : function(){
  			var self = this;
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
 			this.clearSubViews();	
 		  	this.remove();
 		}
    });
   return CourseListView;
});