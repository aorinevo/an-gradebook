    <script id="gradebook-interface-template" type="text/template">
    <hr/>
    <div id="gradebook-interface-buttons-container">
    <button type="button" id="add-student" class="wp-core-ui button">Add Student</button>
    <button type="button" id="edit-student" class="wp-core-ui button">Edit Student</button>  
    <button type="button" id="delete-student" class="wp-core-ui button">Delete Student</button>
    <button type="button" id="add-assignment" class="wp-core-ui button">Add Assignment</button>
    <button type="button" id="edit-assignment" class="wp-core-ui button">Edit Assignment</button>  
    <button type="button" id="stats-assignment" class="wp-core-ui button">Assignment Statistics</button>      
    <button type="button" id="stats-student" class="wp-core-ui button">Student Statistics</button>          
    <button type="button" id="delete-assignment" class="wp-core-ui button">Delete Assignment</button>
    </div>    
    <hr/>
    <table id="an-gradebook-container" class="wp-list-table widefat fixed pages">  
    <thead id="students-header">
      <tr>
        <th><div><span>First Name</span> <span class="sorting-indicator"></span> </div></th><th>Last Name</th><th>ID</th>
      </tr>
    </thead>
    <tbody id="students"></tbody>
    </table>
    </script>