<script id="course-view-template" type="text/template">
	<td>
		<div class="btn-group">
			<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
				<span class="caret"></span>
			</button>
			<ul class="dropdown-menu" role="menu">
				<li class='course-submenu-edit'><a href='#'>Edit</a></li>
				<li class='course-submenu-export2csv'><a href='#'>Export to CSV</a></li>								
				<li class='course-submenu-delete'><a href='#'><span class="text-danger">Delete</span></a></li>
			</ul>
		</div>
	</td>	
	<td> <%= course.get("id") %> </td>
	<td class="course">	<%= course.get("name") %> </td>
	<td><%= course.get("school") %></td>
	<td><%= course.get("semester") %></td>
	<td><%= course.get("year") %></td>	
</script>      
    
    