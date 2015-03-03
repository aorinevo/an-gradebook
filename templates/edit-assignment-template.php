<script id="edit-assignment-template" type="text/template">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="myModalLabel"><%= assignment ? 'Edit ' : 'Create ' %>Assignment</h4>
			</div>
			<div class="modal-body">
    				<form id="edit-assignment-form">      
				        <input type="hidden" name="id" value="<%= assignment ? assignment.get('id') : '' %>"/>  
				        <label>Title:</label>
				        <input type="text" name="assign_name" value="<%= assignment ? assignment.get('assign_name') : '' %>"/>
				        <label>Date Assigned:</label>
				        <input type="text" name="assign_date" id="assign-date-datepicker"  />        				    
				        <label>Date Due:</label>
				        <input type="text" name="assign_due" id="assign-due-datepicker" value="<%= assignment ? assignment.get('assign_due') : '' %>"/>
				        <label>Assignment Category:</label>
				        <input type="text" name="assign_category" value="<%= assignment ? assignment.get('assign_category') : '' %>"/>		        
				        <%= assignment ? 'Update assignment ' + assignment.get('id') + ' from course ' + gradebook.get('id')  : 'Add to course ' + gradebook.get('id') %>?        
				        <input type="hidden" name="gbid" value="<%= gradebook.get('id')%>"/>
    				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				<button type="button" id="edit-assignment-save" class="btn btn-primary">Save</button>
			</div>
		</div>
	</div>
</script>     