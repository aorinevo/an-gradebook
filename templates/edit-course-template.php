<script id="edit-course-template" type="text/template">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="myModalLabel"><%= course ? 'Edit ' : 'Create ' %>Course</h4>
			</div>
			<div class="modal-body">
				<form id="edit-course-form">      
					<input type="hidden" name="id" value="<%= course ? course.get('id') : '' %>"/>        
					<label>Course Name:</label>
					<input type="text" name="name" value="<%= course ? course.get('name') : '' %>"/>
					<label>School:</label>
					<input type="text" name="school" value="<%= course ? course.get('school') : '' %>"/>
					<label>Semester:</label>
					<input type="text" name="semester" value="<%= course ? course.get('semester') : '' %>"/>
					<label>Year:</label>
					<input type="text" name="year" value="<%= course ? course.get('year') : '' %>"/>
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				<button type="button" id="edit-course-save" data-dismiss="modal" class="btn btn-primary">Save</button>
			</div>
		</div>
	</div>
</script> 
