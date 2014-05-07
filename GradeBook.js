(function($) {


  var AN = AN || {};
  AN.Models = AN.Models || {};
  AN.Collections = AN.Collections || {};
  AN.Views = AN.Views || {};
  AN.Routers = AN.Routers || {};
  AN.Funcs = AN.Funcs || {};
  AN.GlobalVars = AN.GlobalVars || {};  
  
  AN.Models.Base = Backbone.Model.extend();

  AN.Collections.Base = Backbone.Collection.extend({
    model: AN.Models.Base
  });

  AN.Views.Base = Backbone.View.extend();
  AN.Routers.Base = Backbone.Router.extend();  
  
     google.load('visualization', '1.0', {'packages':['corechart']});


        function drawPieChart(data) {
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
                       'width': '300',
                       'height': '300',
                       'backgroundColor': 'none'};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
         chart.draw(datag, optionsg);
      }
 		function drawLineChart(data) {
        var data = google.visualization.arrayToDataTable(data);

        var options = {
          title: 'Student Grades vs. Class Average',
          'width': '700',
		  'height': '300',          
          vAxis: 
          	{
          	 maxValue : 100,
          	 minValue : 0
          	}
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);
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
            hover: false,
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
    
    AN.GlobalVars.cells = new AN.Collections.Cells([]);
    
    AN.Views.CellView = AN.Views.Base.extend({
        tagName: 'td',
        events: {
            "click .view": "edit",
            "keypress .edit": "updateOnEnter",
            "blur .edit": "hideInput"
        },
        initialize: function() {
            this.listenTo(this.model, 'change:assign_points_earned', this.render);
            this.listenTo(AN.GlobalVars.assignments, 'change:selected', this.selectCell);
            this.listenTo(AN.GlobalVars.assignments, 'change:hover', this.hoverCell);            
            this.listenTo(this.model, 'change:selected', this.selectCellCSS);
            this.listenTo(this.model, 'change:hover', this.hoverCellCSS);            
            this.listenTo(this.model, 'remove', function() {
                this.remove();
            });
        },
        render: function() {
            this.$el.html('<div class="view">' + this.model.get('assign_points_earned') + '</div> <input class="edit" type="text" value="' + this.model.get('assign_points_earned') + '"></input>');
            this.input = this.$('.edit');
            return this;
        },
        hoverCell: function(){
        	
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
                if(data) self.model.set({
                    assign_points_earned: parseInt(data['assign_points_earned'])
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
        hoverCell: function(ev) {
            var x = AN.GlobalVars.assignments.findWhere({
                hover: true
            });
            if (x && this.model.get('amid') == x.get('id')) {
                this.model.set({
                    hover: true
                });
            } else {
                this.model.set({
                    hover: false
                });
            }
        },
        hoverCellCSS: function() {
            if (this.model.get('hover')) {
                this.$el.addClass('hover');
            } else {
                this.$el.removeClass('hover');
            }
        },        
        selectCell: function(ev) {
            var x = AN.GlobalVars.assignments.findWhere({
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
            sorted: '',
            selected: false
        }
    });
    AN.Collections.Assignments = AN.Collections.Base.extend({
        model: AN.Models.Assignment
    });
    AN.GlobalVars.assignments = new AN.Collections.Assignments([]);    
    AN.Views.AssignmentView = AN.Views.Base.extend({
        tagName: 'th',
        className: 'assignment manage-column sortable asc',
        events: {
            'click .column-title': 'selectColumn',
            'click .column-sort': 'sortColumn',
            'mouseenter div.column-frame' : 'mouseEnter',
            'mouseleave div.column-frame' : 'mouseLeave'
        },
        initialize: function() {
			this.listenTo(this.model, 'change:assign_name', this.render);         
            this.listenTo(this.model, 'change:selected', this.selectColumnCSS);
            this.listenTo(this.model, 'change:sorted', this.sortColumnCSS);            
            this.listenTo(this.model, 'remove', function() { this.remove(); });
        },
        mouseEnter: function(){
        	this.$el.addClass('hover');
        	this.model.set({hover: true});
        },
        mouseLeave: function(){
        	this.$el.removeClass('hover');	
        	this.model.set({hover: false});	
        },
        render: function() {   
            this.$el.html('<div class="column-frame"><div class="column-title">' + this.model.get('assign_name') + '</div><div class="column-sort an-sorting-indicator dashicons dashicons-arrow-down"></div></div>');
            return this;
        },
        sortColumn: function(ev){
        	var y = AN.GlobalVars.assignments.findWhere({selected: true});
        	y && y.set({selected: false});
            if (this.model.get('sorted')) {
            	if (this.model.get('sorted')=='desc') {
                	this.model.set({sorted: 'asc'});
            	} else {
                	this.model.set({sorted: 'desc'});            
            	}
            } else {
                var x = AN.GlobalVars.assignments.find(function(model){
                	return model.get('sorted').length >0;
                });
                x && x.set({ sorted: '' });
                this.model.set({ sorted: 'asc' });
            }        	
        },
        sortColumnCSS: function() {
            if (this.model.get('sorted')) {
        		var desc = this.$el.hasClass('desc');
        		this.$el.toggleClass( "desc", !desc ).toggleClass( "asc", desc );              	
            } else {
                this.$el.removeClass('asc desc');
                this.$el. addClass('asc');
            }
        },        
        selectColumn: function(ev) {
            var x = AN.GlobalVars.students.findWhere({ selected: true });
            x && x.set({ selected: false });
            if (this.model.get('selected')) {
                this.model.set({ selected: false });
            } else {
                var x = AN.GlobalVars.assignments.findWhere({ selected: true });
                x && x.set({ selected: false });
                this.model.set({ selected: true });
            }
        },       
        selectColumnCSS: function() {
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
            selected: false
        }
    });    
    AN.Collections.Students = AN.Collections.Base.extend({
        model: AN.Models.Student,
        comparator: function( model ) {
  				return model.get( 'lastname' );
		}
    });
    AN.GlobalVars.students = new AN.Collections.Students([]);    
    
    AN.Views.StudentView = AN.Views.Base.extend({
        tagName: 'tr',
        events: {
            'click .student': 'selectStudent'
        },
        initialize: function() {
            this.listenTo(AN.GlobalVars.cells, 'add', this.addCell);
			this.listenTo(this.model, 'change:firstname change:lastname', this.render);            
            this.listenTo(this.model, 'change:selected', this.selectStudentCSS);
            this.listenTo(this.model, 'remove', function() {
                this.remove()
            });
            this.listenTo(AN.GlobalVars.anGradebooks, 'remove', function(anGradebook) {                
                if(this.model.get('id')==anGradebook.get('uid')){
                	this.remove();
                }
            });            
            this.listenTo(AN.GlobalVars.courses.findWhere({
                selected: true
            }), 'change:selected', function() {
                this.remove()
            });
            
        },
        render: function() {
            this.$el.html('<td class="student">' + this.model.get("firstname") + '</td><td>' + this.model.get("lastname") + '</td><td>' + this.model.get("id") + '</td>');
            var gbid = parseInt(AN.GlobalVars.courses.findWhere({selected: true}).get('id')); //anq: why is this not already an integer??
            var x = AN.GlobalVars.cells.where({
            	uid: parseInt(this.model.get('id')),		//anq: why is this not already an integer??
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
            var x = AN.GlobalVars.assignments.findWhere({
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
                var x = AN.GlobalVars.students.findWhere({
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
            if (AN.GlobalVars.courses.findWhere({
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
    AN.Models.Course = AN.Models.Base.extend({
        defaults: {
            name: 'Calculus I',
            school: 'Bergen',
            semester: 'Fall',
            year: '2014',
            selected: false
        }
    });    
    AN.Collections.Courses = AN.Collections.Base.extend({
        model: AN.Models.Course
    });
    AN.GlobalVars.courses = new AN.Collections.Courses([]);    
    AN.Views.CourseView = AN.Views.Base.extend({
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
            var x = AN.GlobalVars.students.findWhere({
                selected: true
            });
            x && x.set({
                selected: false
            });
            var y = AN.GlobalVars.assignments.findWhere({
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
                var x = AN.GlobalVars.courses.findWhere({
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

	AN.GlobalVars.anGradebooks = new AN.Collections.ANGradebooks([]);

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
            var student = AN.GlobalVars.students.findWhere({
                selected: true
            });       
            $('body').append(this.render().el);     	
            return this;
        },        
        render: function() {
            var self = this;
            var student = AN.GlobalVars.students.findWhere({
                selected: true
            });
            var gradebook = AN.GlobalVars.courses.findWhere({
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
            var x = AN.GlobalVars.students.findWhere({selected: true});
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
                	var x = AN.GlobalVars.students.get(data['student']['id']);
                	_.each(data['student'], function(valz, keyz){
                	   var y = JSON.parse('{"' + keyz + '":"' + valz + '"}');
                	   x.set(y);
                	});
                } else {
                	_.each(data['assignment'], function(assignment) {
                  	  	AN.GlobalVars.cells.add(assignment);
              		});
                	AN.GlobalVars.students.add(data['student']);
                	AN.GlobalVars.anGradebooks.add(data['anGradebook']);                            	
                }                                                        
            }, 'json');
            this.remove();
            this.toggleEditDelete();
            return false;
        }
    });
    

    AN.Views.DeleteStudentView = AN.Views.Base.extend({
        id: 'delete-student-form-container-container',
        events: {
            'click button#delete-student-cancel': 'deleteCancel',
            'click a.media-modal-close' : 'deleteCancel', 
			'keyup'  : 'keyPressHandler',                            
            'click #delete-student-delete': 'submitForm',            
            'submit #delete-student-form': 'deleteSave'
        },
        initialize: function(){
            var student = AN.GlobalVars.students.findWhere({
                selected: true
            });       
            $('body').append(this.render().el);     	
            return this;
        },        
        render: function() {
            var self = this;
            var student = AN.GlobalVars.students.findWhere({
                selected: true
            });
            var gradebook = AN.GlobalVars.courses.findWhere({
        		selected: true
            });
            if (student) {
                var template = _.template($('#delete-student-template').html(), {
                    student: student,
                    gradebook: gradebook
                });
                self.$el.html(template);
            }
            this.$el.append('<div class="media-modal-backdrop"></div>');                                              
            return this;
        },
        toggleEditDelete: function(){      
            var x = AN.GlobalVars.students.findWhere({selected: true});
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
        deleteCancel: function() {
            this.remove();           
			this.toggleEditDelete();
            return false;
        },
        submitForm: function(){        	
          $('#delete-student-form').submit();
        },        
        deleteSave: function(ev) {
            var studentInformation = $(ev.currentTarget).serializeObject(); //action: "delete_student" is hidden in the delete-student-template 
            console.log(studentInformation);
            $.post(ajaxurl, studentInformation, function(data, textStatus, jqXHR) {
                var x = AN.GlobalVars.students.get(studentInformation['id']);       
                console.log(x);     
                x.set({
                    selected: false
                });
                console.log(x);
                var z = AN.GlobalVars.anGradebooks.findWhere({uid: x.get('id').toString(), gbid: x.get('gbid').toString()});
                console.log(z);
                AN.GlobalVars.anGradebooks.remove(z.get('id'));              
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
            var assignment = AN.GlobalVars.assignments.findWhere({
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
            var assignment = AN.GlobalVars.assignments.findWhere({
                selected: true
            });
            var gradebook = AN.GlobalVars.courses.findWhere({
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
            var y = AN.GlobalVars.assignments.findWhere({selected: true});
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
                	var x = AN.GlobalVars.assignments.get(data['id']);
                	_.each(data, function(valz, keyz){
                	   var y = JSON.parse('{"' + keyz + '":"' + valz + '"}');
                	   x.set(y);
                	});
                } else {
                	var x = _.map(data['assignmentDetails'], function(y){
                		return isNaN(y) ? y : parseInt(y);
                	});
                	AN.GlobalVars.assignments.add(data['assignmentDetails']);
                	_.each(data['assignmentStudents'], function(cell) {
                    	AN.GlobalVars.cells.add(cell)
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
            var course = AN.GlobalVars.courses.findWhere({
                selected: true
            });      
            $('body').append(this.render().el);
            return this;                
        },
        render: function() {
            var self = this;
            var course = AN.GlobalVars.courses.findWhere({
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
            var x = AN.GlobalVars.courses.findWhere({selected: true});
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
                	var x = AN.GlobalVars.courses.get(data['id']);
                	_.each(data, function(valz, keyz){
                	   var y = JSON.parse('{"' + keyz + '":"' + valz + '"}');
                	   x.set(y);
                	});
                } else {
	                AN.GlobalVars.courses.add(data);                
                }
            }, 'json');
			this.toggleEditDelete();       
            this.remove();
            return false;
        }
    });
     
    
    
	AN.Views.AssignmentStatisticsView = AN.Views.Base.extend({
		id: 'stats-assignment-container-container',
        events: {
            'click button#stats-assignment-close': 'editCancel',
            'click a#an-piechart': 'displayPieChart',
            'click a#an-linechart': 'displayLineChart',            
            'click a.media-modal-close' : 'editCancel'
        },		
		initialize: function(){	   
            var assignment = AN.GlobalVars.assignments.findWhere({
                selected: true
            });      
            $('body').append(this.render().el);
            return this;   		   
		},		
		displayPieChart: function(){
			$('.media-router').children().removeClass('active');
			$('#an-piechart').addClass('active');
            var assignment = AN.GlobalVars.assignments.findWhere({
                selected: true
            });			
			$.get(ajaxurl, { 
						action: 'get_pie_chart',
						amid : assignment.get('id'),
						gbid : assignment.get('gbid')
					},
					function(data){		
						//drawLineChart();		
						drawPieChart({grades: data['grades'],assign_name: assignment.get('assign_name')});
					}, 
					'json');    	
			return this;					
		},	
        render: function() {
            var self = this;
            var assignment = AN.GlobalVars.assignments.findWhere({
                selected: true
            });
            var template = _.template($('#stats-assignment-template').html(), {
                    assignment: assignment
            });
            self.$el.html(template);             
            this.displayPieChart();                                            
            this.$el.append('<div class="media-modal-backdrop"></div>');           
            return this;
        },
        editCancel: function() {
            this.remove();            
            return false;
        }
    });
    
	AN.Views.StudentStatisticsView = AN.Views.Base.extend({
		id: 'stats-student-container-container',
        events: {
            'click button#stats-student-close': 'editCancel',
            'click a#an-piechart': 'displayPieChart',
            'click a#an-linechart': 'displayLineChart',            
            'click a.media-modal-close' : 'editCancel'
        },		
		initialize: function(){	   
            var student = AN.GlobalVars.students.findWhere({
                selected: true
            });      
            $('body').append(this.render().el);
            return this;   		   
		},		
		displayLineChart: function(){
			$('.media-router').children().removeClass('active');
			$('#an-piechart').addClass('active');
            var student = AN.GlobalVars.students.findWhere({
                selected: true
            });			
			$.get(ajaxurl, { 
						action: 'get_line_chart',
						uid : student.get('id'),
						gbid : student.get('gbid')
					},
					function(data){	
						data.length ==1 ? $('.media-frame-content').html('<div style="padding: 10px;"> There is no content to display </div>') : drawLineChart(data);							
					}, 
					'json');    	
			return this;					
		},	
        render: function() {
            var self = this;
            var student = AN.GlobalVars.students.findWhere({
                selected: true
            });
            var template = _.template($('#stats-student-template').html(), {
                    student: student
            });
            self.$el.html(template);             
            this.displayLineChart();                                            
            this.$el.append('<div class="media-modal-backdrop"></div>');           
            return this;
        },
        editCancel: function() {
            this.remove();            
            return false;
        }
    });    
	
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
                        AN.GlobalVars.courses.add(course);
                    });
                }
            });
            this.listenTo(AN.GlobalVars.courses, 'add', this.addCourse);
            return this;
        },
        showGradebook: function() {
            var x = AN.GlobalVars.courses.findWhere({selected: true});
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
            var x = AN.GlobalVars.courses.findWhere({selected: true});
            if(x){
              $('#edit-course, #delete-course').attr('disabled',false);
            }else{
              $('#edit-course, #delete-course').attr('disabled', true); 
            }         
        },    
        editCoursePre: function(){
            var x = AN.GlobalVars.courses.findWhere({selected: true});
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
            var view = new AN.Views.CourseView({
                model: course
            });
            $('#courses').append(view.render().el);
        },
        deleteCourse: function() {
            var todel = AN.GlobalVars.courses.findWhere({
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
                AN.GlobalVars.courses.remove(todel.get('id'));
                self.toggleEditDelete();
            }, 'json');
        }
    });
    AN.GlobalVars.app = new AN.Views.App();
})(jQuery);