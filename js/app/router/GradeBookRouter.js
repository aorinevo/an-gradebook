define(['jquery','underscore','backbone','views/CourseListView','views/GradeBookView','views/SettingsPage'],
   /**
    * @exports GradeBookRouter
    */
function($,_,Backbone,CourseListView,GradeBookView,SettingsPage){	
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
    		"courses": "courses",
	    	"gradebook/:id" :  "gradebook",
	    	"settings":  "settings"
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
			this.clearViews();
		    var homeView = new CourseListView();
			this._views.push(homeView);
	  	},  
		gradebook : function(id) {
			this.clearViews();
    		var gradeBookView = new GradeBookView({gbid : parseInt(id)});
			this._views.push(gradeBookView);
  		},
		settings: function(){
			this.clearViews();
		    var settingsPage = new SettingsPage();
			this._views.push(settingsPage);
		}  		
	});	  
	return GradeBookRouter;	
});