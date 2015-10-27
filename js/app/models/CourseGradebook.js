define(['backbone','models/AssignmentList','models/UserList','models/CellList'],
function(Backbone,AssignmentList,UserList,CellList){ 
	var CourseGradebook = Backbone.Model.extend({
  	url: function(){
  	     	return ajaxurl + '?action=gradebook&gbid=' + parseInt(this.get('gbid'));
  		},
  	sort_key: 'lastname',
  	parse: function(response){
  		this.assignments = new AssignmentList(response.assignments);
  		this.cells = new CellList(response.cells);
  		this.students = new UserList(response.students);
  		this.sort_column = this.students;
  		this.role = response.role;
  		return response;
  	}
	});
	return CourseGradebook;
});
