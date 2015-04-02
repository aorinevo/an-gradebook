define(['jquery','backbone','underscore', 'models/CourseGradebook', 'models/UserList', 
	'models/AssignmentList', 'models/CellList', 'views/StudentView', 'views/AssignmentView', 'views/EditStudentView', 
	'views/EditAssignmentView'],
function($,Backbone,_, CourseGradebook, UserList, AssignmentList, CellList, StudentView, 
	AssignmentView, EditStudentView, EditAssignmentView){
      var GradebookView = Backbone.View.extend({
        initialize: function(options) {
            var self = this;   
            this.options = options.options;
           	_(this).extend(this.options.gradebook_state);
            this.course = this.courses.findWhere({'selected': true});   
			this.role = this.roles.findWhere({'gbid': this.course.get('id')});
        	this.sort_key = 'lastname'; 
			this.sort_column = this.students; 
			this.gradebook = new CourseGradebook({course: this.course , role: this.role});
			$('#wpbody-content').append('<div id="loading-students-container"><div class="row"><div id="loading-students-spinner" class="col-md-4 col-md-offset-4"><span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>loading...</div></div></div>');            
	
            this.xhr = this.gradebook.fetch({
            	success: function(data){    
            		$('#loading-students-container').remove();		
            		self.students.reset();
					self.cells.reset();               		            		
					self.assignments.reset();          		            							
                _.each(self.gradebook.get('students'), function(student) {
                    self.students.add(student);
                });
                _.each(self.gradebook.get('assignments'), function(assignment) {
                    self.assignments.add(assignment);
                }); 
                _.each(self.gradebook.get('cells'), function(cell) {     	
                    self.cells.add(cell);
                });  
                //self.gradebook.set({'students' : self.students});
                //self.gradebook.set({'cells' : self.cells});
                //self.gradebook.set({'assignments' : self.assignments});                                         
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
            'click button#add-student': 'addStudent',
            'click button#add-assignment': 'addAssignment',
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
            var template = _.template($('#gradebook-interface-template').html());
            var compiled = template({assign_categories: _assign_categories, role: this.role});     
           	$('#an-gradebook').append(self.$el.html(compiled));
            $('#filter-assignments-select').val(_y);                 	
        	switch(this.sort_key){
        		case 'cell':    
        			_.each(this.sort_column, function(cell) {
                		var view = new StudentView({
                    		model: self.students.get(cell.get('uid')), options: self.options
                		}); 
						$('#students').append(view.render().el);                     
            		});                          		
            		var y = self.assignments.where({
                		gbid: parseInt(this.course.get('id'))
            		});
            		y = _.sortBy(y,function(assign){ return assign.get('assign_order');});
            		_.each(y, function(assignment) {
                		var view = new AssignmentView({
                    		model: assignment, options: self.options
                	});
                		$('#students-header tr').append(view.render().el);
            		});
            		break;
            	case 'lastname':            
            		_.each(this.sort_column.models, function(student) { 
                		var view = new StudentView({model: student, options: self.options});
						$('#students').append(view.render().el);              		                 
            		});             		            		  
            		var y = self.assignments.where({
                		gbid: parseInt(this.course.get('id'))
            		});
            		y = _.sortBy(y,function(assign){ return assign.get('assign_order');});  
            		_.each(y, function(assignment) {
                		var view = new AssignmentView({model: assignment, options: self.options});
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
        addAssignment: function(ev) {    
            var view = new EditAssignmentView({options: this.options});           
        },    
        addStudent: function(ev) {  
            var view = new EditStudentView({options: this.options});      
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
	return GradebookView;
	});