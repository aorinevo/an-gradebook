define(['jquery','backbone','underscore', 'views/EditCourseView'],
function($,Backbone,_, EditCourseView){
	var CourseView = Backbone.View.extend({
        tagName: 'tr',
        events: {
            'click .course': 'selectCourse',
            'click li.course-submenu-delete' : 'deleteCourse',
            'click li.course-submenu-export2csv' : 'exportToCSV',            
            'click li.course-submenu-edit' : 'editCourse'           
        },
        initialize: function() {
        	this.courses = this.collection;
			this.listenTo(this.model, 'change:name change:school change:semester change:year', this.render);
            this.listenTo(this.model, 'change:selected', this.selectCourseCSS);
            this.listenTo(this.model, 'remove', this.close);
        },
        close: function() {
        	this.remove();
        },
        exportToCSV: function(ev){
        	ev.preventDefault();
        	this.model.export2csv();
        },
        deleteCourse: function(ev) {
        	ev.preventDefault();
        	this.model.destroy(); 
        },
        editCourse: function() {
            var view = new EditCourseView({model: this.model});
            return false;
        },             
        render: function() {
            var template = _.template($('#course-view-template').html());
            var compiled = template({course : this.model});
            this.$el.html(compiled);            
            return this;
        },
        selectCourse: function(ev) {
            if (this.model.get('selected')) {
                this.model.set({
                    selected: false
                });
            } else {
            	var y = this.courses.findWhere({'selected': true});
            	y && y.set({'selected': false});
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
    return CourseView;
});
    