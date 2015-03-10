<script id="student-assignment-view-template" type="text/template">
	<div class="btn-group">
  		<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
    		<%= assignment.get('assign_name') %> <span class="caret"></span>
  		</button>
  		<ul class="dropdown-menu" role="menu">
			<li class='assign-submenu-stats'><a href='#'>Statistics</a></li>				
			<li class='assign-submenu-details'><a href='#'>Details</a></li>			
  		</ul>
  	</div>		
</script>      
    
    