define(['jquery','backbone','underscore'],
function($,Backbone,_){
	var StudentCourseView = Backbone.View.extend({
        tagName: 'tr',
        events: {
            'click .course': 'selectCourse',
            'click li.course-submenu-delete' : 'deleteCourse',
            'click li.course-submenu-export2csv' : 'exportToCSV',            
            'click li.course-submenu-edit' : 'editCourse'           
        },
        initialize: function(options) {
			this.options = options.options;
           	_(this).extend(this.options.gradebook_state);         
            this.course = this.model;           	
			this.listenTo(this.course, 'change:name change:school change:semester change:year', this.render);
            this.listenTo(this.course, 'change:selected', this.selectCourseCSS);
            this.listenTo(this.course, 'remove', this.close);
        },
        close: function() {
        	this.remove();
        },             
        render: function() {
            var template = _.template($('#student-course-view-template').html());
            var compiled = template({course : this.course});
            this.$el.html(compiled);            
            return this;
        },
        selectCourse: function(ev) {
           var x = this.students.findWhere({
                selected: true
            });
            x && x.set({
                selected: false
            });
            var y = this.assignments.findWhere({
                selected: true
            });
            y && y.set({
                selected: false
            });
            if (this.course.get('selected')) {
                this.course.set({
                    selected: false
                });
            } else {
                var x = this.courses.findWhere({
                    selected: true
                });
                x && x.set({
                    selected: false
                });
                this.course.set({
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
    return StudentCourseView;
});
    