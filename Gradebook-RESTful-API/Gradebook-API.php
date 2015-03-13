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
		add_action('wp_ajax_get_courses', array($this, 'get_courses'));		
		add_action('wp_ajax_get_gradebook_entire', array($this, 'get_gradebook_entire'));			
		add_action('wp_ajax_get_pie_chart', array($this, 'get_pie_chart'));	
		add_action('wp_ajax_get_line_chart', array($this, 'get_line_chart'));						
		add_action('wp_ajax_get_csv', array($this, 'get_csv'));					
		//student_gradebook
		add_action('wp_ajax_get_line_chart_studentview', array($this, 'get_line_chart_studentview'));		
		add_action('wp_ajax_get_student_courses', array($this, 'get_student_courses'));		
		add_action('wp_ajax_get_student_assignments', array($this, 'get_student_assignments'));		
		add_action('wp_ajax_get_student_assignment', array($this, 'get_student_assignment'));			
		add_action('wp_ajax_get_student_gradebook', array($this, 'get_student_gradebook'));		
		add_action('wp_ajax_get_student_gradebook_entire', array($this, 'get_student_gradebook_entire'));		
		add_action('wp_ajax_get_student', array($this, 'get_student'));							
	}
	
	public function get_csv(){
		global $wpdb;
		if (!gradebook_check_user_role('administrator')){	
			echo json_encode(array("status" => "Not Allowed."));
			die();
		}    
		$gbid = $_GET['id'];			
		$gradebook = $wpdb->get_results('SELECT * FROM an_gradebooks WHERE id = '. $gbid, ARRAY_A);		
		$assignments = $wpdb->get_results('SELECT * FROM an_assignments WHERE gbid = '. $gbid, ARRAY_A);		
	    foreach($assignments as &$assignment){
    		$assignment['id'] = intval($assignment['id']);
    		$assignment['gbid'] = intval($assignment['gbid']);    	
	    	$assignment['assign_order'] = intval($assignment['assign_order']);       	
    	}	
    	usort($assignments, build_sorter('assign_order'));     	
    	
		$column_headers_assignment_names = array();

		foreach($assignments as &$assignment){
    		array_push($column_headers_assignment_names, $assignment['assign_name']);
    	}
	    $column_headers = array_merge(
	    	array('firstname','lastname','user_login','id','gbid'),
	    	$column_headers_assignment_names
	    );		    	
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
          		'gbid' => intval($gbid)
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
		
		$student_records = array(); 
		foreach($students as &$row){
			$records_for_student = array_filter($student_assignments,function($k) use ($row) {
					return $k['uid']==$row['id'];
				});
			$scores_for_student = array_map(function($k){ return $k['assign_points_earned'];}, $records_for_student);		
			$student_record = array_merge($row, $scores_for_student);
			array_push($student_records,$student_record);
		}	
		header('Content-Type: text/csv; charset=utf-8');
		$filename = str_replace(" ", "_", $gradebook[0]['name'].'_'.$gbid);
		header('Content-Disposition: attachment; filename='.$filename.'.csv');

		// create a file pointer connected to the output stream
		$output = fopen('php://output', 'w');

		fputcsv($output, $column_headers);	
		foreach($student_records as &$row){
			fputcsv($output, $row);			
		}	
		fclose($output);	
		die();		
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
		$line_chart_data2 = $wpdb->get_results('SELECT * FROM an_assignments WHERE assign_visibility = "Students" AND gbid = '. $gbid,ARRAY_A);  	
    	$assignmentIDsformated ='';
    	foreach($line_chart_data2 as &$assignment){
    	    $assignmentIDsformated = $assignmentIDsformated. $assignment['id'] . ',';
    	}
    	$assignmentIDsformated = substr($assignmentIDsformated, 0, -1);		
		$line_chart_data1 = $wpdb->get_results('SELECT * FROM an_assignment WHERE amid IN ('.$assignmentIDsformated.') AND uid = '. $uid,ARRAY_A);			
	
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

	public function get_student_gradebook_entire(){
		global $wpdb;
		$gbid = $_GET['gbid']; 	
	   	$current_user = wp_get_current_user();		
		$assignments = $wpdb->get_results('SELECT * FROM an_assignments WHERE assign_visibility = "Students" AND gbid = '. $gbid, ARRAY_A);
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
		$student_assignments = $wpdb->get_results('SELECT * FROM an_assignment WHERE amid IN ('.$assignmentIDsformated.') AND uid = '. $current_user->ID , ARRAY_A);    			
    	foreach($student_assignments as &$student_assignment){
	    	$student_assignment['gbid'] = intval($student_assignment['gbid']);
    	}		
		$student = get_userdata( $current_user->ID );
    	$student = array(
	          	'firstname' => $student->first_name, 
    	      	'lastname' => $student->last_name, 
    	      	'user_login' => $student->user_login,
        	  	'id'=>intval($student->ID),
          		'gbid' => intval($gbid)
	    );
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
	   		"students"=>$student
	   ));
	   die();
	}
}
?>