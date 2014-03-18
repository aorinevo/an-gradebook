(function($) {
     google.load('visualization', '1.0', {'packages':['corechart']});


        function drawChart(data) {
        // Create the data table.
        var datag = new google.visualization.DataTable();
	datag.addColumn('string', 'Grades');
        datag.addColumn('number', 'Number');
        datag.addRows([
          ['A', data['grades'][0]],
          ['B', data['grades'][1]],
          ['C', data['grades'][2]],
          ['D', data['grades'][3]],
          ['F', data['grades'][4]]
        ]);

        // Set chart options
        var optionsg = {'title': data['assign_name'],
                       'width':500,
                       'height':400};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
         chart.draw(datag, optionsg);
      }
      
    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    var Cell = Backbone.Model.extend({
        defaults: {
            uid: null,
            // user id
            gbid: null,
            order: null,
            amid: null,
            // assignment id
            assign_points_earned: 0,
            selected: false,
            display: false
        },
        toggleSelected: function() {
            this.set({
                selected: !this.get('selected')
            });
        }
    });
    var Cells = Backbone.Collection.extend({
        model: Cell
    });
    var cells = new Cells([]);
    var CellView = Backbone.View.extend({
        tagName: 'td',
        events: {
            "click .view": "edit",
            "keypress .edit": "updateOnEnter",
            "blur .edit": "hideInput"
        },
        initialize: function() {
            this.listenTo(this.model, 'change:assign_points_earned', this.render);
            this.listenTo(assignments, 'change:selected', this.selectCell);
            this.listenTo(this.model, 'change:selected', this.selectCellCSS);
            this.listenTo(this.model, 'remove', function() {
                this.remove();
            });
        },
        render: function() {
            this.$el.html('<div class="view">' + this.model.get('assign_points_earned') + '</div> <input class="edit" type="text" value="' + this.model.get('assign_points_earned') + '"></input>');
            this.input = this.$('.edit');
            return this;
        },
        close: function() {
            this.remove();
        },
        updateOnEnter: function(e) {
            if (e.keyCode == 13) this.hideInput();
        },
        hideInput: function() { //this gets called twice.
            var value = this.input.val();
            var self = this;
            $.post(ajax_object.ajax_url, {
                action: 'update_assignment',
                uid: this.model.get('uid'),
                amid: this.model.get('amid'),
                assign_points_earned: value
            }, function(data) {
                data && self.model.set({
                    assign_points_earned: data['assign_points_earned']
                });
            }, 'json');
            this.$el.removeClass("editing");
        },
        edit: function() {
            var w = this.$el.width();
            this.input.css('width', w);
            this.input.css('margin-right', -w); //I'm not really sure why, but this works??		    
            this.$el.addClass("editing");
            this.input.focus();
        },
        selectCell: function(ev) {
            var x = assignments.findWhere({
                selected: true
            });
            if (x && this.model.get('amid') == x.get('id')) {
                this.model.set({
                    selected: true
                });
            } else {
                this.model.set({
                    selected: false
                });
            }
        },
        selectCellCSS: function() {
            if (this.model.get('selected')) {
                this.$el.addClass('selected');
            } else {
                this.$el.removeClass('selected');
            }
        }
    });
    var Assignment = Backbone.Model.extend({
        defaults: {
            assign_name: 'assign name',
            gbid: null,
            selected: false
        },
        toggleSelected: function() {
            this.set({
                selected: !this.get('selected')
            });
        }
    });
    var Assignments = Backbone.Collection.extend({
        model: Assignment
    });
    var assignments = new Assignments([]);    
    var AssignmentView = Backbone.View.extend({
        tagName: 'th',
        events: {
            'click .assignment': 'selectAssignment',
            'click': 'unSelect'
        },
        initialize: function() {
			this.listenTo(this.model, 'change:assign_name', this.render);         
            this.listenTo(this.model, 'change:selected', this.selectAssignmentCSS);
            this.listenTo(this.model, 'remove', function() {
                this.remove();
            });
        },
        render: function() {
            this.$el.html('<div class="assignment">' + this.model.get('assign_name') + '</div><div class="test"></div>');
            return this;
        },
        selectAssignment: function(ev) {
            var x = students.findWhere({
                selected: true
            });
            x && x.set({
                selected: false
            });
            if (this.model.get('selected')) {
                this.model.set({
                    selected: false
                });
            } else {
                var x = assignments.findWhere({
                    selected: true
                });
                x && x.set({
                    selected: false
                });
                this.model.set({
                    selected: true
                });
            }
        },
        selectAssignmentCSS: function() {
            if (this.model.get('selected')) {
                this.$el.addClass('selected');
            } else {
                this.$el.removeClass('selected');
            }
        }
    });
    var Student = Backbone.Model.extend({
        defaults: {
            firstname: 'john',
            lastname: 'doe',
            gbid: null,
            id: '',
            selected: false
        },
        toggleSelected: function() {
            this.set({
                selected: !this.get('selected')
            });
        }
    });    
    var Students = Backbone.Collection.extend({
        model: Student
    });
    var students = new Students([]);    
    
    var StudentView = Backbone.View.extend({
        tagName: 'tr',
        events: {
            'click .student': 'selectStudent'
        },
        initialize: function() {
            this.listenTo(cells, 'add', this.addCell);
			this.listenTo(this.model, 'change:firstname change:lastname', this.render);            
            this.listenTo(this.model, 'change:selected', this.selectStudentCSS);
            this.listenTo(this.model, 'remove', function() {
                this.remove()
            });
            this.listenTo(anGradebooks, 'remove', function(anGradebook) {                
                if(this.model.get('id')==anGradebook.get('uid')){
                	this.remove();
                }
            });            
            this.listenTo(courses.findWhere({
                selected: true
            }), 'change:selected', function() {
                this.remove()
            });
            
        },
        render: function() {
            this.$el.html('<td class="student">' + this.model.get("firstname") + '</td><td>' + this.model.get("lastname") + '</td><td>' + this.model.get("id") + '</td>');
            var gbid = courses.findWhere({selected: true}).get('id');
            var x = cells.where({
            	uid: this.model.get('id').toString(),
            	gbid: gbid
            	});
            var self = this;
            _.each(x, function(cell) {
                var view = new CellView({
                    model: cell
                });
                self.$el.append(view.render().el);
            });
            return this;
        },
        selectStudent: function(ev) {
            var x = assignments.findWhere({
                selected: true
            });
            x && x.set({
                selected: false
            });
            if (this.model.get('selected')) {
                this.model.set({
                    selected: false
                });
            } else {
                var x = students.findWhere({
                    selected: true
                });
                x && x.set({
                    selected: false
                });
                this.model.set({
                    selected: true
                });
            }
        },
        selectStudentCSS: function() {
            if (this.model.get('selected')) {
                this.$el.addClass('selected');
            } else {
                this.$el.removeClass('selected');
            }
        },
        close: function() {
            if (courses.findWhere({
                id: this.model.get('gbid')
            }).get('selected') == false) {
                this.remove();
            }
        },
        addCell: function(assignment) {
            if (assignment.get('uid') == this.model.get('id')) {
                var view = new CellView({
                    model: assignment
                });
                this.$el.append(view.render().el);
            }
        }
    });
    var Course = Backbone.Model.extend({
        defaults: {
            name: 'Calculus I',
            school: 'Bergen',
            semester: 'Fall',
            year: '2014',
            selected: false
        }
    });    
    var Courses = Backbone.Collection.extend({
        model: Course
    });
    var courses = new Courses([]);    
    var CourseView = Backbone.View.extend({
        tagName: 'tr',
        events: {
            'click .course': 'selectCourse'
        },
        initialize: function() {
			this.listenTo(this.model, 'change:name change:school change:semester change:year', this.render);
            this.listenTo(this.model, 'change:selected', this.selectCourseCSS);
            this.listenTo(this.model, 'remove', function() {
                this.remove();
            });
        },
        render: function() {
            this.$el.html('<td>' + this.model.get("id") + '</td><td class="course">' + this.model.get("name") + '</td><td>' + this.model.get("school") + '</td>' + '</td><td>' + this.model.get("semester") + '</td>' + '</td><td>' + this.model.get("year") + '</td>');
            return this;
        },
        selectCourse: function(ev) {
            var x = students.findWhere({
                selected: true
            });
            x && x.set({
                selected: false
            });
            var y = assignments.findWhere({
                selected: true
            });
            y && y.set({
                selected: false
            });
            if (this.model.get('selected')) {
                this.model.set({
                    selected: false
                });
            } else {
                var x = courses.findWhere({
                    selected: true
                });
                x && x.set({
                    selected: false
                });
                this.model.set({
                    selected: true
                });
            }
        },
        selectCourseCSS: function() {
            if (this.model.get('selected')) {
                this.$el.addClass('selected');
            } else {
                this.$el.removeClass('selected');
            }
        }
    });
    
var ANGradebook = Backbone.Model.extend({
});

var ANGradebooks = Backbone.Collection.extend({
  	model: ANGradebook
});

var anGradebooks = new ANGradebooks([]);

    var EditStudentView = Backbone.View.extend({
        id: 'edit-student-form-container-container',
        events: {
            'click button#edit-student-cancel': 'editCancel',
            'submit #edit-student-form': 'editSave'
        },
        render: function() {
            var self = this;
            var student = students.findWhere({
                selected: true
            });
            var gradebook = courses.findWhere({
        		selected: true
            });
            if (student) {
                var template = _.template($('#edit-student-template').html(), {
                    student: student,
                    gradebook: gradebook
                });
                self.$el.html(template);
            } else {
                var template = _.template($('#edit-student-template').html(), {
                    student: null,
                    gradebook: gradebook
                });
                self.$el.html(template);
            }                         
            return this;
        },
        toggleEditDelete: function(){
        	$('#myModal').hide();         
            var x = students.findWhere({selected: true});
            if(x){
              $('#add-student, #edit-student, #delete-student, #add-assignment').button('enable');
            }else{           
              $('#edit-student, #delete-student').button('disable'); 
            }     
            $('#add-student, #add-assignment').button('enable');                
        },        
        editCancel: function() {
            this.remove();           
			this.toggleEditDelete();
            return false;
        },
        editSave: function(ev) {
            var studentInformation = $(ev.currentTarget).serializeObject(); //action: "add_student" or action: "update_student" is hidden in the edit-student-template 
            $.post(ajax_object.ajax_url, studentInformation, function(data, textStatus, jqXHR) { 
                if(studentInformation['action']=='update_student'){
                	var x = students.get(data['student']['id']);
                	_.each(data['student'], function(valz, keyz){
                	   var y = JSON.parse('{"' + keyz + '":"' + valz + '"}');
                	   x.set(y);
                	});
                } else {
                	_.each(data['assignment'], function(assignment) {
                  	  cells.add(assignment);
              		});
                	students.add(data['student']);
                	anGradebooks.add(data['anGradebook']);                            	
                }                                                        
            }, 'json');
            this.remove();
            this.toggleEditDelete();
            return false;
        }
    });
    var EditAssignmentView = Backbone.View.extend({
        id: 'edit-assignment-form-container-container',
        events: {
            'click button#edit-assignment-cancel': 'editCancel',
            'submit #edit-assignment-form': 'editSave'
        },
        initialize: function(){
            var assignment = assignments.findWhere({
                selected: true
            });        
            $('#myModal').append(this.render().el);
            $('#edit-assignment-save, #edit-assignment-cancel').button();
            $('#assign-date-datepicker, #assign-due-datepicker').datepicker();
            $('#assign-date-datepicker, #assign-due-datepicker').datepicker('option','dateFormat','yy-mm-dd');
            if(assignment){                  
            $('#assign-date-datepicker').datepicker('setDate', assignment.get('assign_date'));                                                            
            $('#assign-due-datepicker').datepicker('setDate', assignment.get('assign_due'));       
            }     	
            return this;
        },
        render: function() {
            var self = this;
            var assignment = assignments.findWhere({
                selected: true
            });
            var gradebook = courses.findWhere({
                selected: true
            });
            if (assignment) {
                var template = _.template($('#edit-assignment-template').html(), {
                    assignment: assignment,
                    gradebook: gradebook
                });
                self.$el.html(template);             
            } else {
                var template = _.template($('#edit-assignment-template').html(), {
                    assignment: null,
                    gradebook: gradebook
                });
                self.$el.html(template);
            }     
            return this;
        },
        toggleEditDelete: function(){
            $('#myModal').hide();        
            var y = assignments.findWhere({selected: true});
            if(y){
              $('#add-assignment, #edit-assignment, #delete-assignment, #add-student').button('enable');
            }else{          
              $('#edit-assignment, #delete-assignment').button('disable'); 
            }    
            $('#add-assignment, #add-student').button('enable');            
        },        
        editCancel: function() {
            this.remove();
			this.toggleEditDelete();
            return false;
        },
        editSave: function(ev) {
            ev.preventDefault();
            var assignmentInformation = $(ev.currentTarget).serializeObject(); //action: "add_assignment" or action: "update_assignments" is hidden in the edit-course-template 
            $.post(ajax_object.ajax_url, assignmentInformation, function(data, textStatus, jqXHR) {
                if(assignmentInformation['action']=='update_assignments'){
                	var x = assignments.get(data['id']);
                	_.each(data, function(valz, keyz){
                	   var y = JSON.parse('{"' + keyz + '":"' + valz + '"}');
                	   x.set(y);
                	});
                } else {
                	assignments.add(data['assignmentDetails']);
                	_.each(data['assignmentStudents'], function(cell) {
                    	cells.add(cell)
                	});              
                }               
            }, 'json');
            this.remove();
			this.toggleEditDelete();       
            return false;
        }
    });
    var EditCourseView = Backbone.View.extend({
        id: 'edit-course-form-container-container',
        events: {
            'click button#edit-course-cancel': 'editCancel',
            'submit #edit-course-form': 'editSave'
        },
        render: function() {
            var self = this;
            var course = courses.findWhere({
                selected: true
            });
            if (course) {
                var template = _.template($('#edit-course-template').html(), {
                    course: course
                });
                self.$el.html(template);
            } else {
                var template = _.template($('#edit-course-template').html(), {
                    course: null
                });
                self.$el.html(template);
            }
            return this;
        },       
        toggleEditDelete: function(){
			$('#myModal').hide();        
            var x = courses.findWhere({selected: true});
            if(x){
              $('#edit-course, #delete-course').button('enable');
            }else{
              $('#edit-course, #delete-course').button('disable'); 
            }         
            $('#add-course').button('enable');            
        },          
        editCancel: function() {
            this.remove();            
			this.toggleEditDelete();
            return false;
        },
        editSave: function(ev) {
            ev.preventDefault();
            var courseInformation = $(ev.currentTarget).serializeObject(); //action: "add_course" or action: "update_course" is hidden in the edit-course-template 
            $.post(ajax_object.ajax_url, courseInformation, function(data, textStatus, jqXHR) {
                if(courseInformation['action']=='update_course'){
                	var x = courses.get(data['id']);
                	_.each(data, function(valz, keyz){
                	   var y = JSON.parse('{"' + keyz + '":"' + valz + '"}');
                	   x.set(y);
                	});
                } else {
	                courses.add(data);                
                }
            }, 'json');
			this.toggleEditDelete();       
            this.remove();
            return false;
        }
    });
	var PieChartView = Backbone.View.extend({
		id: 'chart-container',
		initialize: function(){
		   $('#an-gradebooks').after(this.$el);
		   this.$el.html('<div id="chart_div"></div>');
		   
		   this.listenTo(assignments, 'change', this.toggleChart);
		   return this;
		},
		toggleChart: function(assignment){
			if(assignment.get('selected')){
			$.get(ajax_object.ajax_url, { 
						action: 'get_pie_chart',
						amid : assignment.get('id'),
						gbid : assignment.get('gbid')
					},
					function(data){
						drawChart({grades: data['grades'],assign_name: assignment.get('assign_name')});
						$('#chart_div').show();
					}, 
					'json');
			return this;
			} else {
				$('#chart_div').hide();
			}
		}
	});    
	
	var pieChart = new PieChartView();
	
    var Gradebook = Backbone.View.extend({
        id: 'an-gradebook',
        initialize: function() {
            var self = this;
            $.when(            
            $.ajax({
                url: ajax_object.ajax_url,
                data: {
                    action: 'get_students',
                    gbid: this.model.id
                },
                contentType: 'json',
                dataType: 'json'
            }), $.ajax({
                url: ajax_object.ajax_url,
                data: {
                    action: 'get_assignments',
                    gbid: this.model.id
                },
                contentType: 'json',
                dataType: 'json'
            }), $.ajax({
                url: ajax_object.ajax_url,
                data: {
                    action: 'get_assignment',
                    gbid: this.model.id
                },
                contentType: 'json',
                dataType: 'json'
            }),
			$.ajax({
                url: ajax_object.ajax_url,
                data: {
                    action: 'get_gradebook',
                    gbid: this.model.id
                },
                contentType: 'json',
                dataType: 'json'
            })).done(function(a1, a2, a3, a4) {
                _.each(a1[0], function(student) {
                    students.add(student);
                });
                _.each(a4[0], function(gradebook) {
                    anGradebooks.add(gradebook);
                });
                var x = anGradebooks.where({
                    gbid: self.model.get('id')
                });
                x = _.pluck(x, 'attributes'); 
                var uids = _.pluck(x,'uid');                                                
                _.each(a3[0], function(cell) {                	
                    cells.add(cell);
                });                          
                _.each(uids, function(studentID) {
                    var view = new StudentView({
                        model: students.get(studentID)
                    });
                    $('#students').append(view.render().el);
                });
                _.each(a2[0], function(assignment) {
                    assignments.add(assignment);
                });
                var y = assignments.where({
                    gbid: self.model.get('id')
                });
                _.each(y, function(assignment) {
                    var view = new AssignmentView({
                        model: assignment
                    });
                    $('#students-header tr').append(view.render().el);
                });
                self.listenTo(anGradebooks, 'add', self.addStudent);
                self.listenTo(assignments, 'add', self.addAssignment);
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
            'click button#delete-assignment': 'deleteAssignment',
            'click #an-gradebook-container' : 'toggleEditDelete'
        },
        render: function() {
            var template = _.template($('#gradebook-interface-template').html(), {});
            this.$el.html(template);
            return this;
        },
        toggleEditDelete: function(){
            var x = students.findWhere({selected: true});
            if(x){
              $('#edit-student, #delete-student').button('enable');
            }else{
              $('#edit-student, #delete-student').button('disable'); 
            }
            var y = assignments.findWhere({selected: true});
            if(y){
              $('#edit-assignment, #delete-assignment').button('enable');
            }else{
              $('#edit-assignment, #delete-assignment').button('disable'); 
            }            
        },
        close: function() {
            !this.model.get('selected') && this.remove();
        },
        addStudent: function(studentgradebook) {
            student = students.get({id: studentgradebook.get('uid')});
            var view = new StudentView({
                model: student
            });
            $('#students').append(view.render().el);
            return this;
        },
        editStudentPre: function(){
            var x = students.findWhere({selected: true});
            x && x.set({selected: false});
			var y = assignments.findWhere({selected: true});
			y && y.set({selected: false});
            this.editStudent();            
        },          
        editStudent: function() {
        	$('#myModal').show();
            $('#gradebook-interface-buttons-container').children().button('disable');
            var view = new EditStudentView();         
            $('#myModal').append(view.render().el);                
            $('#edit-student-save, #edit-student-cancel').button();
            return false;
        },
        deleteStudent: function() {
            var x = students.findWhere({
                selected: true
            });
            var y = courses.findWhere({
            	selected: true
            });
            var self = this;
            $.post(ajax_object.ajax_url, {
                action: 'delete_student',
                id: x.get('id'),
                gbid: y.get('id')
            }, function(data, textStatus, jqXHR) {
                x.set({
                    selected: false
                });
                var z = anGradebooks.findWhere({uid: x.get('id').toString(), gbid: y.get('id').toString()});
                anGradebooks.remove(z.get('id'));
	            self.toggleEditDelete();                
            }, 'json');
        },
        addAssignment: function(assignment) {
            var view = new AssignmentView({
                model: assignment
            });
            $('#students-header tr').append(view.render().el);
            return this;
        },
        editAssignmentPre: function(){       
            var x = students.findWhere({selected: true});
            x && x.set({selected: false});
			var y = assignments.findWhere({selected: true});
			y && y.set({selected: false});
            this.editAssignment();            
        },          
        editAssignment: function() {
        	$('#myModal').show();       
            $('#gradebook-interface-buttons-container').children().button('disable');
            var view = new EditAssignmentView();          
     /*       $('#myModal').append(view.render().el);                            
            $('#edit-assignment-save, #edit-assignment-cancel').button();
            $('#assign-date-datepicker, #assign-due-datepicker').datepicker();
            $('#assign-date-datepicker, #assign-due-datepicker').datepicker('option','dateFormat','yy-mm-dd');            */
            return false;
        },
        deleteAssignment: function() {
            var todel = assignments.findWhere({
                selected: true
            });
            $.post(ajax_object.ajax_url, {
                action: 'delete_assignment',
                id: todel.get('id')
            }, function(data, textStatus, jqXHR) {
                todel.set({
                    selected: false
                });
                assignments.remove(todel.get('id'));
                var x = cells.where({
                    amid: todel.get('id')
                });
                _.each(x, function(cell) {
                    cells.remove(cell);
                });
            }, 'json');
        }
    });
    var App = Backbone.View.extend({
        el: '#an-gradebooks',
        events: {
            'click button#add-course': 'editCoursePre',
            'click button#delete-course': 'deleteCourse',
            'click button#edit-course': 'editCourse',
            'click .course': 'showGradebook',
            'click #an-courses-container' : 'toggleEditDelete'
        },
        initialize: function() {
		    $('body').prepend('<div id="myModal"></div>');	        
            template = _.template($('#courses-interface-template').html(), {});
            this.$el.html(template);
            $('#add-course, #delete-course, #edit-course').button();
            $('#edit-course, #delete-course').button('disable');
            $.ajax({
                url: ajax_object.ajax_url,
                data: {
                    action: 'get_courses'
                },
                contentType: 'json',
                dataType: 'json',
                success: function(data) {
                    _.each(data, function(course) {
                        courses.add(course);
                    });
                }
            });
            this.listenTo(courses, 'add', this.addCourse);
            return this;
        },
        showGradebook: function() {
            var x = courses.findWhere({selected: true});
            if (x) {
                this.toggleEditDelete();
                var gradebook = new Gradebook({
                    model: x
                });
                $('#an-gradebooks').append(gradebook.render().el);
             	$('#gradebook-interface-buttons-container').children().button();
            	gradebook.toggleEditDelete();
            } else {
				this.toggleEditDelete();           
            }
            return this;
        },
        toggleEditDelete: function(){
            var x = courses.findWhere({selected: true});
            if(x){
              $('#edit-course, #delete-course').button('enable');
            }else{
              $('#edit-course, #delete-course').button('disable'); 
            }         
        },    
        editCoursePre: function(){
            var x = courses.findWhere({selected: true});
            if(x){
            x.set({selected: false});
            }
            this.editCourse();            
        },    
        editCourse: function() {
        	$('#myModal').show();        
            $('#courses-interface-buttons-container').children().button('disable');
            var view = new EditCourseView();
            $('#myModal').append(view.render().el);
            $('#edit-course-save, #edit-course-cancel').button();
            return false;
        },
        addCourse: function(course) {
            var view = new CourseView({
                model: course
            });
            $('#courses').append(view.render().el);
        },
        deleteCourse: function() {
            var todel = courses.findWhere({
                selected: true
            });
            var self = this;
            $.post(ajax_object.ajax_url, {
                action: 'delete_course',
                id: todel.get('id')
            }, function(data, textStatus, jqXHR) {
                todel.set({
                    selected: false
                });
                courses.remove(todel.get('id'));
                self.toggleEditDelete();
            }, 'json');
        }
    });
    var app = new App();
})(jQuery);