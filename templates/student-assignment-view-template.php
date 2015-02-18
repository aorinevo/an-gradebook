<script id="student-assignment-view-template" type="text/template">
	<div class="column-frame">
		<div class="column-title"> <%= assignment.get('assign_name') %> </div>
		<div class="column-sort an-sorting-indicator dashicons dashicons-menu"></div>			
	</div>
	<div id="column-assign-id-<%= assignment.get('id')%>">
		<ul>		
			<li class='assign-submenu-stats'>Statistics</li>				
		</ul>
	</div>		
</script>      
    
    