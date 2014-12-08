    <script id="student-view-template" type="text/template">
    <!--
    	<th scope="row" class="check-column">
				<label class="screen-reader-text" for="cb-select-<%= student.get('id') %>">Select Hello world!</label>
				<input id="cb-select-<%= student.get('id') %>" type="checkbox" name="post[]" value="1">
				<div class="locked-indicator"></div>
		</th>
	-->
		<td class="student"><%= student.get("firstname") %> 
			<div class="row-actions">
				<span class=""><a class="edit-student" href="">Edit</a>  |  </span>
				<span class="student-statistics"><a class="student-statistics" href="">Statistics</a>  |  </span>				
				<span class="delete"><a class="delete-student" href="">Delete</a></span>
			</div>
		</td>
		<td><%= student.get("lastname") %></td>
		<td><%= student.get("id") %></td>
    </script>      
    
    