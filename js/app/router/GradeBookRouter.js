define(['jquery','underscore','backbone','views/CourseListView','views/GradeBookView'],
function($,_,Backbone,CourseListView,GradeBookView){	
	var GradeBookRouter = Backbone.Router.extend({
		initialize: function(){
			this._views = [];
			Backbone.history.start();	 	
		},
  		routes: {
    		"": "home",
	    	"gradebook/:id" :  "gradebook"      
  		},
  		clearViews : function(){
  			var self = this;
  			console.log(self._views);
		  	_.each(self._views,function(view){
		  	   view.close();
		  	});
		  	this._views = [];    			 
  		},
  		home : function() {
			this.clearViews();
		    var homeView = new CourseListView();
			this._views.push(homeView);
	  	},  
		gradebook : function(id) {
			this.clearViews();
    		var gradeBookView = new GradeBookView({gbid : parseInt(id)});
			this._views.push(gradeBookView);
  		}
	});	  
	return GradeBookRouter;	
});