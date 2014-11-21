<script id="filter-assignments-template" type="text/template">
    <div id="filter-assignments-form-container" class="media-modal wp-core-ui"> 
    <a class="media-modal-close" title="Close"><span class="media-modal-icon"></span></a>
    	<div class="media-modal-content">
    	    <div class="media-frame wp-core-ui">
    	    	<div class="media-frame-title">
    				<h1>Filter Assignments</h1>
    			</div>    
				<div class="media-frame-menu">
					<div class="media-menu">
						<a href="#" class="media-menu-item">Filter Assignments</a>
						<div class="separator"></div>
					</div>
				</div>       			
    	    	<div class="media-frame-content">
    				<form id="filter-assignments-form">      
						<select name="filter_option">
        				  <option value="-1">Show all</option>						
        				<% 
 						for (var i in assign_categories){
 						   print('<option value='+assign_categories[i]+'>'+assign_categories[i]+'</option>');
 						}
        				%>    			      
        				</select>
    				</form>
    			</div>    			
        		<div class="media-frame-toolbar">
    				<div class="media-toolbar">         
     					<div class="media-toolbar-secondary"></div>
     					<div class="media-toolbar-primary">
     						<button id="filter-assignments-filter" class="button media-button button-primary button-large">Filter</button>
     					</div>
       				</div>
       			</div> 
       		</div>
    	</div>  
    </div> 
    </script> 
