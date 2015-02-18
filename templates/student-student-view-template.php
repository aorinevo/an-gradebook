    <script id="student-view-template" type="text/template">
    	<th>
    		<div class="dashicons dashicons-menu"></div>
			<div id="row-student-id-<%= student.get('id')%>">
				<ul>		
					<li class='student-submenu-stats'>Statistics</li>
				</ul>
			</div>	    		
    	</th>
		<th class="student">	
			<div class="column-frame">		
				<%= student.get("firstname") %> 				
			</div>			
		</th>
		<td><%= student.get("lastname") %></td>
		<td><%= student.get("user_login") %></td>
    </script>      
    
    