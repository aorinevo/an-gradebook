define(['jquery','underscore','backbone', 'views/CourseListView','views/GradeBookView','views/SettingsPage',
'models/CourseList','models/Course','models/CourseGradebook', 'models/Settings'
],
   /**
    * @exports GradeBookRouter
    */

function($,_,Backbone,CourseListView,GradeBookView,SettingsPage, CourseList, Course, CourseGradebook, Settings){	
	Backbone.emulateHTTP = true;
	var GradeBookRouter = Backbone.Router.extend({
		initialize: function(){
			this._views = [];
			var _x = $('a[href$="an_gradebook"]');
			_x.attr('href',_x.attr('href') + '#courses');
			var _x = $('a[href$="an_gradebook_settings"]');
			_x.attr('href',_x.attr('href') + '#settings');						
			Backbone.history.start();	 	
		},
  		routes: {
    		"courses" : "courses",
	    	"gradebook/:id" :  "show-gradebook",
	    	"settings" :  "settings",
	    	"course/:cid/gradebook/add-student" : "edit-student",	    	
	    	"course/:cid/gradebook/add-student/:uid" : "edit-student"
  		},
  		initPage: function(){
			$('#wpcontent').css('padding-left', '0px');  		
  		},
  		clearViews : function(){
  			var self = this;
  			this.initPage();
		  	_.each(self._views,function(view){
		  	   view.close();
		  	});
		  	this._views = [];    			 
  		},
  		courses : function() {
  			var self = this;
			this.clearViews();
            var _request = 0;  			
			this.courseList = new CourseList();		 			
			this.listenToOnce(this.courseList,'request',function(){
				if(_request === 0){
		            $('#wpbody-content').prepend($('#ajax-template').html());						
		        }
				_request = _request + 1;
			});
			this.listenToOnce(this.courseList,'sync',function(){			
				_request = _request - 1;				
				if(_request === 0 ){
					$('.ajax-loader-container').remove();					
		    		var homeView = new CourseListView({collection: self.courseList});
					self._views.push(homeView);				
				}
			});	
			this.courseList.fetch();						
	  	},  
		"show-gradebook" : function(id) {
			var self = this;
			this.clearViews();
            var _request = 0; 
			this.xhrs = [];			
			this.course = new Course({id : parseInt(id)});					
			this.gradebook = new CourseGradebook({gbid: parseInt(id)});	
 			_.each([this.course,this.gradebook],function(model){
				self.listenToOnce(model,'request',function(){	
					if( _request === 0){
			            $('#wpbody-content').prepend($('#ajax-template').html());							
			        }
			   		_request = _request + 1;
				});
				self.listenToOnce(model,'sync',function(){							
			   		_request = _request - 1;
				   	if(_request === 0 ){
						$('.ajax-loader-container').remove();	
	    				var gradeBookView = new GradeBookView({gradebook: self.gradebook, course: self.course});         					
			    		self._views.push(gradeBookView);									   	
			   		}
				});	    
			});	
			this.xhrs.push(this.course.fetch(),this.gradebook.fetch());							
  		},
		settings: function(){
			var self = this;
			this.clearViews();			
            var _request = 0;  			
			this.gradebook_administrators = new Settings();        			    	 			
			this.listenToOnce(this.gradebook_administrators,'request',function(){
				console.log(_request);	
				if(_request === 0){
		            $('#wpbody-content').prepend($('#ajax-template').html());						
		        }
				_request = _request + 1;
			});
			this.listenToOnce(this.gradebook_administrators,'sync',function(){			
				_request = _request - 1;				
				if(_request === 0 ){
					$('.ajax-loader-container').remove();		
		    		var settingsPage = new SettingsPage({gradebook_administrators: self.gradebook_administrators});					
					self._views.push(settingsPage);		 											
				}
			});				
			this.gradebook_administrators.fetch();		   
		},
		"edit-student": function(cid,uid){			
			this.clearViews();
				console.log("add-student");
			if(uid){
			    var editStudentView = new EditStudentView();
			} else {
			    var editStudentView = new EditStudentView();			
			}
			this._views.push(editStudentView);		
		},	
	});	  
	return GradeBookRouter;	
});