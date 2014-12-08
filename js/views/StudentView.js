(function($,AN){
	AN.Views.StudentView = AN.Views.Base.extend({
        tagName: 'tr',
        events: {
            'click .student': 'selectStudent',
            'click input[id^=cb-select-]': 'selectStudent',
            'click a.edit-student': 'editStudent',
            'click a.delete-student': 'deleteStudent',
            'click a.student-statistics': 'studentStatistics',            
        },
        initialize: function() {
			this.listenTo(this.model, 'change:firstname change:lastname', this.render);            
           	//this.listenTo(this.model, 'change:selected', this.selectAllStudents);			
            this.listenTo(AN.GlobalVars.students, 'add remove', this.close);
            this.listenTo(AN.GlobalVars.assignments, 'add remove change:sorted change:assign_order', this.close);            
            this.listenTo(AN.GlobalVars.courses, 'remove change:selected', this.close); 
            
        },    
        render: function() {
            var template = _.template($('#student-view-template').html(), {
                    student: this.model
                }); 
            this.$el.html(template);
            var gbid = parseInt(AN.GlobalVars.courses.findWhere({selected: true}).get('id')); //anq: why is this not already an integer??
            var x = AN.GlobalVars.cells.where({
            	uid: parseInt(this.model.get('id')),		//anq: why is this not already an integer??
            	gbid: gbid
            	});
           	x = _.sortBy(x,function(model){ return model.get('assign_order');});        	
            var self = this;
            _.each(x, function(cell) {
                var view = new AN.Views.CellView({
                    model: cell
                });
                self.$el.append(view.render().el);
            });
            return this;
        },
        selectAllStudents: function(){
        	var _selected = $('#cb-select-all-1').is(':checked');        
        	if(_selected){
				$('#cb-select-'+this.model.get('id')).prop('checked',true);
			} else {
				$('#cb-select-'+this.model.get('id')).prop('checked',false);
			}
        },
        selectStudent: function(ev) {
        	var _selected = $('#cb-select-'+this.model.get('id')).is(':checked');
        	this.model.set({selected: _selected})      	
            var x = AN.GlobalVars.assignments.findWhere({
                selected: true
            });
        	if(_selected){
				$('#cb-select-'+this.model.get('id')).prop('checked',true);
			} else {
				$('#cb-select-'+this.model.get('id')).prop('checked',false);
			}            
            x && x.set({
                selected: false
            });
        },
        studentStatistics: function(ev){
        	ev.preventDefault();    
            var view = new AN.Views.StudentStatisticsView({ model: this.model});          
        },
        editStudent: function(ev){
        	ev.preventDefault();    
            var view = new AN.Views.EditStudentView({ model: this.model});             	
        },
        deleteStudent: function(ev){
        	ev.preventDefault();
        	var view = new AN.Views.DeleteStudentView({model: this.model});              	      	
        },        
        close: function() {
            this.remove();
        }
    });
})(jQuery, AN || {});