<?php

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


class AN_GradeBookAPI{
	public function __construct(){
		//admin_gradebook		
		add_action('wp_ajax_update_assignments', array($this, 'update_assignments'));										
		add_action('wp_ajax_get_courses', array($this, 'get_courses'));
		add_action('wp_ajax_get_students', array($this, 'get_students'));
		add_action('wp_ajax_get_assignments',array($this, 'get_assignments'));
		add_action('wp_ajax_get_assignment', array($this, 'get_assignment'));	
		add_action('wp_ajax_get_gradebook', array($this, 'get_gradebook'));			
		add_action('wp_ajax_get_gradebook_entire', array($this, 'get_gradebook_entire'));			
		add_action('wp_ajax_get_pie_chart', array($this, 'get_pie_chart'));	
		add_action('wp_ajax_get_line_chart', array($this, 'get_line_chart'));			
		add_action('wp_ajax_get_line_chart_studentview', array($this, 'get_line_chart_studentview'));			
		//student_gradebook
		add_action('wp_ajax_get_student_courses', array($this, 'get_student_courses'));		
		add_action('wp_ajax_get_student_assignments', array($this, 'get_student_assignments'));		
		add_action('wp_ajax_get_student_assignment', array($this, 'get_student_assignment'));			
		add_action('wp_ajax_get_student_gradebook', array($this, 'get_student_gradebook'));		
		add_action('wp_ajax_get_student', array($this, 'get_student'));							
	}
	
	public function get_pie_chart(){
		global $wpdb;

		$pie_chart_data = $wpdb->get_col('SELECT assign_points_earned FROM an_assignment WHERE amid = '. $_GET['amid']);	
	
		function isA($n){ return ($n>=90 ? true : false); }
		function isB($n){ return ($n>=80 && $n<90 ? true : false); }
		function isC($n){ return ($n>=70 && $n<80 ? true : false); }
		function isD($n){ return ($n>=60 && $n<70 ? true : false); }
		function isF($n){ return ($n<60 ? true : false); }
	
		$is_A = count(array_filter( $pie_chart_data, 'isA'));
		$is_B = count(array_filter( $pie_chart_data, 'isB'));
		$is_C = count(array_filter( $pie_chart_data, 'isC'));
		$is_D = count(array_filter( $pie_chart_data, 'isD'));	
		$is_F = count(array_filter( $pie_chart_data, 'isF'));	
	
		$output = array(
			"grades" => array($is_A,$is_B,$is_C,$is_D,$is_F)
		);

		echo json_encode($output);
		die();
	}
	
	public function get_line_chart(){
		global $wpdb;
		
		$cells = 'an_assignment';
		
		$line_chart_data1 = $wpdb->get_results('SELECT * FROM '.$cells.' WHERE uid = '. $_GET['uid'] .' AND gbid = '. $_GET['gbid'],ARRAY_A);	
		$line_chart_data2 = $wpdb->get_results('SELECT * FROM an_assignments WHERE gbid = '. $_GET['gbid'],ARRAY_A);
	
		foreach($line_chart_data1 as &$line_chart_value1){
			$line_chart_value1['assign_order']= intval($line_chart_value1['assign_order']);		
			$line_chart_value1['assign_points_earned'] = intval($line_chart_value1['assign_points_earned']);
			foreach($line_chart_data2 as $line_chart_value2){
				if($line_chart_value2['id'] == $line_chart_value1['amid']){
					$all_homework_scores = $wpdb->get_col('SELECT assign_points_earned FROM an_assignment WHERE amid = '. $line_chart_value2['id']);
					$class_average = array_sum($all_homework_scores)/count($all_homework_scores);
										
					$line_chart_value1=array_merge($line_chart_value1, array('assign_name'=>$line_chart_value2['assign_name'], 'class_average' =>$class_average));
				}
			}
		} 	
		$result = array(array("Assignment", "Student Score", "Class Average"));
		foreach($line_chart_data1 as $line_chart_value3){
			array_push($result, array($line_chart_value3['assign_name'],$line_chart_value3['assign_points_earned'],$line_chart_value3['class_average']));
		}		
				
		
		echo json_encode($result);	
		die();
	}
	
	public function get_line_chart_studentview(){
		global $wpdb;
		$uid = get_current_user_id();
		$gbid = $_GET['gbid'];
		$line_chart_data1 = $wpdb->get_results('SELECT * FROM an_assignment WHERE uid = '. $uid .' AND gbid = '. $gbid,ARRAY_A);	
		$line_chart_data2 = $wpdb->get_results('SELECT * FROM an_assignments WHERE gbid = '. $gbid,ARRAY_A);
	
		foreach($line_chart_data1 as &$line_chart_value1){
			$line_chart_value1['assign_order']= intval($line_chart_value1['assign_order']);		
			$line_chart_value1['assign_points_earned'] = intval($line_chart_value1['assign_points_earned']);
			foreach($line_chart_data2 as $line_chart_value2){
				if($line_chart_value2['id'] === $line_chart_value1['amid']){
					$all_homework_scores = $wpdb->get_col('SELECT assign_points_earned FROM an_assignment WHERE amid = '. $line_chart_value2['id']);
					$class_average = array_sum($all_homework_scores)/count($all_homework_scores);
										
					$line_chart_value1=array_merge($line_chart_value1, array('assign_name'=>$line_chart_value2['assign_name'], 'class_average' =>$class_average));
				}
			}
		} 	
		$result = array(array("Assignment", "Student Score", "Class Average"));
		foreach($line_chart_data1 as $line_chart_value3){
			array_push($result, array($line_chart_value3['assign_name'],$line_chart_value3['assign_points_earned'],$line_chart_value3['class_average']));
		}		
				
		
		echo json_encode($result);	
		die();
	}	

	public function get_courses(){
  		global $wpdb;
		if (!gradebook_check_user_role('administrator')){	
			echo json_encode(array("status" => "Not Allowed."));
			die();
		}     
  		$results = $wpdb -> get_results("SELECT * FROM an_gradebooks", ARRAY_A);
  		echo json_encode($results);
  		die();
	}

	public function get_student_courses(){
  		global $wpdb;  
		$current_user = wp_get_current_user();
  		$results1 = $wpdb -> get_col("SELECT gbid FROM an_gradebook WHERE uid = ". $current_user->ID);
  		$results2 = $wpdb -> get_results("SELECT * FROM an_gradebooks WHERE id IN (".implode(',', $results1).")", ARRAY_A);  		
  		echo json_encode($results2);
  		die();
	}	

	public function get_students(){
    	global $wpdb;
    	$wpdb->show_errors();
		if (!gradebook_check_user_role('administrator')){	
			echo json_encode(array("status" => "Not Allowed."));
			die();
		}
		
    	$studentIDs = $wpdb->get_results('SELECT uid FROM an_gradebook WHERE gbid = '. $_GET['gbid'], ARRAY_N);
   		foreach($studentIDs as &$value){
        	$studentData = get_userdata($value[0]);
        	$value = array(
          		'firstname'=> $studentData->first_name, 
          		'lastname'=>$studentData->last_name, 
          		'id'=>$studentData->ID,
          		'gbid' => intval($_GET['gbid'])
          		);
    	}
		usort($studentIDs, build_sorter('lastname'));
    	echo json_encode($studentIDs);
    	die();
	}

	public function get_student(){
    	global $wpdb;
    	$wpdb->show_errors();
    	$current_user = wp_get_current_user();
    	$output = array(array(
          'firstname'=> $current_user->first_name, 
          'lastname'=>$current_user->last_name, 
          'id'=>$current_user->ID,
          'gbid' => intval($_GET['gbid'])          
        ));
    	echo json_encode($output);
    	die();
	}

	public function get_assignments(){
    	global $wpdb;
	    $wpdb->show_errors();
		if (!gradebook_check_user_role('administrator')){	
			echo json_encode(array("status" => "Not Allowed."));
			die();
		}     
	    $assignmentDetails = $wpdb->get_results('SELECT * FROM an_assignments WHERE gbid = '. $_GET['gbid'], ARRAY_A);
		usort($assignmentDetails, build_sorter('assign_order'));    
		foreach($assignmentDetails as &$assignmentDetail){
			$assignmentDetail['assign_order'] = intval($assignmentDetail['assign_order']);					
			$assignmentDetail['gbid'] = intval($assignmentDetail['gbid']);	
			$assignmentDetail['id'] = intval($assignmentDetail['id']);
		}
	    echo json_encode($assignmentDetails);
    	die();
	}

	public function get_student_assignments(){
    	global $wpdb;
	    $wpdb->show_errors();   
    	$assignmentDetails = $wpdb->get_results('SELECT * FROM an_assignments WHERE gbid = '. $_GET['gbid'], ARRAY_A);
		usort($assignmentDetails, build_sorter('assign_order'));    	
    	echo json_encode($assignmentDetails);
	    die();
	}

	public function update_assignments(){
		global $wpdb;
		$wpdb->show_errors();
		if (!gradebook_check_user_role('administrator')){	
			echo json_encode(array("status" => "Not Allowed."));
			die();
		}    
	   $wpdb->update( 'an_assignments', 
			array( 'assign_name' => $_POST['assign_name'],'assign_date' => $_POST['assign_date'],'assign_due' => $_POST['assign_due']),
			array('id' => $_POST['id'] )
	   );   
	   $assignmentDetails = $wpdb->get_row('SELECT * FROM an_assignments WHERE id = '. $_POST['id'] , ARRAY_A);
	   echo json_encode($assignmentDetails);
	   die();
	}

	public function get_gradebook(){
   		global $wpdb;
   		$wpdb->show_errors();
		if (!gradebook_check_user_role('administrator')){	
			echo json_encode(array("status" => "Not Allowed."));
			die();
		}    
   		$gradebookDetails = $wpdb->get_results('SELECT * FROM an_gradebook WHERE gbid = '. $_GET['gbid'], ARRAY_A);
   		echo json_encode($gradebookDetails);
   		die();
	}

	//This function is not registered.  It is here just as an idea of another function that may be useful.
	public function get_gradebook_info(){
   		global $wpdb;
   		$wpdb->show_errors();
		if (!gradebook_check_user_role('administrator')){	
			echo json_encode(array("status" => "Not Allowed."));
			die();
		}    
   		$gradebookDetails = $wpdb->get_results('SELECT * FROM an_gradebook WHERE gbid = '. $_GET['gbid'], ARRAY_A);
   		echo json_encode($gradebookDetails);
   		die();
	}

	public function get_gradebook_entire(){
		global $wpdb;
		$gbid = $_GET['gbid'];
		if (!gradebook_check_user_role('administrator')){	
			echo json_encode(array("status" => "Not Allowed."));
			die();
		}    	
		$assignments = $wpdb->get_results('SELECT * FROM an_assignments WHERE gbid = '. $gbid, ARRAY_A);
	    foreach($assignments as &$assignment){
    		$assignment['id'] = intval($assignment['id']);
    		$assignment['gbid'] = intval($assignment['gbid']);    	
	    	$assignment['assign_order'] = intval($assignment['assign_order']);       	
    	}	
		$student_assignments = $wpdb->get_results('SELECT * FROM an_assignment WHERE gbid = '. $gbid, ARRAY_A);
    	foreach($student_assignments as &$student_assignment){
	    	$student_assignment['gbid'] = intval($student_assignment['gbid']);
    	}		
		$students = $wpdb->get_results('SELECT uid FROM an_gradebook WHERE gbid = '. $gbid, ARRAY_N);
   		foreach($students as &$value){
	        $studentData = get_userdata($value[0]);
    	    $value = array(
	          	'firstname' => $studentData->first_name, 
    	      	'lastname' => $studentData->last_name, 
    	      	'user_login' => $studentData->user_login,
        	  	'id'=>intval($studentData->ID),
          		'gbid' => intval($_GET['gbid'])
	          	);
	    }
    	usort($student_assignments, build_sorter('assign_order')); 
		foreach($student_assignments as &$student_assignment){
			$student_assignment['amid'] = intval($student_assignment['amid']);		
			$student_assignment['uid'] = intval($student_assignment['uid']);				
			$student_assignment['assign_order'] = intval($student_assignment['assign_order']);			
			$student_assignment['assign_points_earned'] = floatval($student_assignment['assign_points_earned']);		
			$student_assignment['gbid'] = intval($student_assignment['gbid']);	
			$student_assignment['id'] = intval($student_assignment['id']);
		}  
	   echo json_encode(
	   array(
   			"assignments"=>$assignments, 
   			"cells" => $student_assignments, 
	   		"students"=>$students
	   ));
	   die();
	}

	public function get_student_gradebook(){
   		global $wpdb;
	   $wpdb->show_errors();   
	   $current_user = wp_get_current_user();
	   $gradebookDetails = $wpdb->get_results('SELECT * FROM an_gradebook WHERE gbid = '. $_GET['gbid'] .' AND uid = '. $current_user->ID, ARRAY_A);
	   echo json_encode($gradebookDetails);
	   die();
	}
	
	public function get_assignment(){
   		global $wpdb;
   		$wpdb->show_errors();
		if (!gradebook_check_user_role('administrator')){	
			echo json_encode(array("status" => "Not Allowed."));
			die();
		}    
   		$assignmentDetails = $wpdb->get_results('SELECT * FROM an_assignment WHERE gbid = '. $_GET['gbid'], ARRAY_A);
    	usort($assignmentDetails, build_sorter('assign_order')); 
		foreach($assignmentDetails as &$assignmentDetail){
			$assignmentDetail['amid'] = intval($assignmentDetail['amid']);		
			$assignmentDetail['uid'] = intval($assignmentDetail['uid']);				
			$assignmentDetail['assign_order'] = intval($assignmentDetail['assign_order']);			
			$assignmentDetail['assign_points_earned'] = floatval($assignmentDetail['assign_points_earned']);		
			$assignmentDetail['gbid'] = intval($assignmentDetail['gbid']);	
			$assignmentDetail['id'] = intval($assignmentDetail['id']);
		}    
   		echo json_encode($assignmentDetails);
  		die();
	}

	public function get_student_assignment(){
		global $wpdb;
		$wpdb->show_errors();   
		$current_user = wp_get_current_user();
   		$assignmentDetails = $wpdb->get_results('SELECT * FROM an_assignment WHERE gbid = '. $_GET['gbid'].' AND uid = '. $current_user->ID , ARRAY_A);
    	usort($assignmentDetails, build_sorter('assign_order')); 
   		echo json_encode($assignmentDetails);
   		die();
	}

	public function delete_assignment(){
		global $wpdb;
		$wpdb->show_errors();
		if (!gradebook_check_user_role('administrator')){	
			echo json_encode(array("status" => "Not Allowed."));
			die();
		} 	
 		$wpdb->delete('an_assignment', array('amid'=> $_POST['id']));
 		$wpdb->delete('an_assignments', array('id'=> $_POST['id'])); 	
 		echo json_encode(array('id'=> $_POST['id']));
		die();
	}
}
?>