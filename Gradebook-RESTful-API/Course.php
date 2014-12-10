<?php
class gradebook_course_API{
	public function __construct(){
		add_action('wp_ajax_course', array($this, 'course'));											
	}
	
/*********************************
* Use the following template to extend api
*
*	public function name_of_api(){
*		global $wpdb;
*   	$wpdb->show_errors();  		
*		if (!gradebook_check_user_role('administrator')){	
*			echo json_encode(array("status" => "Not Allowed."));
*			die();
*		}   		
*		switch ($_SERVER['REQUEST_METHOD']){
*			case 'DELETE' :  
*	  			echo json_encode(array('delete'=>'deleting'));
*	  			break;
*	  		case 'PUT' :
*	  			echo json_encode(array('put'=>'putting'));
*				break;
*	  		case 'UPDATE' :
*				echo json_encode(array("update" => "updating"));				
*				break;
*	  		case 'PATCH' :
*				echo json_encode(array("patch" => "patching"));				
*				break;
*	  		case 'GET' :
*				echo json_encode(array("get" => "getting"));	
*				break;
*	  		case 'POST' :				
*				echo json_encode(array("post" => "posting"));		  		
*				break;
*	  	}
*	  	die();
*	}
*********************************/


/*************************
*
*   course api
*
**************************/

	public function course(){
  		global $wpdb;
    	$wpdb->show_errors();  		
		if (!gradebook_check_user_role('administrator')){	
			echo json_encode(array("status" => "Not Allowed."));
			die();
		}   	
		$server_request_method = $_SERVER['REQUEST_METHOD'];	
		switch ( $server_request_method ){
			case 'DELETE' : 
				$id = $_REQUEST['id'];
				$gbid = $id;		
	  			$wpdb->delete('an_gradebooks',array('id'=>$id));
	  			$wpdb->delete('an_gradebook',array('gbid'=>$gbid));  
	  			$wpdb->delete('an_assignments',array('gbid'=>$gbid));
	  			$wpdb->delete('an_assignment',array('gbid'=>$gbid));  
	  			echo json_encode(array('delete_course'=>'Success'));
	  			break;
	  		case 'PUT' :
				$params = json_decode(file_get_contents('php://input'),true);			
   				$wpdb->update('an_gradebooks', array( 
   					'name' => $params['name'], 'school' => $params['school'], 'semester' => $params['semester'], 
   					'year' => $params['year']),
					array('id' => $params['id'])
				);   
   				$courseDetails = $wpdb->get_row('SELECT * FROM an_gradebooks WHERE id = '. $params['id'] , ARRAY_A);
   				echo json_encode($courseDetails);	
				break;
	  		case 'UPDATE' :
				echo json_encode(array("update" => "updating"));				
				break;
	  		case 'PATCH' :
				echo json_encode(array("patch" => "patching"));				
				break;
	  		case 'GET' :
				echo json_encode(array("get" => "getting"));	
				break;
	  		case 'POST' :
				$params = json_decode(file_get_contents('php://input'),true);		  		
    			$wpdb->insert('an_gradebooks', 
		    		array('name' => $params['name'], 'school' => $params['school'], 'semester' => $params['semester'], 'year' => $params['year']), 
					array('%s', '%s', '%s', '%d') 
				);
				if( !is_wp_error($wpdb->insert_id) ){
					$courseDetails = $wpdb->get_row("SELECT * FROM an_gradebooks WHERE id = $wpdb->insert_id", ARRAY_A);
					echo json_encode($courseDetails);
					die();
				}else{
					echo $result->get_error_message();
					die();
				}						
				break;
	  	}
	  	die();
	}
}	
?>