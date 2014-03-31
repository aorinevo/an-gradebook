(function($) {


  var AN = AN || {};
  AN.Models = AN.Models || {};
  AN.Collections = AN.Collections || {};
  AN.Views = AN.Views || {};
  AN.Routers = AN.Routers || {};
  AN.Funcs = AN.Funcs || {};
  
  AN.Models.Base = Backbone.Model.extend();

  AN.Collections.Base = Backbone.Collection.extend({
    model: AN.Models.Base
  });

  AN.Views.Base = Backbone.View.extend();
  AN.Routers.Base = Backbone.Router.extend();  
  
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
                       'width':400,
                       'height':400,
                       'backgroundColor': 'none'};

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

    AN.Models.Cell = AN.Models.Base.extend({
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
    
    AN.Collections.Cells = AN.Collections.Base.extend({
        model: AN.Models.Cell
    });
    
    var cells = new AN.Collections.Cells([]);
    
    AN.Views.CellView = AN.Views.Base.extend({
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
            $.post(ajaxurl, {
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
    AN.Models.Assignment = AN.Models.Base.extend({
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
    AN.Collections.Assignments = AN.Collections.Base.extend({
        model: AN.Models.Assignment
    });
    var assignments = new AN.Collections.Assignments([]);    
    AN.Views.AssignmentView = AN.Views.Base.extend({
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
    AN.Models.Student = AN.Models.Base.extend({
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
    AN.Collections.Students = AN.Collections.Base.extend({
        model: AN.Models.Student
    });
    var students = new AN.Collections.Students([]);    
    
    AN.Views.StudentView = AN.Views.Base.extend({
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
                var view = new AN.Views.CellView({
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
                var view = new AN.Views.CellView({
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
    
	AN.Models.ANGradebook = AN.Models.Base.extend({
});

	AN.Collections.ANGradebooks = AN.Collections.Base.extend({
  	model: AN.Models.ANGradebook
});

var anGradebooks = new AN.Collections.ANGradebooks([]);

    AN.Views.EditStudentView = AN.Views.Base.extend({
        id: 'edit-student-form-container-container',
        events: {
            'click button#edit-student-cancel': 'editCancel',
            'click a.media-modal-close' : 'editCancel', 
			'keyup'  : 'keyPressHandler',                            
            'click #edit-student-save': 'submitForm',            
            'submit #edit-student-form': 'editSave'
        },
        initialize: function(){
            var student = students.findWhere({
                selected: true
            });       
            $('body').append(this.render().el);     	
            return this;
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
            this.$el.append('<div class="media-modal-backdrop"></div>');
			_.defer(function(){
				this.inputName = self.$('input[name="firstname"]');
				var strLength= inputName.val().length;
				inputName.focus();				
				inputName[0].setSelectionRange(strLength, strLength);
			});                                                 
            return this;
        },
        toggleEditDelete: function(){      
            var x = students.findWhere({selected: true});
            if(x){
              $('#add-student, #edit-student, #delete-student, #add-assignment').attr('disabled',false);
            }else{           
              $('#edit-student, #delete-student').attr('disabled',true);
            }     
            $('#add-student, #add-assignment').attr('disabled',false);
        },   
 		keyPressHandler: function(e) {
            if (e.keyCode == 27) this.editCancel();
            if (e.keyCode == 13) this.submitForm();
            return this;
        },                  
        editCancel: function() {
            this.remove();           
			this.toggleEditDelete();
            return false;
        },
        submitForm: function(){        	
          $('#edit-student-form').submit();
        },        
        editSave: function(ev) {
            var studentInformation = $(ev.currentTarget).serializeObject(); //action: "add_student" or action: "update_student" is hidden in the edit-student-template 
            $.post(ajaxurl, studentInformation, function(data, textStatus, jqXHR) { 
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
    AN.Views.EditAssignmentView = AN.Views.Base.extend({
        id: 'edit-assignment-form-container-container',
        events: {
            'click button#edit-assignment-cancel': 'editCancel',
            'click a.media-modal-close' : 'editCancel', 
			'keyup'  : 'keyPressHandler',    			                                   
            'click #edit-assignment-save': 'submitForm',
            'submit #edit-assignment-form': 'editSave'
        },
        initialize: function(){
            var assignment = assignments.findWhere({
                selected: true
            });        
            $('body').append(this.render().el);
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
            this.$el.append('<div class="media-modal-backdrop"></div>');   
			_.defer(function(){
				this.inputName = self.$('input[name="assign_name"]');
				var strLength= inputName.val().length;
				inputName.focus();				
				inputName[0].setSelectionRange(strLength, strLength);
			});                      
            return this;
        },
        toggleEditDelete: function(){
            var y = assignments.findWhere({selected: true});
            if(y){
              $('#add-assignment, #edit-assignment, #delete-assignment, #add-student').attr('disabled',false);
            }else{          
              $('#edit-assignment, #delete-assignment').attr('disabled',true); 
            }    
            $('#add-assignment, #add-student').attr('disabled',false);            
        },      
		keyPressHandler: function(e) {
            if (e.keyCode == 27) this.editCancel();
            if (e.keyCode == 13) this.submitForm();
            return this;
        },             
        editCancel: function() {
            this.remove();
			this.toggleEditDelete();
            return false;
        },
        submitForm: function(){        	
          $('#edit-assignment-form').submit();
        },
        editSave: function(ev) {
            ev.preventDefault();
            var assignmentInformation = $(ev.currentTarget).serializeObject(); //action: "add_assignment" or action: "update_assignments" is hidden in the edit-course-template 
            $.post(ajaxurl, assignmentInformation, function(data, textStatus, jqXHR) {
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
    AN.Views.EditCourseView = AN.Views.Base.extend({
        id: 'edit-course-form-container-container',
        events: {
            'click button#edit-course-cancel': 'editCancel',
            'click a.media-modal-close' : 'editCancel',
            'keyup'  : 'keyPressHandler',        
            'click #edit-course-save': 'submitForm',
            'submit #edit-course-form': 'editSave'
        },
        initialize: function(){  
            var course = courses.findWhere({
                selected: true
            });      
            $('body').append(this.render().el);
            return this;                
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
                this.input = this.$('input #testing');
            	console.log(this.input.focus);              
            this.$el.append('<div class="media-modal-backdrop"></div>');
			_.defer(function(){
				this.inputName = self.$('input[name="name"]');
				var strLength= inputName.val().length;
				inputName.focus();				
				inputName[0].setSelectionRange(strLength, strLength);
			});            
            return this;
        },       
        toggleEditDelete: function(){
            var x = courses.findWhere({selected: true});
            if(x){
              $('#edit-course, #delete-course').attr('disabled', false);
            }else{
              $('#edit-course, #delete-course').attr('disabled', true); 
            }         
            $('#add-course').attr('disabled', false);            
        },         
        keyPressHandler: function(e) {
            if (e.keyCode == 27) this.editCancel();
            if (e.keyCode == 13) this.submitForm();
            return this;
        },                 
        editCancel: function() {
            this.remove();            
			this.toggleEditDelete();
            return false;
        },
        submitForm: function(){
        	$('#edit-course-form').submit();
        },
        editSave: function(ev) {
            var courseInformation = $(ev.currentTarget).serializeObject(); //action: "add_course" or action: "update_course" is hidden in the edit-course-template 
            $.post(ajaxurl, courseInformation, function(data, textStatus, jqXHR) {
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
	AN.Views.PieChartView = AN.Views.Base.extend({
		id: 'chart-container',
		initialize: function(){
		   $('#an-gradebooks').after(this.$el);
		   this.$el.html('<div id="chart_div"></div>');
		   
		   this.listenTo(assignments, 'change', this.toggleChart);
		   return this;
		},
		toggleChart: function(assignment){
			if(assignment.get('selected')){
			$.get(ajaxurl, { 
						action: 'get_pie_chart',
						amid : assignment.get('id'),
						gbid : assignment.get('gbid')
					},
					function(data){
						$('#chart_div').empty()					
						drawChart({grades: data['grades'],assign_name: assignment.get('assign_name')});
					}, 
					'json');
			return this;
			} else {
				$('#chart_div').empty();			
			}
		}
	});    
	
	var pieChart = new AN.Views.PieChartView();
	
    AN.Views.Gradebook = AN.Views.Base.extend({
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
                    var view = new AN.Views.StudentView({
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
                    var view = new AN.Views.AssignmentView({
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
              $('#edit-student, #delete-student').attr('disabled',false);
            }else{
              $('#edit-student, #delete-student').attr('disabled',true);
            }
            var y = assignments.findWhere({selected: true});
            if(y){
              $('#edit-assignment, #delete-assignment').attr('disabled',false);
            }else{
              $('#edit-assignment, #delete-assignment').attr('disabled',true);
            }            
        },
        close: function() {
            for(var i = 0; i < this.AjaxRequests.length; i++)
    			this.AjaxRequests[i].abort();	        
            !this.model.get('selected') && this.remove();
        },
        addStudent: function(studentgradebook) {
            student = students.get({id: studentgradebook.get('uid')});
            var view = new AN.Views.StudentView({
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
            $('#gradebook-interface-buttons-container').children().attr('disabled',true);
            var view = new AN.Views.EditStudentView();         
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
            $.post(ajaxurl, {
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
            var view = new AN.Views.AssignmentView({
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
            $('#gradebook-interface-buttons-container').children().attr('disabled',true);
            var view = new AN.Views.EditAssignmentView();         
            return false;
        },
        deleteAssignment: function() {
            var todel = assignments.findWhere({
                selected: true
            });
            $.post(ajaxurl, {
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
    AN.Views.App = AN.Views.Base.extend({
        el: '#an-gradebooks',
        events: {
            'click button#add-course': 'editCoursePre',
            'click button#delete-course': 'deleteCourse',
            'click button#edit-course': 'editCourse',
            'click .course': 'showGradebook',
            'click #an-courses-container' : 'toggleEditDelete'
        },
        initialize: function() {
		    //$('body').prepend('<div id="myModal" class="media-modal wp-core-ui"></div>');	        
            template = _.template($('#courses-interface-template').html(), {});
            this.$el.html(template);
            $('#edit-course, #delete-course').attr('disabled',true);
            $.ajax({
                url: ajaxurl,
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
                var gradebook = new AN.Views.Gradebook({
                    model: x
                });
                $('#an-gradebooks').append(gradebook.render().el);
            	gradebook.toggleEditDelete();
            } else {
				this.toggleEditDelete();           
            }
            return this;
        },
        toggleEditDelete: function(){
            var x = courses.findWhere({selected: true});
            if(x){
              $('#edit-course, #delete-course').attr('disabled',false);
            }else{
              $('#edit-course, #delete-course').attr('disabled', true); 
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
            $('#courses-interface-buttons-container').children().attr('disabled', true);
            var view = new AN.Views.EditCourseView();
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
            $.post(ajaxurl, {
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
    var app = new AN.Views.App();
})(jQuery);