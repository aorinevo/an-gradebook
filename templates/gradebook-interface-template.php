<script id="gradebook-interface-template" type="text/template">
    <hr/>    
    <ul id="gradebook-interface-buttons-container">
    	<li><button type="button" id="add-student" class="btn btn-default">Add Student</button></li>
    	<li><button type="button" id="add-assignment" class="btn btn-default">Add Assignment</button></li>
    </ul>   

    <div class="tablenav top">
		<div class="form-inline">
			<select name="filter_option" id="filter-assignments-select" class="form-control">
        		<option value="-1">Show all</option>						
        		<% 
 					for (var i in assign_categories){
 						print('<option value='+assign_categories[i]+'>'+assign_categories[i]+'</option>');
 					}
        		%>    			      
        	</select>
			<button type="button" id="filter-assignments" class="btn btn-default">Filter</button> 
		</div>	
    </div> 
    
    <hr/>
    <div>
    <table id="an-gradebook-container" class="table table-bordered table-striped">  
    <thead id="students-header">
      <tr>
        <th></th><th><div><span>First Name</span></div></th><th>Last Name</th><th>Login</th>
      </tr>
    </thead>
    <tbody id="students"></tbody>
    </table>
    </div>
</script>