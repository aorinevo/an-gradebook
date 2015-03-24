define(['jquery','backbone','underscore', 'models/StudentCourseGradebook', 'models/StudentList', 
	'models/AssignmentList', 'models/CellList', 'views/StudentStudentView', 'views/StudentAssignmentView'],
function($,Backbone,_,StudentCourseGradebook, StudentList, AssignmentList, CellList, StudentStudentView, 
	StudentAssignmentView){
      var StudentGradebookView = Backbone.View.extend({
        initialize: function(options) {
            var self = this;   
            this.options = options.options;
           	_(this).extend(this.options.gradebook_state);
           
            this.course = this.courses.findWhere({'selected': true});                        
        	this.sort_key = 'lastname'; 
			this.sort_column = this.students; 
			this.courseGradebook = new StudentCourseGradebook(this.course.attributes);	
            this.xhr = this.courseGradebook.fetch({
            	success: function(data){  
            		self.students.reset();   
					self.cells.reset();               		            		
					self.assignments.reset();          		            							
                    self.students.add(self.courseGradebook.get('students'));
                _.each(self.courseGradebook.get('assignments'), function(assignment) {
                    self.assignments.add(assignment);
                }); 
                _.each(self.courseGradebook.get('cells'), function(cell) {     	
                    self.cells.add(cell);
                });  
                                                
                self.render();
                self.listenTo(self.courses, 'add', self.render);
                self.listenTo(self.students, 'add', self.render);   
            	self.listenTo(self.students, 'add remove', self.sortByStudent);                                  
				self.listenTo(self.cells, 'add remove change:assign_order', self.render);                      
                self.listenTo(self.assignments, 'add remove change:assign_order change:assign_category', self.render);                                   
            	self.listenTo(self.assignments, 'change:sorted', self.sortByAssignment);                 	    	            		
            	}
            });
           	this.listenTo(this.course, 'change:selected', this.close);
            return this;
        },
        events: {
            'click button#filter-assignments': 'filterAssignments',
            'click #cb-select-all-1': 'selectAllStudents'
        },
        selectAllStudents: function(ev){ //This function is not implemented.  Possibility in future versions that more closely
        								 //Resemble wordpress admin page/post/etc.... list-tables
        	var _selected = $('#cb-select-all-1').is(':checked');
        	if(_selected){
        		_.each(AN.GlobalVars.students.models, function(student){
        			student.set({selected: true});
        		});
        	} else {
        		_.each(AN.GlobalVars.students.models, function(student){
        			student.set({selected: false});
        		});        	
        	}
        },
        render: function() {
        	var self = this;
        	var course = this.course;
        	var _x = _.map(this.assignments.models, function(model){return model.get('assign_category');});
         	var _assign_categories = _.without(_.uniq(_x),"") || null;                                           
			var _y = $('#filter-assignments-select').val();	                
            var template = _.template($('#student-gradebook-interface-template').html());
            var compiled = template({assign_categories: _assign_categories});     
           	$('#wpbody-content').append(self.$el.html(compiled));
            $('#filter-assignments-select').val(_y);                 	
        	switch(this.sort_key){
        		case 'cell':     
        			_.each(this.sort_column, function(cell) {
                		var view = new StudentStudentView({
                    		model: self.students.get(cell.get('uid')), options: self.options
                		}); 
						$('#students').append(view.render().el);                     
            		});                           		
            		var y = self.assignments.where({
                		gbid: parseInt(this.course.get('id'))
            		});
            		y = _.sortBy(y,function(assign){ return assign.get('assign_order');});
            		_.each(y, function(assignment) {
                		var view = new StudentAssignmentView({
                    		model: assignment, options: self.options
                	});
                		$('#students-header tr').append(view.render().el);
            		});
            		break;
            	case 'lastname':            
            		_.each(this.sort_column.models, function(student) { 
                		var view = new StudentStudentView({model: student, options: self.options});
						$('#students').append(view.render().el);              		                 
            		});             		            		  
            		var y = self.assignments.where({
                		gbid: parseInt(this.course.get('id'))
            		});
            		y = _.sortBy(y,function(assign){ return assign.get('assign_order');});  
            		_.each(y, function(assignment) {
                		var view = new StudentAssignmentView({model: assignment, options: self.options});
                		$('#students-header tr').append(view.render().el);
            		}); 
            		break;             	
            }                                                     
            return this;
        },
        close: function() {	 
        	this.xhr.abort();      
            !this.course.get('selected') && this.remove();
        },     
        filterAssignments: function() {       
        	var _x = $('#filter-assignments-select').val();	
            var _toHide = this.assignments.filter(
	            function(assign){
               		return assign.get('assign_category') != _x;
            	}
        	);
            var _toShow = this.assignments.filter(
	            function(assign){
               		return assign.get('assign_category') === _x;
            	}
        	);  
        	if( _x === "-1"){
        		this.assignments.each(function(assign){
                	assign.set({visibility: true});
				});
        	} else {      	
        		_.each(_toHide,function(assign){
                	assign.set({visibility: false});
            	});
            	_.each(_toShow,function(assign){
                	assign.set({visibility: true});
            	});
            }        
        },
        sortByStudent: function(ev) {     		
			this.sort_key = 'lastname'; 
			this.sort_column = this.students;                                               
           	this.render();                          
        },                      
        sortByAssignment: function(ev) {
            var x = this.cells.where({amid: parseInt(ev.get('id'))});         			
			this.sort_column = _.sortBy(x,function(cell){
				if (ev.get('sorted')==='asc'){
					return cell.get('assign_points_earned');
				} else {
					return -1*cell.get('assign_points_earned');
				}
			});             		
			this.sort_key = 'cell';                                                
           	this.render();                          
        }
    });
	return StudentGradebookView;
	});