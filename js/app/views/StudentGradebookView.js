(function($,AN){
      AN.Views.Gradebook = AN.Views.Base.extend({
        id: 'an-gradebook',
        initialize: function() {
            var self = this;
        	this.sort_key = 'lastname'; 
			this.sort_column = AN.GlobalVars.students;              	         	                       
            this.xhr = AN.GlobalVars.courseGradebook.fetch({
            	success: function(data){
            		AN.GlobalVars.students.reset();   
					AN.GlobalVars.cells.reset();               		            		
					AN.GlobalVars.assignments.reset();              		            							
                    AN.GlobalVars.students.add(AN.GlobalVars.courseGradebook.get('students'));
                _.each(AN.GlobalVars.courseGradebook.get('assignments'), function(assignment) {
                    AN.GlobalVars.assignments.add(assignment);
                }); 
                _.each(AN.GlobalVars.courseGradebook.get('cells'), function(cell) {     	
                	//console.log(cell);
                    AN.GlobalVars.cells.add(cell);
                });                                       
                self.render();                                                       	            		
            	}
            });
            this.listenTo(this.model, 'change:selected', this.close);
            return this;
        },
        events: {
            'click button#filter-assignments': 'filterAssignments'
        },
        render: function() {
        	var course = AN.GlobalVars.courses.findWhere({
               	selected: true
        	});
        	var _x = _.map(AN.GlobalVars.assignments.models, function(model){return model.get('assign_category');});
         	var _assign_categories = _.without(_.uniq(_x),"");                                           
			var _y = $('#filter-assignments-select').val();	                
            var template = _.template($('#student-gradebook-interface-template').html(), {
                    assign_categories: _assign_categories
                });        
            this.$el.html(template);
            $('#filter-assignments-select').val(_y);                 	
        	switch(this.sort_key){
        		case 'cell':     
        			_.each(this.sort_column, function(cell) {
                		var view = new AN.Views.StudentStudentView({
                    		model: AN.GlobalVars.students.get(cell.get('uid'))
                		}); 
						$('#students').append(view.render().el);                     
            		});                           		
            		var y = AN.GlobalVars.assignments.where({
                		gbid: parseInt(this.model.get('id'))
            		});
            		y = _.sortBy(y,function(assign){ return assign.get('assign_order');});
            		_.each(y, function(assignment) {
                		var view = new AN.Views.StudentAssignmentView({
                    		model: assignment
                	});
                		$('#students-header tr').append(view.render().el);
            		});
            		break;
            	case 'lastname':     
				//console.log(AN.GlobalVars.students);
            		_.each(this.sort_column.models, function(student) {
                		var view = new AN.Views.StudentStudentView({
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
                		var view = new AN.Views.StudentAssignmentView({
                    		model: assignment
                		});
                	$('#students-header tr').append(view.render().el);
            		});  
            		break;             	
            }                                                     
            return this;
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
        },      
        sortByStudent: function(ev) {     		
			this.sort_key = 'lastname'; 
			this.sort_column = AN.GlobalVars.students;                                               
           	this.render();                          
        },                      
        sortByAssignment: function(ev) {
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
        }
    });
})(jQuery, AN || {});