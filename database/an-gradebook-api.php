<?php

class an_gradebook_api{

	public function an_gradebook_update_user($id,$first_name,$last_name){
		$user_id = wp_update_user( array ( 
			'ID' => $id, 
			'first_name' => $first_name, 
			'last_name' => $last_name ) ) ;
		$user = get_user_by('id',$user_id);		  
	    return array(
			'first_name' => $user -> first_name,
	    	'last_name' => $user -> last_name,
	    	'id' => $user_id
	    );
	}
	
	public function angb_get_gradebook($gbid, $role, $uid){
		global $current_user, $wpdb;
		if(!$uid){
			$uid = $current_user -> ID;
		}	
		if(!$role){
			$role = $wpdb->get_var('SELECT role FROM an_gradebook_users WHERE gbid = '. $gbid .' AND uid ='. $uid);
		}
		switch($role){
			case 'instructor' :
				$assignments = $wpdb->get_results('SELECT * FROM an_gradebook_assignments WHERE gbid = '. $gbid, ARRAY_A);
				foreach($assignments as &$assignment){
					$assignment['id'] = intval($assignment['id']);
					$assignment['gbid'] = intval($assignment['gbid']);    	
					$assignment['assign_order'] = intval($assignment['assign_order']);       	
				}	
				$cells = $wpdb->get_results('SELECT * FROM an_gradebook_cells WHERE gbid = '. $gbid, ARRAY_A);
				foreach($assignments as &$assignment){
					$assignment['gbid'] = intval($assignment['gbid']);
				}		
				$students = $wpdb->get_results('SELECT uid FROM an_gradebook_users WHERE gbid = '. $gbid .' AND role = "student"', ARRAY_N);
				foreach($students as &$student_id){
					$student = get_userdata($student_id[0]);
					$student_id = array(
						'first_name' => $student->first_name, 
						'last_name' => $student->last_name, 
						'user_login' => $student->user_login,
						'id'=>intval($student->ID),
						'gbid' => intval($gbid)
						);
				}
				usort($cells, build_sorter('assign_order')); 
				foreach($cells as &$cell){
					$cell['amid'] = intval($cell['amid']);		
					$cell['uid'] = intval($cell['uid']);				
					$cell['assign_order'] = intval($cell['assign_order']);			
					$cell['assign_points_earned'] = floatval($cell['assign_points_earned']);		
					$cell['gbid'] = intval($cell['gbid']);	
					$cell['id'] = intval($cell['id']);
				}  	
				return array( "assignments" => $assignments,  
					"cells" => $cells,   			
					"students"=>$students,
					"role"=>"instructor"					
			   	);
			case 'student' :
				$assignments = $wpdb->get_results('SELECT * FROM an_gradebook_assignments WHERE assign_visibility = "Students" AND gbid = '. $gbid, ARRAY_A);
				foreach($assignments as &$assignment){
					$assignment['id'] = intval($assignment['id']);
					$assignment['gbid'] = intval($assignment['gbid']);    	
					$assignment['assign_order'] = intval($assignment['assign_order']);       	
				}	   	
				$assignmentIDsformated ='';
				foreach($assignments as &$assignment){
					$assignmentIDsformated = $assignmentIDsformated. $assignment['id'] . ',';
				}
				$assignmentIDsformated = substr($assignmentIDsformated, 0, -1);
				$cells = $wpdb->get_results('SELECT * FROM an_gradebook_cells WHERE amid IN ('.$assignmentIDsformated.') AND uid = '. $current_user->ID , ARRAY_A);    			
				foreach($cells as &$cell){
					$cell['gbid'] = intval($cell['gbid']);
				}		
				$student = get_userdata( $current_user->ID );
				$student = array(
						'firstname' => $student->first_name, 
						'lastname' => $student->last_name, 
						'user_login' => $student->user_login,
						'id'=>intval($student->ID),
						'gbid' => intval($gbid)
				);
				usort($cells, build_sorter('assign_order')); 
				foreach($cells as &$cell){
					$cell['amid'] = intval($cell['amid']);		
					$cell['uid'] = intval($cell['uid']);				
					$cell['assign_order'] = intval($cell['assign_order']);			
					$cell['assign_points_earned'] = floatval($cell['assign_points_earned']);		
					$cell['gbid'] = intval($cell['gbid']);	
					$cell['id'] = intval($cell['id']);
				}  
			   return array(
					"assignments"=>$assignments, 
					"cells" => $cells, 
					"students"=>array($student),
					"role"=>"student"
			   );		
			}
	}
	
	public function an_gradebook_get_user_role($gbid){
		global $wpdb, $current_user;
		$uid = $current_user -> ID;	
		$role = $wpdb->get_var('SELECT role FROM an_gradebook_users WHERE gbid = '. $gbid .' AND uid ='. $uid);	
		return $role;		
	}
	
	public function angb_is_gb_administrator(){
		global $current_user;  
		$x = $current_user->roles;
		$y = array_keys(get_option('an_gradebook_settings'),true);
		$z = array_intersect($x,$y);
		if( count($z) ){	
			return true;
		} else {
			return false;
		}
	}
	
	public function an_gradebook_get_user($id,$gbid){
	  	global $wpdb;
	  	$user = $wpdb->get_row('SELECT * FROM an_gradebook_users WHERE uid = '. $id .' AND gbid ='. $gbid, ARRAY_A);
	  	$user_data = get_user_by('id',$id);
	  	$user_data -> ID;
		$user['id'] = intval($user['id']);
		$user['gbid'] = intval($user['gbid']);					
		$user['uid'] = intval($user['uid']);		
		$user['first_name'] = $user_data->first_name;
		$user['last_name'] = $user_data->last_name;		
		$user['user_login'] = $user_data->user_login;				 			
		return $user;		
	}
	
	public function an_gradebook_create_user($id, $gbid, $first_name,$last_name,$user_login){
			global $wpdb;
			//$gbid is being passed as string, should be int.
			if(!$user_login){ 		   
					$counter = intval($wpdb -> get_var('SELECT MAX(id) FROM wp_users'))+1;
					$result = wp_insert_user(array(
						'user_login' => strtolower($first_name[0].$last_name.$counter),
						'first_name' => $first_name,
						'last_name'  => $last_name,							
						'user_pass'  => 'password'
					));
					if(is_wp_error($result) ){
						echo $result->get_error_message();
						die();
					}		
					$user_id = $result;								
					$wpdb->update($wpdb->users, array('user_login' => strtolower($first_name[0].$last_name).$user_id), 
						array('ID'=> $user_id)
		    		);	
			    	$assignments = $wpdb->get_results('SELECT * FROM an_gradebook_assignments WHERE gbid = '. $gbid, ARRAY_A);
			    	foreach( $assignments as $assignment){
			       		$wpdb->insert('an_gradebook_cells', array(	
			       			'gbid'=> $gbid, 'amid'=> $assignment['id'], 
			       			'uid' => $result, 'assign_order' => $assignment['assign_order']
			       		));
			   		};
					$student = get_user_by('id',$user_id);
					$wpdb->insert('an_gradebook_users', array('uid' => $student->ID,'gbid' => $gbid, 'role' => 'student'));
					$cells = $wpdb->get_results('SELECT * FROM an_gradebook_cells WHERE uid = '. $result, ARRAY_A);	
					usort($cells, build_sorter('assign_order'));
					foreach($cells as &$cell){
						$cell['amid'] = intval($cell['amid']);		
						$cell['uid'] = intval($cell['uid']);				
						$cell['assign_order'] = intval($cell['assign_order']);			
						$cell['assign_points_earned'] = intval($cell['assign_points_earned']);		
						$cell['gbid'] = intval($cell['gbid']);	
						$cell['id'] = intval($cell['id']);
					} 			
					return array(
						'student'=> array(
			      			'first_name' => $student -> first_name,
    						'last_name' => $student -> last_name,
							'user_login' => $student -> user_login,    							
				  			'gbid' => intval($gbid),
			     			'id' => intval($result)
			     		),
			      		'cells' => $cells
					);
				}else {
					$user = get_user_by('login',$user_login);
					if($user){
						$result = $wpdb->insert('an_gradebook_users', array('uid' => $user->ID,
							'gbid' => $gbid), 
							array('%d','%d') 
						);
    					$assignments = $wpdb->get_results('SELECT * FROM an_gradebook_assignments WHERE gbid = '. $gbid, ARRAY_A);
			    		foreach( $assignments as $assignment){
		       			$wpdb->insert('an_gradebook_cells', array('gbid'=> $gbid, 
		       					'amid'=> $assignment['id'], 
		          				'uid' => $user->ID, 
		          				'assign_order' => $assignment['assign_order']));
    					};    			
						$role = $wpdb->get_results('SELECT * FROM an_gradebook_users WHERE uid = '. $user->ID . ' AND gbid = '. $gbid, ARRAY_A);												
						
						$cells = $wpdb->get_results('SELECT * FROM an_gradebook_cells WHERE uid = '. $user->ID .' AND gbid = '. $gbid, ARRAY_A);										
						usort($cells, build_sorter('assign_order'));
						foreach($cells as &$cell){
							$cell['amid'] = intval($cell['amid']);		
							$cell['uid'] = intval($cell['uid']);				
							$cell['assign_order'] = intval($cell['assign_order']);			
							$cell['assign_points_earned'] = intval($cell['assign_points_earned']);		
							$cell['gbid'] = intval($cell['gbid']);	
							$cell['id'] = intval($cell['id']);
						} 				
						echo json_encode(array('student'=>array(
							'first_name' => $user -> first_name,
							'last_name' => $user -> last_name,
							'user_login' => $user -> user_login,
		    	  			'gbid' => intval($gbid),
	    	  				'id' => $user -> ID,
	  						'role' => $role[0]['role']),	    	  				
	  						'cells' => $cells
		      			));
						die();			
					}
				} 		
	}
}
?>