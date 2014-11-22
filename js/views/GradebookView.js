AN.Views.Gradebook = (function($,my){
      my = AN.Views.Base.extend({
        id: 'an-gradebook',
        initialize: function() {
            var self = this;
        	this.sort_key = 'lastname'; 
			this.sort_column = AN.GlobalVars.students;              	         	           
            var courseGradebook = new AN.Models.CourseGradebook();
            this.xhr = courseGradebook.fetch({
            	success: function(data){
            		AN.GlobalVars.students.reset();   
					AN.GlobalVars.cells.reset();               		            		
					AN.GlobalVars.assignments.reset();              		            							
                _.each(courseGradebook.get('students'), function(student) {
                    AN.GlobalVars.students.add(student);
                });
                _.each(courseGradebook.get('assignments'), function(assignment) {
                    AN.GlobalVars.assignments.add(assignment);
                }); 
                _.each(courseGradebook.get('student_assignments'), function(cell) {     	
                    AN.GlobalVars.cells.add(cell);
                });                                
                _.each(courseGradebook.get('gradebook_students'), function(gradebook) {
                    AN.GlobalVars.anGradebooks.add(gradebook);
                });                                       
                self.render();
                self.listenTo(AN.GlobalVars.anGradebooks, 'add', self.render);
                self.listenTo(AN.GlobalVars.assignments, 'add', self.render);
                self.listenTo(AN.GlobalVars.assignments, 'change:assign_category', self.render);                
            	self.listenTo(AN.GlobalVars.assignments, 'change:sorted', self.sortAssignment);              		
            	}
            });
            this.listenTo(this.model, 'change:selected', this.close);
            return this;
        },
        events: {
            'click button#add-student': 'editStudent',
            'click button#edit-student': 'editStudent',
            'click button#delete-student': 'deleteStudent',
            'click button#add-assignment': 'editAssignment',
            'click button#edit-assignment': 'editAssignment',        
            'click button#delete-assignment': 'deleteAssignment',                
            'click button#stats-assignment': 'statsAssignment',
            'click button#stats-student': 'statsStudent',            
            'click #an-gradebook-container' : 'toggleEditDelete',
            'click button#filter-assignments': 'filterAssignments'
        },
        render: function() {
        	var course = AN.GlobalVars.courses.findWhere({
               	selected: true
        	});
        	var _x = _.map(AN.GlobalVars.assignments.models, function(model){return model.get('assign_category');});
         	var _assign_categories = _.without(_.uniq(_x),"");                                           
			var _y = $('#filter-assignments-select').val();	                
            var template = _.template($('#gradebook-interface-template').html(), {
                    assign_categories: _assign_categories
                });        
            this.$el.html(template);
            $('#filter-assignments-select').val(_y);                    	
        	switch(this.sort_key){
        		case 'cell':
        			_.each(this.sort_column, function(cell) {
                		var view = new AN.Views.StudentView({
                    		model: AN.GlobalVars.students.get(cell.get('uid'))
                		}); 
						$('#students').append(view.render().el);                    
            		});             
            		var y = AN.GlobalVars.assignments.where({
                		gbid: parseInt(this.model.get('id'))
            		});
            		y = _.sortBy(y,function(assign){ return assign.get('assign_order');});
            		_.each(y, function(assignment) {
                		var view = new AN.Views.AssignmentView({
                    		model: assignment
                	});
                		$('#students-header tr').append(view.render().el);
            		});
            		break;
            	case 'lastname':       		
            		_.each(this.sort_column.models, function(student) {
                		var view = new AN.Views.StudentView({
                    		model: AN.GlobalVars.students.get(student.get('id'))
                		});
						$('#students').append(view.render().el);                    
            		});   
           			var z = AN.GlobalVars.assignments.where({
                		gbid: this.model.get('id')
            		});
            		var y = AN.GlobalVars.assignments.where({
                		gbid: parseInt(this.model.get('id'))
            		});
            		y = _.sortBy(y,function(assign){ return assign.get('assign_order');});  	
            		_.each(y, function(assignment) {
                		var view = new AN.Views.AssignmentView({
                    		model: assignment
                		});
                	$('#students-header tr').append(view.render().el);
            		});  
            		break;             	
            }                                   
            this.toggleEditDelete();                        
            return this;
        },
        toggleEditDelete: function(){
            var x = AN.GlobalVars.students.findWhere({selected: true});
            if(x){
              $('#edit-student, #delete-student, #stats-student').attr('disabled',false);
            }else{
              $('#edit-student, #delete-student, #stats-student').attr('disabled',true);
            }
            var y = AN.GlobalVars.assignments.findWhere({selected: true});
            if(y){
              $('#edit-assignment, #delete-assignment, #stats-assignment').attr('disabled',false);
            }else{
              $('#edit-assignment, #delete-assignment, #stats-assignment').attr('disabled',true);
            }            
        },
        close: function() {	 
        	this.xhr.abort();      
            !this.model.get('selected') && this.remove();
        },     
        filterAssignments: function() {       
        	var _x = $('#filter-assignments-select').val();	           
            var _toHide = AN.GlobalVars.assignments.filter(
	            function(assign){
               		return assign.get('assign_category') != _x;
            	}
        	);
            var _toShow = AN.GlobalVars.assignments.filter(
	            function(assign){
               		return assign.get('assign_category') === _x;
            	}
        	);  
        	if( _x === "-1"){
        		AN.GlobalVars.assignments.each(function(assign){
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
            return false;
        },      
        editStudent: function(ev) {       
        	if(ev.currentTarget.id === "add-student"){
            	var x = AN.GlobalVars.students.findWhere({selected: true});
            	x && x.set({selected: false});
				var y = AN.GlobalVars.assignments.findWhere({selected: true});
				y && y.set({selected: false});
			}
            $('#gradebook-interface-buttons-container').children().attr('disabled',true);
            var view = new AN.Views.EditStudentView();      
            return false;
        },
        deleteStudent: function() {
        	$('#gradebook-interface-buttons-container').children().attr('disabled',true);
        	var view = new AN.Views.DeleteStudentView();      	
        	this.render;
        	return false;
        },     
        editAssignment: function(ev) {    
        	if(ev.currentTarget.id ==='add-assignment'){
        		var x = AN.GlobalVars.students.findWhere({selected: true});
            	x && x.set({selected: false});
				var y = AN.GlobalVars.assignments.findWhere({selected: true});
				y && y.set({selected: false});
			}
            $('#gradebook-interface-buttons-container').children().attr('disabled',true);
            var view = new AN.Views.EditAssignmentView();  
            return this;
        },
        statsAssignment: function(){
            var view = new AN.Views.AssignmentStatisticsView(); 
            return this;			
        },
        statsStudent: function(){
            var view = new AN.Views.StudentStatisticsView(); 
            return this;			
        },               
        sortAssignment: function(ev) {
            var x = AN.GlobalVars.cells.where({amid: parseInt(ev.get('id'))});         			
			this.sort_column = _.sortBy(x,function(cell){
				if (ev.get('sorted')==='asc'){
					return cell.get('assign_points_earned');
				} else {
					return -1*cell.get('assign_points_earned');
				}
			});             		
			this.sort_key = 'cell';                                                
           	this.render();       
            this.toggleEditDelete();                     
            return this;
        },
        deleteAssignment: function() {
            var todel = AN.GlobalVars.assignments.findWhere({
                selected: true
            });
            var self = this;
			todel.destroy(
        	{success: function (model){
	            model.set({ selected: false });       
                AN.GlobalVars.assignments.remove(model);   
                var x = AN.GlobalVars.cells.where({
                    amid: parseInt(model.get('id'))
                });
                _.each(x, function(cell) {
                    AN.GlobalVars.cells.remove(cell);
                });               
                self.render();              
                self.toggleEditDelete();                 		
        	}}
            );        
        }
    });
    return my;
})(jQuery, AN.Views.Gradebook || {});