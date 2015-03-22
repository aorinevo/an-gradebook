define(['jquery','backbone','underscore','views/StatisticsView','views/EditStudentView','views/DeleteStudentView','views/CellView'],
function($,Backbone,_,StatisticsView,EditStudentView,DeleteStudentView, CellView){
	var StudentView = Backbone.View.extend({
        tagName: 'tr',
        events: {
           // 'click .student': 'selectStudent',
           // 'click input[id^=cb-select-]': 'selectStudent',
            'click a.edit-student': 'editStudent',
            'click a.delete-student': 'deleteStudent',
            'click a.student-statistics': 'studentStatistics', 
            'click .dashicons-menu': 'toggleStudentMenu',
            'click li.student-submenu-delete' : 'deleteStudent',
            'click li.student-submenu-edit' : 'editStudent',         
            'click li.student-submenu-stats' : 'studentStatistics',                         
        },
        initialize: function(options) {
        	var self = this;
			this.options = options.options;
           	_(this).extend(this.options.gradebook_state);
            this.course = this.courses.findWhere({'selected': true});    
			this.listenTo(this.model, 'change:firstname change:lastname', this.render);      
           	this.listenTo(this.model, 'change:selected', this.selectAllStudents);			
            this.listenTo(self.students, 'add remove', this.close);
            this.listenTo(self.assignments, 'add remove change:sorted change:assign_order', this.close);            
            this.listenTo(self.courses, 'remove change:selected', this.close); 
            
        },    
        render: function() {
            var template = _.template($('#student-view-template').html()); 
            var compiled = template({student: this.model});
            this.$el.html(compiled);     
            var gbid = parseInt(this.courses.findWhere({selected: true}).get('id')); //anq: why is this not already an integer??
            var x = this.cells.where({
            	uid: parseInt(this.model.get('id')),		//anq: why is this not already an integer??
            	gbid: gbid
            	});
           	x = _.sortBy(x,function(model){ return model.get('assign_order');});        	
            var self = this;
            _.each(x, function(cell) {
                var view = new CellView({model: cell, options: self.options});
                self.$el.append(view.render().el);
            });
            return this;
        },
        toggleStudentMenu: function(){
        	var _student_menu = $('#row-student-id-'+this.model.get('id'));
        	if( _student_menu.css('display') === 'none'){
        		var view = this;
				_student_menu.toggle(1, function(){
        			var self = this;				
					$(document).one('click',function(){
						$(self).hide();
						//view.model.set({hover:false}); 
					});		
				});
			}
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
            var view = new StatisticsView({model: this.model, options: this.options});          
        },
        editStudent: function(ev){        	
        	ev.preventDefault();    
            var view = new EditStudentView({model: this.model, course: this.course, options: this.options});             	
        },
        deleteStudent: function(ev){
        	ev.preventDefault();
        	var view = new DeleteStudentView({model: this.model, options: this.options});              	      	
        },        
        close: function() {
            this.remove();
        }
    });
	return StudentView;
});