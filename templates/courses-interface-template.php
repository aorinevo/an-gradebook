<script id="courses-interface-template" type="text/template">
	<div id = "an-gradebook" class="wrap">
		<h2>GradeBooks
			<% if(wp_role === 'administrator'){ %>
			 <button id="add-course" class="btn btn-default">Add Course</button>  
			<%}%>
		</h2>   
    <hr/>       
    <table id="an-courses-container" class="table table-bordered table-striped">  
		<thead>
			<tr>
			<% if(wp_role === 'administrator'){ %>			
				<th></th> <%}%>
			<th>ID</th><th>Course</th><th>School</th><th>Semester</th><th>Year</th>
			</tr>
		</thead>
		<tbody id="courses">
		</tbody>
	</table>
	</div>
</script>  