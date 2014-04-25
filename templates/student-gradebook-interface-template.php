<?php
ob_start();
?>
    <script id="student-gradebook-interface-template" type="text/template">   
    <hr/>
    <table id="an-gradebook-container" class="wp-list-table widefat fixed pages">  
    <thead id="students-header">
      <tr>
        <th>First Name</th><th>Last Name</th><th>ID</th>
      </tr>
    </thead>
    <tbody id="students"></tbody>
    </table>
    </script>  
         
<?php
$mytemplate = ob_get_contents();
ob_get_clean();
echo $mytemplate;
?>