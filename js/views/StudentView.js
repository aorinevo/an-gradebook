AN.Views.StudentView = (function($,my){
	my = AN.Views.Base.extend({
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
    return my;
})(jQuery, AN.Views.StudentView || {});