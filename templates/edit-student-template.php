<?php
ob_start();
?>
    <script id="edit-student-template" type="text/template">
    <div id="edit-student-form-container" class="media-modal wp-core-ui"> 
    <a class="media-modal-close" title="Close"><span class="media-modal-icon"></span></a>
    	<div class="media-modal-content">
    	    <div class="media-frame wp-core-ui">
				<div class="media-frame-menu">
					<div class="media-menu">
						<a href="#" class="media-menu-item"><%= student ? 'Edit ' : 'Create ' %>Student</a>
						<div class="separator"></div>
					</div>
				</div>    	    
    	    	<div class="media-frame-title">
    				<h1><%= student ? 'Edit ' : 'Create ' %>Student</h1>
    			</div>    
    	    	<div class="media-frame-content">
    				<form id="edit-student-form">      
         				<input type="hidden" name="action" value="<%= student ? 'update_student' : 'add_student' %>"/>
				        <input type="hidden" name="id" value="<%= student ? student.get('id') : '' %>"/>         
				        <label>First Name:</label>
				        <input type="text" name="firstname" value="<%= student ? student.get('firstname') : '' %> "/>
				        <label>Last Name:</label>
				        <input type="text" name="lastname" value="<%= student ? student.get('lastname') : '' %> "/>
				        <label>ID<%= student ? ':' : ' (if student exists in the data base, use the students id to add. Otherwise a new record will be created for this student):'%></label>
				        <%= student ? student.get('id') : '<input type="text" name="id-exists"/>' %>
				        <p/>
				        <%= student ? 'Update user ' + student.get('id') + ' from course ' + gradebook.get('id')  : 'Add to course ' + gradebook.get('id') %>?
				        <input type="hidden" name="gbid" value="<%= gradebook.get('id') %>"/>
    				</form>
    			</div>			
        		<div class="media-frame-toolbar">
    				<div class="media-toolbar">         
     					<div class="media-toolbar-secondary"></div>
     					<div class="media-toolbar-primary">
     						<button id="edit-student-save" class="button media-button button-primary button-large">Save</button>
     					</div>
       				</div>
       			</div> 
       		</div>
    	</div>  
    </div> 
    </script>   
<?php
$mytemplate = ob_get_contents();
ob_get_clean();
echo $mytemplate;
?>