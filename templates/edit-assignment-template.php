    <script id="edit-assignment-template" type="text/template">
    <div id="edit-assignment-form-container" class="media-modal wp-core-ui"> 
    <a class="media-modal-close" title="Close"><span class="media-modal-icon"></span></a>
    	<div class="media-modal-content">
    	    <div class="media-frame wp-core-ui">
				<div class="media-frame-menu">
					<div class="media-menu">
						<a href="#" class="media-menu-item"><%= assignment ? 'Edit ' : 'Create ' %>Assignment</a>
						<div class="separator"></div>
					</div>
				</div>
    	    	<div class="media-frame-title">
    				<h1><%= assignment ? 'Edit ' : 'Create ' %>Assignment</h1>
    			</div>    
    	    	<div class="media-frame-content">
    				<form id="edit-assignment-form">      
				        <input type="hidden" name="id" value="<%= assignment ? assignment.get('id') : '' %>"/>  
				        <label>Title:</label>
				        <input type="text" name="assign_name" value="<%= assignment ? assignment.get('assign_name') : '' %>"/>
				        <label>Date Assigned:</label>
				        <input type="text" name="assign_date" id="assign-date-datepicker" />        
				        <label>Date Due:</label>
				        <input type="text" name="assign_due" id="assign-due-datepicker" />
				        <label>Assignment Category:</label>
				        <input type="text" name="assign_category" value="<%= assignment ? assignment.get('assign_category') : '' %>"/>		        
				        <%= assignment ? 'Update assignment ' + assignment.get('id') + ' from course ' + gradebook.get('id')  : 'Add to course ' + gradebook.get('id') %>?        
				        <input type="hidden" name="gbid" value="<%= gradebook.get('id')%>"/>
    				</form>
    			</div>    			
        		<div class="media-frame-toolbar">
    				<div class="media-toolbar">         
     					<div class="media-toolbar-secondary"></div>
     					<div class="media-toolbar-primary">
     						<button id="edit-assignment-save" class="button media-button button-primary button-large">Save</button>
     					</div>
       				</div>
       			</div> 
       		</div>
    	</div>  
    </div> 
    </script>     