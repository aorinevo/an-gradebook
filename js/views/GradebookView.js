AN.Views.Gradebook = (function($,my){
      my = AN.Views.Base.extend({
        id: 'an-gradebook',
        initialize: function() {
            var self = this;
			var aj1 = $.ajax({
                url: ajaxurl,
                data: {
                    action: 'get_students',
                    gbid: this.model.id
                },
                contentType: 'json',
                dataType: 'json'
            });
            var aj2 = $.ajax({
                url: ajaxurl,
                data: {
                    action: 'get_assignments',
                    gbid: this.model.id
                },
                contentType: 'json',
                dataType: 'json'
            });
            var aj3 = $.ajax({
                url: ajaxurl,
                data: {
                    action: 'get_assignment',
                    gbid: this.model.id
                },
                contentType: 'json',
                dataType: 'json'
            });
			var aj4 = $.ajax({
                url: ajaxurl,
                data: {
                    action: 'get_gradebook',
                    gbid: this.model.id
                },
                contentType: 'json',
                dataType: 'json'
            });   
            this.AjaxRequests = [aj1,aj2,aj3,aj4];                           
            $.when(aj1,aj2,aj3,aj4).done(function(a1, a2, a3, a4) { 
            		AN.GlobalVars.students.reset();   
					AN.GlobalVars.cells.reset();               		            		
					AN.GlobalVars.assignments.reset();               		            							
                _.each(a1[0], function(student) {
                    AN.GlobalVars.students.add(student);
                });
                _.each(a2[0], function(assignment) {
                    AN.GlobalVars.assignments.add(assignment);
                }); 
                _.each(a3[0], function(cell) {                	
                    AN.GlobalVars.cells.add(cell);
                });                                
                _.each(a4[0], function(gradebook) {
                    AN.GlobalVars.anGradebooks.add(gradebook);
                });                                          
                self.render();
                self.listenTo(AN.GlobalVars.anGradebooks, 'add', self.addStudent);
                self.listenTo(AN.GlobalVars.assignments, 'add', self.addAssignment);
            	self.listenTo(AN.GlobalVars.assignments, 'change:sorted', self.sortAssignment);                
            });
            this.listenTo(this.model, 'change:selected', this.close);
            return this;
        },
        events: {
            'click button#add-student': 'editStudentPre',
            'click button#edit-student': 'editStudent',
            'click button#delete-student': 'deleteStudent',
            'click button#add-assignment': 'editAssignmentPre',
            'click button#edit-assignment': 'editAssignment',
            'click button#stats-assignment': 'statsAssignment',
            'click button#stats-student': 'statsStudent',            
            'click button#delete-assignment': 'deleteAssignment',
            'click #an-gradebook-container' : 'toggleEditDelete'
        },
        render: function() {
            var template = _.template($('#gradebook-interface-template').html(), {});
            this.$el.html(template);
                var x = AN.GlobalVars.students.toJSON();  
                x = _.sortBy(x, 'lastname');                                        
                _.each(x, function(student) {
                    var view = new AN.Views.StudentView({
                        model: AN.GlobalVars.students.get(student['id'])
                    });
					$('#students').append(view.render().el);                    
                });              
                var y = AN.GlobalVars.assignments.where({
                    gbid: parseInt(this.model.get('id'))   //anq: why is this.model.get('id') a string to begin with??
                });
                _.each(y, function(assignment) {
                    var view = new AN.Views.AssignmentView({
                        model: assignment
                    });
                    $('#students-header tr').append(view.render().el);
                });    
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
            for(var i = 0; i < this.AjaxRequests.length; i++)
    			this.AjaxRequests[i].abort();	        
            !this.model.get('selected') && this.remove();
        },
        addStudent: function(studentgradebook) {
            student = AN.GlobalVars.students.get({id: parseInt(studentgradebook.get('uid'))});
            var view = new AN.Views.StudentView({
                model: student
            });
            $('#students').append(view.render().el);
            return this;
        },
        editStudentPre: function(){
            var x = AN.GlobalVars.students.findWhere({selected: true});
            x && x.set({selected: false});
			var y = AN.GlobalVars.assignments.findWhere({selected: true});
			y && y.set({selected: false});
            this.editStudent();            
        },          
        editStudent: function() {
            $('#gradebook-interface-buttons-container').children().attr('disabled',true);
            var view = new AN.Views.EditStudentView();         
            return false;
        },
        deleteStudent: function() {
        	$('#gradebook-interface-buttons-container').children().attr('disabled',true);
        	var view = new AN.Views.DeleteStudentView(); 
        	return false;
        },
        addAssignment: function(assignment) {
            var view = new AN.Views.AssignmentView({
                model: assignment
            });
            $('#students-header tr').append(view.render().el);
            return this;
        },
        editAssignmentPre: function(){       
            var x = AN.GlobalVars.students.findWhere({selected: true});
            x && x.set({selected: false});
			var y = AN.GlobalVars.assignments.findWhere({selected: true});
			y && y.set({selected: false});
            this.editAssignment();            
        },          
        editAssignment: function() {     
            $('#gradebook-interface-buttons-container').children().attr('disabled',true);
            var view = new AN.Views.EditAssignmentView();         
            return false;
        },
        statsAssignment: function(){
            var view = new AN.Views.AssignmentStatisticsView(); 
            return false;			
        },
        statsStudent: function(){
            var view = new AN.Views.StudentStatisticsView(); 
            return false;			
        },        
        sortAssignment: function(ev) {
            var template = _.template($('#gradebook-interface-template').html(), {});
            this.$el.html(template);
                var x = AN.GlobalVars.cells.toJSON();  
                x = _.where(x, {amid: parseInt(ev.get('id'))});              
                x = _.sortBy(x, 'assign_points_earned');                                        
                _.each(x, function(cell) {
                    var view = new AN.Views.StudentView({
                        model: AN.GlobalVars.students.get(cell['uid'])
                    });
					$('#students').append(view.render().el);                    
                });              
                var y = AN.GlobalVars.assignments.where({
                    gbid: parseInt(this.model.get('id'))   //anq: why is this.model.get('id') a string to begin with??
                });
                _.each(y, function(assignment) {
                    var view = new AN.Views.AssignmentView({
                        model: assignment
                    });
                    $('#students-header tr').append(view.render().el);
                });       
            this.toggleEditDelete();                     
            return this;
        },
        deleteAssignment: function() {
            var todel = AN.GlobalVars.assignments.findWhere({
                selected: true
            });
            var self = this;
            $.post(ajaxurl, {
                action: 'delete_assignment',
                id: todel.get('id')
            }, function(data, textStatus, jqXHR) {          
                todel.set({
                    selected: false
                });
                AN.GlobalVars.assignments.remove(todel.get('id'));
                var x = AN.GlobalVars.cells.where({
                    amid: parseInt(todel.get('id'))
                });
                _.each(x, function(cell) {
                    AN.GlobalVars.cells.remove(cell);
                });
	            self.toggleEditDelete();                     
            }, 'json');
        }
    });
    return my;
})(jQuery, AN.Views.Gradebook || {});