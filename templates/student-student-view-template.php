<script id="student-student-view-template" type="text/template">
	<th class="student-tools">
		<div class="btn-group">
			<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
				<span class="caret"></span>
			</button>
			<ul class="dropdown-menu" role="menu">
				<li class='student-submenu-stats'><a href='#'>Statistics</a></li>
			</ul>
		</div>
	</th> 
	<td class="student">	
				<%= student.get("firstname") %> 				
	</td>
	<td><%= student.get("lastname") %></td>
	<td><%= student.get("user_login") %></td>   	
</script>      
    
    