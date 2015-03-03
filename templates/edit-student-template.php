<script id="edit-student-template" type="text/template">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="myModalLabel"><%= student ? 'Edit ' : 'Create ' %>Student</h4>
			</div>
			<div class="modal-body">
    				<form id="edit-student-form">      
				        <input type="hidden" name="id" value="<%= student ? student.get('id') : '' %>"/>         
				        <label>First Name:</label>
				        <input type="text" name="firstname" value="<%= student ? student.get('firstname') : '' %>"/>
				        <label>Last Name:</label>
				        <input type="text" name="lastname" value="<%= student ? student.get('lastname') : '' %>"/>
				        <label>User Login:<%= student ? '' : ' (if student exists in the data base, use the students user_login to add. Otherwise a new record will be created for this student):'%></label>
				        <%= student ? student.get('user_login') : '<div class="ui-front"><input type="text" name="id-exists" id="user_login"/></div>' %>
				        <p/>
				        <%= student ? 'Update user ' + student.get('user_login') + ' from course ' + gradebook.get('id')  : 'Add to course ' + gradebook.get('id') %>?
				        <input type="hidden" name="gbid" value="<%= gradebook.get('id') %>"/>
				        <p/>			        
    				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				<button type="button" id="edit-student-save" data-dismiss="modal" class="btn btn-primary">Save</button>
			</div>
		</div>
	</div>
</script>   