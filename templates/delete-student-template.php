<script id="delete-student-template" type="text/template">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="myModalLabel">Delete Student</h4>
			</div>
			<div class="modal-body">
					<form id="delete-student-form">      
         				<input type="hidden" name="action" value="delete_student"/>
				        <input type="hidden" name="id" value="<%= student ? student.get('id') : '' %>"/> 
				        Delete <%= student.get('firstname')%> <%= student.get('lastname')%> with student id <%= student.get('id')%> from:  
				        <br/>      
						<select name="delete_options">
							<option value="gradebook">this gradebook only.</option>
							<option value="all_gradebooks">all gradebooks.</option>
							<option value="database">the wordpress database.</option>
						</select>
						<br/>
						Removing a student from the wordpress database will also remove that student from all gradebooks.
				        <p/>
				        <input type="hidden" name="gbid" value="<%= gradebook.get('id') %>"/>
    				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				<button type="button" id="delete-student-delete" data-dismiss="modal" class="btn btn-danger">Delete</button>
			</div>
		</div>
	</div>
</script>      