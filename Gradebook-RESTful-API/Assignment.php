<?php
class gradebook_assignment_API{
	public function __construct(){
		add_action('wp_ajax_assignment', array($this, 'assignment'));											
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
*   assignment api
*
**************************/

	public function assignment(){
		global $wpdb;
   		$wpdb->show_errors();  		
		if (!gradebook_check_user_role('administrator')){	
			echo json_encode(array("status" => "Not Allowed."));
			die();
		}   	
		$server_request_method = $_SERVER['REQUEST_METHOD'];	
		switch ( $server_request_method ){			
			case 'DELETE' :  
				parse_str($_SERVER['QUERY_STRING'],$params);				
 				$wpdb->delete('an_assignment', array('amid'=> $params['id']));
 				$wpdb->delete('an_assignments', array('id'=> $params['id'])); 	
 				echo json_encode(array('id'=> $params['id']));  
 				die();			
	  			break;
	  		case 'PUT' :
	  			$params = json_decode(file_get_contents('php://input'),true);	
   				$wpdb->update('an_assignments', array( 'assign_name' => $params['assign_name'], 'assign_date' => $params['assign_date'],
   					'assign_due' => $params['assign_due'], 'assign_order'=>$params['assign_order'], 'assign_category' => $params['assign_category']), array('id' => $params['id'] )
   				);   
   				$wpdb->update('an_assignment', array( 'assign_order' => $params['assign_order']), array('amid' => $params['id'] )
   				);     				
   				$assignmentDetails = $wpdb->get_row('SELECT * FROM an_assignments WHERE id = '. $params['id'] , ARRAY_A);
   				$assignmentDetails['id'] = intval($assignmentDetails['id']);   				
   				$assignmentDetails['gbid'] = intval($assignmentDetails['gbid']);  
   				$assignmentDetails['assign_order'] = intval($assignmentDetails['assign_order']);    				  				
   				echo json_encode($assignmentDetails);
  				die();
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
    			$assignOrders = $wpdb->get_col('SELECT assign_order FROM an_assignments WHERE gbid = '. $params['gbid']);    
    			if(!$assignOrders){
    				$assignOrders = array(0);
    			}
    			$assignOrder = max($assignOrders)+1;
				$wpdb->insert('an_assignments', array( 
					'assign_name' => $params['assign_name'],
					'assign_date' => $params['assign_date'],					
					'assign_due' => $params['assign_due'],					
					'assign_category' => $params['assign_category'],						
					'gbid' => $params['gbid'],
					'assign_order'=> $assignOrder
				), array( '%s','%s','%s','%s','%d','%d') 
				);
				$assignID = $wpdb->insert_id;
			    $studentIDs = $wpdb->get_results('SELECT uid FROM an_gradebook WHERE gbid = '. $params['gbid'], ARRAY_N);
			    foreach($studentIDs as $value){
					$wpdb->insert('an_assignment', array( 
						'amid' => $assignID,
						'uid' => $value[0],
						'gbid' => $params['gbid'],
						'assign_order' => $assignOrder,
						'assign_points_earned' => 0
					), array( '%d','%d','%d','%d') 
					);
				}
				$assignmentDetails = $wpdb->get_row("SELECT * FROM an_assignments WHERE id = $assignID", ARRAY_A);
				$assignmentDetails['assign_order'] = intval($assignmentDetails['assign_order']);					
				$assignmentDetails['gbid'] = intval($assignmentDetails['gbid']);	
				$assignmentDetails['id'] = intval($assignmentDetails['id']);
		
				$assignmentStudents = $wpdb->get_results("SELECT * FROM an_assignment WHERE amid = $assignID", ARRAY_A);
				foreach($assignmentStudents as &$assignmentDetail){
					$assignmentDetail['amid'] = intval($assignmentDetail['amid']);		
					$assignmentDetail['uid'] = intval($assignmentDetail['uid']);				
					$assignmentDetail['assign_order'] = intval($assignmentDetail['assign_order']);			
					$assignmentDetail['assign_points_earned'] = intval($assignmentDetail['assign_points_earned']);		
					$assignmentDetail['gbid'] = intval($assignmentDetail['gbid']);	
					$assignmentDetail['id'] = intval($assignmentDetail['id']);
				} 		
					$data = array("assignmentDetails"=>$assignmentDetails,"assignmentStudents"=>$assignmentStudents);
					echo json_encode($data);
					die();
   				}	  						  		
				break;
	  	die();
	}
}
?>