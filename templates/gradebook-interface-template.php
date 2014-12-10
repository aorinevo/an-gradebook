    <script id="gradebook-interface-template" type="text/template">
    <hr/>    
    <ul id="gradebook-interface-buttons-container">
    <li><button type="button" id="add-student" class="wp-core-ui button">Add Student</button></li>
    <li><button type="button" id="add-assignment" class="wp-core-ui button">Add Assignment</button></li>
    </ul>   

    <div class="tablenav top">
    <!--    
		<div class="alignleft actions bulkactions">
			<label for="bulk-action-selector-top" class="screen-reader-text">Select bulk action</label>
			<select name="action" id="bulk-action-selector-top">
				<option value="-1" selected="selected">Bulk Actions</option>
				<option value="trash">Delete Students</option>
			</select>
			<input type="submit" name="" id="doaction" class="button action" value="Apply">
		</div>   
	--> 
		<div class="alignleft actions">
			<select name="filter_option" id="filter-assignments-select">
        		<option value="-1">Show all</option>						
        		<% 
 					for (var i in assign_categories){
 						print('<option value='+assign_categories[i]+'>'+assign_categories[i]+'</option>');
 					}
        		%>    			      
        	</select>
			<button type="button" id="filter-assignments" class="wp-core-ui button">Filter</button>   
		</div> 				
    </div>
    <hr/>
    <table id="an-gradebook-container" class="wp-list-table widefat fixed pages">  
    <thead id="students-header">
      <tr>
      <!--
      	<th scope="col" id="cb" class="manage-column column-cb check-column" style="">
      		<label class="screen-reader-text" for="cb-select-all-1">Select All</label>
      		<input id="cb-select-all-1" type="checkbox">
      	</th>
      -->
        <th><div><span>First Name</span> <span class="sorting-indicator"></span> </div></th><th>Last Name</th><th>Login</th>
      </tr>
    </thead>
    <tbody id="students"></tbody>
    </table>
    </script>