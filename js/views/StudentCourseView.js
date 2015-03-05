(function($,my){
	AN.Views.StudentCourseView = AN.Views.Base.extend({
        tagName: 'tr',
        events: {
            'click .course': 'selectCourse'       
        },
        initialize: function() {
            this.listenTo(this.model, 'change:selected', this.selectCourseCSS);
        },
        close: function() {
        	this.remove();
        },            
        render: function() {
            var template = _.template($('#student-course-view-template').html(), {
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
    