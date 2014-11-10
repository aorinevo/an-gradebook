<?php
ob_start();
?>
    <script id="stats-assignment-template" type="text/template">
    <div id="stats-assignment-form-container" class="media-modal wp-core-ui"> 
    <a class="media-modal-close" title="Close"><span class="media-modal-icon"></span></a>
    	<div class="media-modal-content">
    	    <div class="media-frame wp-core-ui">
				<div class="media-frame-menu">
					<div class="media-menu">
						<a href="#" class="media-menu-item">Assignment Statistics</a>
						<div class="separator"></div>
					</div>
				</div>
				<div class="media-frame-router">
					<div class="media-router">
						<a href="#" class="media-menu-item active" id="an-piechart">Pie Chart</a>				
					</div>
				</div>
    	    	<div class="media-frame-title">
    				<h1>Assignment Statistics</h1>
    			</div>    
    	    	<div class="media-frame-content">
					<div id = "chart_div"></div>
    			</div>    			
        		<div class="media-frame-toolbar">
    				<div class="media-toolbar">         
     					<div class="media-toolbar-secondary"></div>
     					<div class="media-toolbar-primary">
							<button id="stats-assignment-close" class="button media-button button-primary button-large">Close</button>     					
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