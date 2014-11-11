    <script id="delete-student-template" type="text/template">
    <div id="delete-student-form-container" class="media-modal wp-core-ui"> 
    <a class="media-modal-close" title="Close"><span class="media-modal-icon"></span></a>
    	<div class="media-modal-content">
    	    <div class="media-frame wp-core-ui">
				<div class="media-frame-menu">
					<div class="media-menu">
						<a href="#" class="media-menu-item">Delete Student</a>
						<div class="separator"></div>
					</div>
				</div>    	    
    	    	<div class="media-frame-title">
    				<h1>Delete Student</h1>
    			</div>    
    	    	<div class="media-frame-content">
    				<form id="delete-student-form">      
         				<input type="hidden" name="action" value="delete_student"/>
				        <input type="hidden" name="id" value="<%= student ? student.get('id') : '' %>"/> 
				        Delete <%= student.get('firstname')%> <%= student.get('lastname')%> with student id <%= student.get('id')%> from:  
				        <br/>      
						<select name="delete_options">
							<option value="gradebook">this gradebook only.</option>
							<option value="all_gradebooks">all gradebooks.</option>
							<option value="database">the wordpress database.</option>
						</select>
						<br/>
						Removing a student from the wordpress database will also remove that student from all gradebooks.
				        <p/>
				        <input type="hidden" name="gbid" value="<%= gradebook.get('id') %>"/>
    				</form>
    			</div>			
        		<div class="media-frame-toolbar">
    				<div class="media-toolbar">         
     					<div class="media-toolbar-secondary"></div>
     					<div class="media-toolbar-primary">
     						<button id="delete-student-delete" class="button media-button button-primary button-large">Delete</button>
     					</div>
       				</div>
       			</div> 
       		</div>
    	</div>  
    </div> 
    </script>      