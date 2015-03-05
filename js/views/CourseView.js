(function($,my){
	AN.Views.CourseView = AN.Views.Base.extend({
        tagName: 'tr',
        events: {
            'click .course': 'selectCourse',
            'click li.course-submenu-delete' : 'deleteCourse',
            'click li.course-submenu-export2csv' : 'exportToCSV',            
            'click li.course-submenu-edit' : 'editCourse'           
        },
        initialize: function() {
			this.listenTo(this.model, 'change:name change:school change:semester change:year', this.render);
            this.listenTo(this.model, 'change:selected', this.selectCourseCSS);
            this.listenTo(this.model, 'remove', this.close);
        },
        close: function() {
        	this.remove();
        },
        exportToCSV: function(ev){
        	console.log('hello');
        	ev.preventDefault();
        	console.log(this.model);
        	this.model.export2csv();
        },
        deleteCourse: function() {
        	this.model.destroy(); 
        },
        editCourse: function() {
            var view = new AN.Views.EditCourseView({model: this.model});
            return false;
        },             
        render: function() {
            var template = _.template($('#course-view-template').html(), {
                    course: this.model
                }); 
            this.$el.html(template);            
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
})(jQuery, AN || {});    
    