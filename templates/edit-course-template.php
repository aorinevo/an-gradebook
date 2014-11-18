<script id="edit-course-template" type="text/template">
    <div id="edit-course-form-container" class="media-modal wp-core-ui"> 
    <a class="media-modal-close" title="Close"><span class="media-modal-icon"></span></a>
    	<div class="media-modal-content">
    	    <div class="media-frame wp-core-ui">
    	    	<div class="media-frame-title">
    				<h1><%= course ? 'Edit ' : 'Create ' %> Course</h1>
    			</div>    
				<div class="media-frame-menu">
					<div class="media-menu">
						<a href="#" class="media-menu-item"><%= course ? 'Edit ' : 'Create ' %>Course</a>
						<div class="separator"></div>
					</div>
				</div>       			
    	    	<div class="media-frame-content">
    				<form id="edit-course-form">      
        				<input type="hidden" name="id" value="<%= course ? course.get('id') : '' %>"/>        
        				<label>Course Name:</label>
        				<input type="text" name="name" value="<%= course ? course.get('name') : '' %>"/>
        				<label>School:</label>
        				<input type="text" name="school" value="<%= course ? course.get('school') : '' %>"/>
        				<label>Semester:</label>
        				<input type="text" name="semester" value="<%= course ? course.get('semester') : '' %>"/>
        				<label>Year:</label>
        				<input type="text" name="year" value="<%= course ? course.get('year') : '' %>"/>
    				</form>
    			</div>    			
        		<div class="media-frame-toolbar">
    				<div class="media-toolbar">         
     					<div class="media-toolbar-secondary"></div>
     					<div class="media-toolbar-primary">
     						<button id="edit-course-save" class="button media-button button-primary button-large">Save</button>
     					</div>
       				</div>
       			</div> 
       		</div>
    	</div>  
    </div> 
    </script> 
