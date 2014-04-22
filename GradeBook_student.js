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
      
    AN.Models.Cell = AN.Models.Base.extend({
        defaults: {
            uid: null,
            // user id
            gbid: null,
            order: null,
            amid: null,
            // assignment id
            assign_points_earned: 0,
            selected: false
        }
    });
    AN.Collections.Cells = AN.Collections.Base.extend({
        model: AN.Models.Cell
    });
    var cells = new AN.Collections.Cells([]);
    AN.Views.CellView = AN.Views.Base.extend({
        tagName: 'td',
        initialize: function() {
            this.listenTo(assignments, 'change:selected', this.selectCell);
            this.listenTo(this.model, 'change:selected', this.selectCellCSS);
        },
        render: function() {
            this.$el.html('<div class="view">' + this.model.get('assign_points_earned') + '</div>');
            return this;
        },
        close: function() {
            this.remove();
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
            this.listenTo(this.model, 'change:selected', this.selectAssignmentCSS);
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
            this.listenTo(this.model, 'change:selected', this.selectStudentCSS);          
            this.listenTo(courses.findWhere({
                selected: true
            }), 'change:selected', function() {
                this.remove()
            });
            
        },
        render: function() {
            this.$el.html('<td class="student">Grades: </td>');
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
    var courses = new AN.Collections.Courses([]);    
    AN.Views.CourseView = AN.Views.Base.extend({
        tagName: 'tr',
        events: {
            'click .course': 'selectCourse'
        },
        initialize: function() {
            this.listenTo(this.model, 'change:selected', this.selectCourseCSS);
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
            $.when( 
            $.ajax({
                url: ajaxurl,
                data: {
                    action: 'get_student',
                    gbid: this.model.id
                },
                contentType: 'json',
                dataType: 'json'
            }),           
        	$.ajax({
                url: ajaxurl,
                data: {
                    action: 'get_student_assignments',
                    gbid: this.model.id
                },
                contentType: 'json',
                dataType: 'json'
            }), $.ajax({
                url: ajaxurl,
                data: {
                    action: 'get_student_assignment',
                    gbid: this.model.id
                },
                contentType: 'json',
                dataType: 'json'
            }),
			$.ajax({
                url: ajaxurl,
                data: {
                    action: 'get_student_gradebook',
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
            });
            this.listenTo(this.model, 'change:selected', this.close);
            return this;
        },
        render: function() {
            var template = _.template($('#student-gradebook-interface-template').html(), {});
            this.$el.html(template);
            return this;
        },
        close: function() {
            !this.model.get('selected') && this.remove();
        }
    });
    AN.Views.App = AN.Views.Base.extend({
        el: '#an-gradebooks',
        events: {
            'click .course': 'showGradebook'
        },
        initialize: function() {        
            template = _.template($('#student-courses-interface-template').html(), {});
            this.$el.html(template);
            $.ajax({
                url: ajaxurl,
                data: {
                    action: 'get_student_courses'
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
                var gradebook = new AN.Views.Gradebook({
                    model: x
                });
                $('#an-gradebooks').append(gradebook.render().el);
            }
            return this;
        },
        addCourse: function(course) {
            var view = new AN.Views.CourseView({
                model: course
            });
            $('#courses').append(view.render().el);
        }
    });
    var app = new AN.Views.App();
})(jQuery);