<script id="assignment-view-template" type="text/template">
	<div class="column-frame">
		<div class="column-title"> <%= assignment.get('assign_name') %> </div>
		<div class="column-sort an-sorting-indicator dashicons dashicons-menu"></div>			
	</div>
	<div id="column-assign-id-<%= assignment.get('id')%>">
		<ul>
			<li class='assign-submenu-sort'>Sort</li>			
			<%
			if (min.get('assign_order') != max.get('assign_order')){
				if( assignment.get('assign_order') === min.get('assign_order') ) { 
					print("<li class='assign-submenu-right'>Shift Right</li>");				
				} else if ( assignment.get('assign_order') === max.get('assign_order') ) { 
					print("<li class='assign-submenu-left'>Shift Left</li>");		
				} else { 
					print("<li class='assign-submenu-left'>Shift Left</li>");		
					print("<li class='assign-submenu-right'>Shift Right</li>");	
				}
			}
			%>
			<li class='assign-submenu-stats'>Statistics</li>				
			<li class='assign-submenu-edit'>Edit</li>
			<li class='assign-submenu-delete'>Delete</li>
		</ul>
	</div>		
</script>      
    
    