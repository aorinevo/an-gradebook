<?php
/*
Plugin Name: GradeBook
Plugin URI: http://www.aorinevo.com/
Description: A simple GradeBook plugin
Version: 3.0
Author: Aori Nevo
Author URI: http://www.aorinevo.com
License: GPL
*/

define( "AN_GRADEBOOK_VERSION", "3.0");
//Load scripts
class AN_GradeBook_Scripts{
	public function __construct(){
			add_action('admin_init', array($this,'register_gradebook_scripts'));
			add_action( 'admin_menu', array($this,'register_an_gradebook_menu_page' ));					
			add_action('admin_enqueue_scripts', array($this,'enqueue_gradebook_scripts'));		
	}
	public function register_gradebook_scripts(){
		wp_register_style( 'GradeBook_css', plugins_url('GradeBook.css',__File__), array('list-tables'), null, false );
		wp_register_style( 'bootstrap_css', plugins_url('js/packages/bootstrap/css/bootstrap.min.css',__File__), array(), null, false );		
		wp_register_style( 'list-tables', plugins_url('list-tables.css',__File__), array(), null, false );		
		wp_register_script('googlejsapi', 'https://www.google.com/jsapi', array(), null, false ); 
//models
		wp_register_script( 'models/Cell', plugins_url('js/models/Cell.js',__File__),array( 'init_app','jquery','backbone','underscore' ), null, true );		
		wp_register_script( 'models/CellList', plugins_url('js/models/CellList.js',__File__),array( 'init_app','jquery','backbone','underscore' ), null, true );				
		wp_register_script( 'models/Assignment', plugins_url('js/models/Assignment.js',__File__),array( 'init_app','jquery','backbone','underscore' ), null, true );				
		wp_register_script( 'models/AssignmentList', plugins_url('js/models/AssignmentList.js',__File__),array( 'init_app','jquery','backbone','underscore' ), null, true );	
		wp_register_script( 'models/Student', plugins_url('js/models/Student.js',__File__),array( 'init_app','jquery','backbone','underscore' ), null, true );			
		wp_register_script( 'models/StudentList', plugins_url('js/models/StudentList.js',__File__),array( 'init_app','jquery','backbone','underscore' ), null, true );					
		wp_register_script( 'models/Course', plugins_url('js/models/Course.js',__File__),array( 'init_app','jquery','backbone','underscore' ), null, true );			
		wp_register_script( 'models/CourseList', plugins_url('js/models/CourseList.js',__File__),array( 'init_app','jquery','backbone','underscore' ), null, true );					
		wp_register_script( 'models/CourseGradebook', plugins_url('js/models/CourseGradebook.js',__File__),array( 'init_app','jquery','backbone','underscore' ), null, true );					
		wp_register_script( 'models/ANGradebook', plugins_url('js/models/ANGradebook.js',__File__),array( 'init_app','jquery','backbone','underscore' ), null, true );			
		wp_register_script( 'models/ANGradebookList', plugins_url('js/models/ANGradebookList.js',__File__),array( 'init_app','jquery','backbone','underscore' ), null, true );							
//views
		wp_register_script( 'views/CellView', plugins_url('js/views/CellView.js',__File__),array( 'init_app','jquery','backbone','underscore' ), null, true );																	
		wp_register_script( 'views/AssignmentView', plugins_url('js/views/AssignmentView.js',__File__),array( 'init_app','jquery','backbone','underscore' ), null, true );								
		wp_register_script( 'views/StudentView', plugins_url('js/views/StudentView.js',__File__),array( 'init_app','jquery','backbone','underscore' ), null, true );										
		wp_register_script( 'views/CourseView', plugins_url('js/views/CourseView.js',__File__),array( 'init_app','jquery','backbone','underscore' ), null, true );												
		wp_register_script( 'views/GradebookView', plugins_url('js/views/GradebookView.js',__File__),array( 'init_app','jquery','backbone','underscore' ), null, true );														
		wp_register_script( 'views/EditStudentView', plugins_url('js/views/EditStudentView.js',__File__),array( 'init_app','jquery','backbone','underscore' ), null, true );														
		wp_register_script( 'views/DeleteStudentView', plugins_url('js/views/DeleteStudentView.js',__File__),array( 'init_app','jquery','backbone','underscore' ), null, true );																
		wp_register_script( 'views/EditAssignmentView', plugins_url('js/views/EditAssignmentView.js',__File__),array( 'init_app','jquery','backbone','underscore' ), null, true );																		
		wp_register_script( 'views/EditCourseView', plugins_url('js/views/EditCourseView.js',__File__),array( 'init_app','jquery','backbone','underscore' ), null, true );																		
		wp_register_script( 'views/AssignmentStatisticsView', plugins_url('js/views/AssignmentStatisticsView.js',__File__),array( 'init_app','jquery','backbone','underscore' ), null, true );																		
		wp_register_script( 'views/StudentStatisticsView', plugins_url('js/views/StudentStatisticsView.js',__File__),array( 'init_app','jquery','backbone','underscore' ), null, true );																		
//other scripts		
		wp_register_script( 'GradeBook_js', plugins_url('GradeBook.js',__File__),array( 'jquery','models/Cell','models/CellList','models/Assignment','models/AssignmentList','models/Student','models/StudentList','models/CourseGradebook', 'backbone','underscore' ), null, true );
		wp_register_script( 'init_app', plugins_url('init_app.js',__File__),array( 'jquery', 'backbone','underscore' ), null, true );		
		wp_register_script( 'GradeBook_student_js', plugins_url('GradeBook_student.js',__File__),array( 'jquery', 'backbone','underscore' ), null, true );
		wp_register_script( 'bootstrap_js', plugins_url('js/packages/bootstrap/js/bootstrap.min.js',__File__),array( 'jquery', 'backbone','underscore' ), null, true );
	}
	public function enqueue_gradebook_scripts($hook){
        if( $hook == "toplevel_page_an_gradebook_page" ){
		wp_enqueue_style( 'GradeBook_css' );	
		//wp_enqueue_style( 'bootstrap_css' );
		wp_enqueue_style( 'media-views' );			
		wp_enqueue_style( 'list-tables' );	
//models	
    	wp_enqueue_script( 'models/Cell' );	
    	wp_enqueue_script( 'models/CellList' );    	
    	wp_enqueue_script( 'models/Assignment' );	
    	wp_enqueue_script( 'models/AssignmentList' );     	
    	wp_enqueue_script( 'models/Student' );    	
    	wp_enqueue_script( 'models/StudentList' );    	
    	wp_enqueue_script( 'models/Course' );    	
    	wp_enqueue_script( 'models/CourseList' );     
    	wp_enqueue_script( 'models/CourseGradebook' );      	
    	wp_enqueue_script( 'models/ANGradebook' );    	
    	wp_enqueue_script( 'models/ANGradebookList' );     		
//views
    	wp_enqueue_script( 'views/CellView' );	
    	wp_enqueue_script( 'views/AssignmentView' );     	
    	wp_enqueue_script( 'views/StudentView' );         	
    	wp_enqueue_script( 'views/CourseView' );    
    	wp_enqueue_script( 'views/EditStudentView');     	
    	wp_enqueue_script( 'views/DeleteStudentView');     	    	
    	wp_enqueue_script( 'views/EditAssignmentView');     	    	    	
    	wp_enqueue_script( 'views/EditCourseView');     	    	    	    	   	    	    	    	    	
    	wp_enqueue_script( 'views/AssignmentStatisticsView' );  
    	wp_enqueue_script( 'views/StudentStatisticsView' );  
    	wp_enqueue_script( 'views/GradebookView' );      	
//other scripts    	
		wp_enqueue_script( 'googlejsapi' ); 	
		//wp_enqueue_script( 'bootstrap_js' ); 		
    	wp_enqueue_script( 'backbone' );
    	wp_enqueue_script( 'underscore' );	
		wp_enqueue_script( 'jquery' );			
		wp_enqueue_script( 'jquery-ui-datepicker',null,array('jquery') );	
	} else {
	  return;
	}	
	
	if (gradebook_check_user_role('administrator')){			
			wp_enqueue_script('GradeBook_js');
 		} else {
			wp_enqueue_script('GradeBook_student_js');
 		}
 	}	
	public function an_gradebook_admin_help_tab(){
   		$screen = get_current_screen();
		$screen->add_help_tab( array( 
	   	'id' => 'an_gradebook_display_course',     
	   	'title' => 'GradeBook',     
	   	'content' => '<ul>
	   	  <li>Create a gradebook by clicking on the Add Course button.</li>
	   	  <li>To show the gradebook, click on the Course name.</li>
	   	  </ul>' 
		) );
		$screen->add_help_tab( array( 
	   	'id' => 'an_gradebook_display_student_statistics',       
	   	'title' => 'Student Statistics',     
	   	'content' => '<ul>
	   	  <li>Click on student\'s name</li>
	   	  <li>Click on the Student Statistics button</li>
	   	</ul>' 
		) );	
	} 	
	public function an_gradebook_student_help_tab(){
   		$screen = get_current_screen();
		$screen->add_help_tab( array( 
	   	'id' => 'an_gradebook_display_course',     
	   	'title' => 'GradeBook',     
	   	'content' => '<ul>
	   	  <li>To show the gradebook, click on the Course name.</li>
	   	  </ul>' 
		) );
		$screen->add_help_tab( array( 
	   	'id' => 'an_gradebook_display_student_statistics',           
	   	'title' => 'Student Statistics',      
	   	'content' => '<ul>
	   	  <li>Click on the Grades: cell</li>
	   	  <li>Click on the Student Statistics button</li>
	   	</ul>'  
		) );	
		$screen->add_help_tab( array( 
	   	'id' => 'an_gradebook_display_assignment_statistics',   
	   	'title' => 'Assignment Statistics',    
	   	'content' => '<ul>
	   	  <li>Click on an assignment header cell</li>
	   	  <li>Click on the Assignment Statistics button</li>
	   	</ul>'  
		) );		
	} 		
	public function register_an_gradebook_menu_page(){	
		if (gradebook_check_user_role('administrator')){
    		$gradebook_page = add_menu_page( 'GradeBook', 'GradeBooks', 'administrator', 'an_gradebook_page', 'an_gradebook_menu_page', 'dashicons-book-alt', '6.12' ); 
    		//add_action('load-'.$gradebook_page,array($this, 'an_gradebook_admin_help_tab'));			    		
			//add_submenu_page( 'an_gradebook_page', 'GradeBook','All GradeBooks', 'administrator', 'an_gradebook_page');
			//add_submenu_page( 'an_gradebook_page', 'Setting','Settings', 'administrator', 'an_gradebook_settings_page','an_gradebook_settings_page' );     	
    		//add_action('load-'.$settings_help, 'an_gradebook_settings_add_help_tab');			
		} else {
    		$gradebook_page = add_menu_page( 'GradeBook', 'GradeBooks', 'subscriber', 'an_gradebook_page', 'an_gradebook_menu_page', 'dashicons-book-alt', '6.12' ); 
    		//add_action('load-'.$gradebook_page,array($this, 'an_gradebook_student_help_tab'));		
		}
	} 	
}

include_once( dirname( __FILE__ ) . '/functions.php' );
include_once( dirname( __FILE__ ) . '/an-gradebook-database.php' );


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
		add_action('wp_ajax_course', array($this, 'course'));		
		add_action('wp_ajax_student', array($this,'student'));		
		add_action('wp_ajax_assignment', array($this, 'assignment'));			
		add_action('wp_ajax_cell', array($this, 'cell'));		
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
		switch ($_SERVER['REQUEST_METHOD']){
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
		switch ($_SERVER['REQUEST_METHOD']){
			case 'DELETE' :  
				parse_str($_SERVER['QUERY_STRING'],$params);				
				$delete_options = $params['delete_options'];
				$x = $params['id'];
				$y = $params['gbid'];	
				switch($delete_options){
					case 'gradebook':
						$results1 = $wpdb->delete('an_gradebook',array('uid'=>$x, 'gbid'=>$y));
						$results2 = $wpdb->delete('an_assignment',array('uid'=>$x, 'gbid'=>$y));
						echo json_encode('student deleted from gradebook');							
						break;
					case 'all_gradebooks':
						echo json_encode('student deleted from all gradebooks');						
						$results1 = $wpdb->delete('an_gradebook',array('uid'=>$x));
						$results2 = $wpdb->delete('an_assignment',array('uid'=>$x));	
						echo json_encode('student deleted from all gradebooks');	
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
						'user_login' => strtolower($params['firstname'][1].$params['lastname']),
						'first_name' => $params['firstname'],
						'last_name'  => $params['lastname'],							'user_pass'  => 'password',
					));
					$wpdb->update($wpdb->users, array('user_login' => strtolower($params['firstname'][1].$params['lastname']).$result), 
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
			      			'student'=> array('firstname' => $studentDetails -> first_name,
    						'lastname' => $studentDetails -> last_name,
			    	  		'gbid' => intval($params['gbid']),
				     		'id' => intval($result)),
				      		'assignment' => $assignments,
				      		'anGradebook' => $anGradebook
						));
						die();
					}else{
						echo $result->get_error_message();
						die();
					}
				}else {
					$studentDetails = get_user_by('id',$params['id-exists']);
					if($studentDetails){
						$result = $wpdb->insert('an_gradebook', array('uid' => $params['id-exists'],'gbid' => $params['gbid']), 
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
		switch ($_SERVER['REQUEST_METHOD']){
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

/*************************
*
*   cell api
*
**************************/	
	

	public function cell(){
		global $wpdb;
   		$wpdb->show_errors();  		
		if (!gradebook_check_user_role('administrator')){	
			echo json_encode(array("status" => "Not Allowed."));
			die();
		}   		
		switch ($_SERVER['REQUEST_METHOD']){
			case 'DELETE' :  
	  			echo json_encode(array('delete'=>'deleting'));
	  			break;
	  		case 'PUT' :
	  			echo json_encode(array('put'=>'putting'));
	  			$params = json_decode(file_get_contents('php://input'),true);		  			
	  			echo json_encode($params);
   				$wpdb->update('an_assignment', array( 'assign_order'=>$params['assign_order'], 'assign_points_earned' => $params['assign_points_earned']),
					array( 'uid' => $params['uid'], 'amid' => $params['amid'] )
   				);   
   				$assign_points_earned = $wpdb->get_row('SELECT assign_points_earned FROM an_assignment WHERE uid = '. $params['uid'] . ' AND amid = '. $params['amid'] , ARRAY_A);
   				echo json_encode($assign_points_earned);
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
				echo json_encode(array("post" => "posting"));		  		
				break;
	  	}
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
   $wpdb->update( 
	'an_assignments', 
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
          	'firstname'=> $studentData->first_name, 
          	'lastname'=>$studentData->last_name, 
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

$an_gradebook_scripts = new AN_GradeBook_Scripts();
$an_gradebook_database = new AN_GradeBook_Database();
$an_gradebookapi = new AN_GradeBookAPI();


function an_gradebook_settings_page(){
	if (gradebook_check_user_role('administrator')){	
	ob_start();		
	include( dirname( __FILE__ ) . '/templates/settings/grade-range.php' );	
	$mytemplates = ob_get_clean();	
	echo '<div class="wrap">
			<h2>Settings</h2>'.
			$mytemplates.'
		  </div>';			
	}
}



function an_gradebook_menu_page(){
if (gradebook_check_user_role('administrator')){
	ob_start();	
	include( dirname( __FILE__ ) . '/templates/edit-student-template.php' );	
	include( dirname( __FILE__ ) . '/templates/delete-student-template.php' );
	include( dirname( __FILE__ ) . '/templates/edit-assignment-template.php' );
	include( dirname( __FILE__ ) . '/templates/stats-assignment-template.php' );	
	include( dirname( __FILE__ ) . '/templates/stats-student-template.php' );	
	include( dirname( __FILE__ ) . '/templates/assignment-view-template.php' );		
	include( dirname( __FILE__ ) . '/templates/student-view-template.php' );		
	include( dirname( __FILE__ ) . '/templates/gradebook-interface-template.php' );
	include( dirname( __FILE__ ) . '/templates/student-courses-interface-template.php' );
	include( dirname( __FILE__ ) . '/templates/edit-course-template.php' );
	include( dirname( __FILE__ ) . '/templates/courses-interface-template.php' );	
	include( dirname( __FILE__ ) . '/templates/student-gradebook-interface-template.php' );	
	$mytemplates = ob_get_clean();	
	echo $mytemplates;		
	echo '<div class="wrap">
			<h2>GradeBooks</h2>
			<div id="an-gradebooks"></div>
		  </div>';
} elseif (get_current_user_id()>0 && !gradebook_check_user_role('administrator')){
	ob_start();
	include_once( dirname( __FILE__ ) . '/templates/stats-assignment-template.php' );	
	include_once( dirname( __FILE__ ) . '/templates/stats-student-template.php' );	
	include_once( dirname( __FILE__ ) . '/templates/student-courses-interface-template.php' );
	include_once( dirname( __FILE__ ) . '/templates/student-gradebook-interface-template.php' );
	$mytemplates = ob_get_clean();	
	echo $mytemplates;		
	echo '<div class="wrap">
			<h2>GradeBooks</h2>
			<div id="an-gradebooks"></div>
		  </div>';
} else {	
	echo 'You do not have premissions to view this GradeBook.';
}
}
?>