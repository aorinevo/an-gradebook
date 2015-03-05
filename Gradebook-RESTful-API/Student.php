<?php

class gradebook_student_API{
	public function __construct(){
		add_action('wp_ajax_student', array($this, 'student'));											
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
*   student api
*
**************************/

	public function student(){
  		global $wpdb;
    	$wpdb->show_errors();  		
		if (!gradebook_check_user_role('administrator')){	
			echo json_encode(array("status" => "Not Allowed."));
			die();
		}   		
		$method = (isset($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'])) ? $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] : $_SERVER['REQUEST_METHOD'];
		switch ($method){
			case 'DELETE' :  
				parse_str($_SERVER['QUERY_STRING'],$params);				
				$delete_options = $params['delete_options'];
				$x = $params['id'];
				$y = $params['gbid'];	
				switch($delete_options){
					case 'gradebook':
						$results1 = $wpdb->delete('an_gradebook',array('uid'=>$x, 'gbid'=>$y));
						$results2 = $wpdb->delete('an_assignment',array('uid'=>$x, 'gbid'=>$y));			
						break;
					case 'all_gradebooks':
						echo json_encode('student deleted from all gradebooks');						
						$results1 = $wpdb->delete('an_gradebook',array('uid'=>$x));
						$results2 = $wpdb->delete('an_assignment',array('uid'=>$x));		
						break;
					case 'database':
						$results1 = $wpdb->delete('an_gradebook',array('uid'=>$x));
						$results2 = $wpdb->delete('an_assignment',array('uid'=>$x));				
						require_once(ABSPATH.'wp-admin/includes/user.php' );
						wp_delete_user($x);	
						die();												
						break;
				} 	  			
	  			break;
	  		case 'PUT' :
				$params = json_decode(file_get_contents('php://input'),true);		  		
				$result = wp_update_user( array ( 'ID' => $params['id'], 'first_name' => $params['firstname'], 'last_name' => $params['lastname'] ) ) ;
				$studentDetails = get_user_by('id',$result);		  
	    		echo json_encode(array(
					'student' => array("firstname" => $studentDetails -> first_name,
	    			'lastname' => $studentDetails -> last_name,
	    			'id' => $result)
				));
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
				if(!$params['id-exists']){ 		   
					$result = wp_insert_user(array(
						'user_login' => strtolower($params['firstname'][0].$params['lastname']),
						'first_name' => $params['firstname'],
						'last_name'  => $params['lastname'],							
						'user_pass'  => 'password'
					));
					$wpdb->update($wpdb->users, array('user_login' => strtolower($params['firstname'][0].$params['lastname']).$result), 
						array('ID'=> $result)
		    		);	
			    	$assignmentDetails = $wpdb->get_results('SELECT * FROM an_assignments WHERE gbid = '. $params['gbid'], ARRAY_A);
			    	foreach( $assignmentDetails as $assignment){
			       		$wpdb->insert('an_assignment', array('gbid'=> $params['gbid'], 'amid'=> $assignment['id'],           						'uid' => $result, 'assign_order' => $assignment['assign_order'])
          					);
			   		};
					$gbid = $params["gbid"];
					if( !is_wp_error($result) ){
						$studentDetails = get_user_by('id',$result);
						$studentgbids = $wpdb->get_row('SELECT * FROM an_gradebook WHERE uid = '. $result .' AND gbid = '. $gbid);
						$wpdb->insert('an_gradebook', array('uid' => $studentDetails->ID,'gbid' => $gbid));
						$assignments = $wpdb->get_results('SELECT * FROM an_assignment WHERE uid = '. $result, ARRAY_A);	
						$anGradebook = $wpdb->get_results('SELECT * FROM an_gradebook WHERE id = '. $wpdb->insert_id, ARRAY_A);					
						usort($assignments, build_sorter('assign_order'));
						foreach($assignments as &$assignmentDetail){
							$assignmentDetail['amid'] = intval($assignmentDetail['amid']);		
							$assignmentDetail['uid'] = intval($assignmentDetail['uid']);				
							$assignmentDetail['assign_order'] = intval($assignmentDetail['assign_order']);			
							$assignmentDetail['assign_points_earned'] = intval($assignmentDetail['assign_points_earned']);		
							$assignmentDetail['gbid'] = intval($assignmentDetail['gbid']);	
							$assignmentDetail['id'] = intval($assignmentDetail['id']);
						} 			
						echo json_encode(array(
			      			'student'=> array(
			      				'firstname' => $studentDetails -> first_name,
    							'lastname' => $studentDetails -> last_name,
								'user_login' => $studentDetails -> user_login,    							
			    	  			'gbid' => intval($params['gbid']),
				     			'id' => intval($result)
				     		),
				      		'assignment' => $assignments,
				      		'anGradebook' => $anGradebook
						));
						die();
					}else{
						echo $result->get_error_message();
						die();
					}
				}else {
					$studentDetails = get_user_by('login',$params['id-exists']);
					if($studentDetails){
						$result = $wpdb->insert('an_gradebook', array('uid' => $studentDetails->ID,'gbid' => $params['gbid']), 
						array('%d','%d') 
						);
    					$assignmentDetails = $wpdb->get_results('SELECT * FROM an_assignments WHERE gbid = '. $params['gbid'], ARRAY_A);
			    		foreach( $assignmentDetails as $assignment){
		       			$wpdb->insert('an_assignment', array('gbid'=> $params['gbid'], 'amid'=> $assignment['id'], 
		          			'uid' => $studentDetails->ID, 'assign_order' => $assignment['assign_order']));
    					};    			
						$anGradebook = $wpdb->get_results('SELECT * FROM an_gradebook WHERE id = '. $wpdb->insert_id, ARRAY_A);	
						foreach($anGradebook as &$value){
							$value['gbid'] = intval($value['gbid']);
						}
						$assignments = $wpdb->get_results('SELECT * FROM an_assignment WHERE uid = '. $studentDetails->ID .' AND gbid = '. $params['gbid'], ARRAY_A);										
						usort($assignments, build_sorter('assign_order'));
						foreach($assignments as &$assignmentDetail){
							$assignmentDetail['amid'] = intval($assignmentDetail['amid']);		
							$assignmentDetail['uid'] = intval($assignmentDetail['uid']);				
							$assignmentDetail['assign_order'] = intval($assignmentDetail['assign_order']);			
							$assignmentDetail['assign_points_earned'] = intval($assignmentDetail['assign_points_earned']);		
							$assignmentDetail['gbid'] = intval($assignmentDetail['gbid']);	
							$assignmentDetail['id'] = intval($assignmentDetail['id']);
						} 				
						echo json_encode(array(
		    	  			'student'=> array('firstname' => $studentDetails -> first_name,
							'lastname' => $studentDetails -> last_name,
		    	  			'gbid' => intval($params['gbid']),
	    	  				'id' => $studentDetails -> ID),
	  						'assignment' => $assignments,
		      				'anGradebook' => $anGradebook
						));
						die();			
					}
				} 	  		
				break;
			}
			die();
			}	
}
?>