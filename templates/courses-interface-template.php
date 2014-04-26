<?php
ob_start();
?>
    <script id="courses-interface-template" type="text/template">
    <div id="courses-interface-buttons-container">
    <button id="add-course" class="wp-core-ui button">Add Course</button>        
    <button id="edit-course" class="wp-core-ui button">Edit Course</button>    
    <button id="delete-course" class="wp-core-ui button">Delete Course</button>         
    </div> 
    <hr/>       
    <table id="an-courses-container" class="wp-list-table widefat fixed pages">  
       <thead>
        <tr>
            <th>ID</th><th>Course</th><th>School</th><th>Semester</th><th>Year</th>
        </tr>
       </thead>
       <tbody id="courses">
       </tbody>
      </table>
    </script>    
<?php
$mytemplate = ob_get_contents();
ob_get_clean();
echo $mytemplate;
?>