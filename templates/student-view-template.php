    <script id="student-view-template" type="text/template">
    <!--
    	<th scope="row" class="check-column">
				<label class="screen-reader-text" for="cb-select-<%= student.get('id') %>">Select Hello world!</label>
				<input id="cb-select-<%= student.get('id') %>" type="checkbox" name="post[]" value="1">
				<div class="locked-indicator"></div>
		</th>
	-->
		<th class="student">	
			<div class="column-frame">	
			<div class="dashicons dashicons-menu"></div>	
				<%= student.get("firstname") %> 				
			</div>
			<div id="row-student-id-<%= student.get('id')%>">
				<ul>		
					<li class='student-submenu-edit'>Edit</li>
					<li class='student-submenu-stats'>Statistics</li>
					<li class='student-submenu-delete'>Delete</li>
				</ul>
			</div>				
		</th>
		<td><%= student.get("lastname") %></td>
		<td><%= student.get("user_login") %></td>
    </script>      
    
    