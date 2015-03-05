<script id="student-view-template" type="text/template">
	<th class="student-tools">
		<div class="btn-group">
			<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
				<span class="caret"></span>
			</button>
			<ul class="dropdown-menu" role="menu">
				<li class='student-submenu-edit'><a href='#'>Edit</a></li>
				<li class='student-submenu-stats'><a href='#'>Statistics</a></li>
				<li class='student-submenu-delete'><a href='#'><span class="text-danger">Delete</span></a></li>
			</ul>
		</div>
	</th>
	<td class="student">	
		<div class="column-frame">	
			<%= student.get("firstname") %> 				
		</div>				
	</td>
	<td><%= student.get("lastname") %></td>
	<td><%= student.get("user_login") %></td>
</script>      
    
    