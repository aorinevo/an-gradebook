<?php
ob_start();
?>
    <script id="student-courses-interface-template" type="text/template">    
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