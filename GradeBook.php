<?php
/*
Plugin Name: GradeBook
Plugin URI: http://www.aorinevo.com/
Description: A simple GradeBook plugin
Version: 2.3.6
Author: Aori Nevo
Author URI: http://www.aorinevo.com
License: GPL
*/



define( "AN_GRADEBOOK_VERSION", "2.3.6");

//Load scripts
class AN_GradeBook_Scripts{
	public function __construct(){
			add_action('admin_init', array($this,'register_gradebook_scripts'));
			add_action('admin_enqueue_scripts', array($this,'enqueue_gradebook_scripts'));
			add_action( 'admin_menu', array($this,'register_an_gradebook_menu_page' ));				
	}
	public function register_gradebook_scripts(){
		wp_register_style( 'GradeBook_css', plugins_url('GradeBook.css',__File__), array(), AN_GRADEBOOK_VERSION, false );
		wp_register_style( 'list-tables', plugins_url('list-tables.css',__File__), array(), AN_GRADEBOOK_VERSION, false );		
		wp_register_script('googlejsapi', 'https://www.google.com/jsapi', array(), null, false ); 
		wp_register_script( 'GradeBook_js', plugins_url('GradeBook.js',__File__),array( 'jquery1_11_0', 'backbone','underscore' ), AN_GRADEBOOK_VERSION, true );
		wp_register_script( 'GradeBook_student_js', plugins_url('GradeBook_student.js',__File__),array( 'jquery1_11_0', 'backbone','underscore' ), AN_GRADEBOOK_VERSION, true );
		wp_register_script( 'jquery1_11_0', plugins_url('jquery-1.11.0.min.js',__File__),array('json2'),'1.11.0',false); 		
	}
	public function enqueue_gradebook_scripts($hook){
		global $page_hook_suffix;
        if( $hook != $page_hook_suffix ) return;
		wp_enqueue_style( 'GradeBook_css' );	
		wp_enqueue_style( 'media-views' );			
		wp_enqueue_style( 'list-tables' );		
		wp_enqueue_script( 'googlejsapi' ); 	
    	wp_enqueue_script( 'backbone' );
    	wp_enqueue_script( 'underscore' );	
		wp_enqueue_script( 'jquery1_11_0' );
		wp_enqueue_script( 'jquery-ui-button' );			
		wp_enqueue_script( 'jquery-ui-datepicker' );		
	
		if (gradebook_check_user_role('administrator')){			
			wp_enqueue_script('GradeBook_js');
 		} else {
			wp_enqueue_script('GradeBook_student_js');
 		}
 	}	
	public function register_an_gradebook_menu_page(){
		global $page_hook_suffix;
		if (gradebook_check_user_role('administrator')){	 
    		$page_hook_suffix = add_menu_page( 'GradeBook', 'GradeBooks', 'administrator', 'an_gradebook_page', 'an_gradebook_menu_page', 'dashicons-book-alt', 6 ); 
		} else {
    		$page_hook_suffix = add_menu_page( 'GradeBook', 'GradeBooks', 'subscriber', 'an_gradebook_page', 'an_gradebook_menu_page', 'dashicons-book-alt', 6 ); 
		}
	} 	
}

include_once( dirname( __FILE__ ) . '/an-gradebook-database.php' );
include_once( dirname( __FILE__ ) . '/functions.php' );

class AN_GradeBookAPI{
	public function __construct(){
		//admin_gradebook
		add_action('wp_ajax_add_student', array($this,'add_student'));
		add_action('wp_ajax_update_student', array($this, 'update_student'));
		add_action('wp_ajax_delete_student', array($this, 'delete_student'));		
		add_action('wp_ajax_add_course', array($this, 'add_course'));
		add_action('wp_ajax_update_course', array($this, 'update_course'));
		add_action('wp_ajax_delete_course', array($this, 'delete_course'));
		add_action('wp_ajax_add_assignment', array($this,'add_assignment'));
		add_action('wp_ajax_update_assignments', array($this, 'update_assignments'));					
		add_action('wp_ajax_update_assignment', array($this, 'update_assignment'));
		add_action('wp_ajax_delete_assignment', array($this, 'delete_assignment'));					
		add_action('wp_ajax_get_courses', array($this, 'get_courses'));
		add_action('wp_ajax_get_students', array($this, 'get_students'));
		add_action('wp_ajax_get_assignments',array($this, 'get_assignments'));
		add_action('wp_ajax_get_assignment', array($this, 'get_assignment'));	
		add_action('wp_ajax_get_gradebook', array($this, 'get_gradebook'));			
		add_action('wp_ajax_get_pie_chart', array($this, 'get_pie_chart'));	
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
	
	public function add_student(){	
    	global $wpdb;
    	$wpdb->show_errors(); 
		if (!gradebook_check_user_role('administrator')){	
			echo json_encode(array("status" => "Not Allowed."));
			die();
		}   
		if(!$_POST['id-exists']){ 		   
		$result = wp_insert_user(array(
			'user_login' => strtolower($_POST['firstname'][1].$_POST['lastname']),
			'first_name' => $_POST['firstname'],
			'last_name'  => $_POST['lastname'],
			'user_pass'  => 'password',
		));
		$wpdb->update($wpdb->users,
    		array('user_login' => strtolower($_POST['firstname'][1].$_POST['lastname']).$result), 
    		array('ID'=> $result));	
    	$assignmentDetails = $wpdb->get_results('SELECT * FROM an_assignments WHERE gbid = '. $_POST['gbid'], ARRAY_A);
    	foreach( $assignmentDetails as $assignment){
       		$wpdb->insert('an_assignment', array('gbid'=> $_POST['gbid'], 'amid'=> $assignment['id'], 
          		'uid' => $result, 'assign_order' => $assignment['assign_order']));
    		};
		$gbid = $_POST["gbid"];
		if( !is_wp_error($result) ){
			$studentDetails = get_user_by('id',$result);
			$studentgbids = $wpdb->get_row('SELECT * FROM an_gradebook WHERE uid = '. $result .' AND gbid = '. $gbid);
			$wpdb->insert('an_gradebook', 
				array('uid' => $studentDetails->ID,'gbid' => $gbid)
			);
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
	      		'gbid' => intval($_POST['gbid']),
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
			$studentDetails = get_user_by('id',$_POST['id-exists']);
			if($studentDetails){
				$result = $wpdb->insert('an_gradebook', 
					array('uid' => $_POST['id-exists'],'gbid' => $_POST['gbid']), 
					array('%d','%d') 
				);
    			$assignmentDetails = $wpdb->get_results('SELECT * FROM an_assignments WHERE gbid = '. $_POST['gbid'], ARRAY_A);
    	foreach( $assignmentDetails as $assignment){
       		$wpdb->insert('an_assignment', array('gbid'=> $_POST['gbid'], 'amid'=> $assignment['id'], 
          		'uid' => $studentDetails->ID, 'assign_order' => $assignment['assign_order']));
    		};    			
			$anGradebook = $wpdb->get_results('SELECT * FROM an_gradebook WHERE id = '. $wpdb->insert_id, ARRAY_A);	
			foreach($anGradebook as &$value){
				$value['gbid'] = intval($value['gbid']);
			}
			$assignments = $wpdb->get_results('SELECT * FROM an_assignment WHERE uid = '. $studentDetails->ID .' AND gbid = '. $_POST['gbid'], ARRAY_A);										
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
	      			'gbid' => intval($_POST['gbid']),
	      			'id' => $studentDetails -> ID),
	      			'assignment' => $assignments,
	      			'anGradebook' => $anGradebook
				));
				die();			
			}
		} 
	}

	public function update_student(){
   		global $wpdb;
	    $wpdb->show_errors();
		if (!gradebook_check_user_role('administrator')){	
			echo json_encode(array("status" => "Not Allowed."));
			die();
		}    
		$result = wp_update_user( array ( 'ID' => $_POST['id'], 'first_name' => $_POST['firstname'], 'last_name' => $_POST['lastname'] ) ) ;
		$studentDetails = get_user_by('id',$result);		  
	    echo json_encode(array(
			'student' => array(firstname => $studentDetails -> first_name,
	    	'lastname' => $studentDetails -> last_name,
	    	'id' => $result)
		));
   		die();
	}


	public function add_course(){
    	global $wpdb;
    	$wpdb->show_errors();
		if (!gradebook_check_user_role('administrator')){	
			echo json_encode(array("status" => "Not Allowed."));
			die();
		}     
    	$wpdb->insert('an_gradebooks', 
    		array('name' => $_POST['name'], 'school' => $_POST['school'], 'semester' => $_POST['semester'], 'year' => $_POST['year']), 
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
	}


	public function update_course(){
   		global $wpdb;
   		$wpdb->show_errors();
		if (!gradebook_check_user_role('administrator')){	
			echo json_encode(array("status" => "Not Allowed."));
			die();
		}    
   	$wpdb->update('an_gradebooks', 
		array( 'name' => $_POST['name'], 'school' => $_POST['school'], 'semester' => $_POST['semester'], 'year' => $_POST['year']),
		array('id' => $_POST['id'] )
   	);   
   	$courseDetails = $wpdb->get_row('SELECT * FROM an_gradebooks WHERE id = '. $_POST['id'] , ARRAY_A);
   		echo json_encode($courseDetails);
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


	public function delete_course(){
  		global $wpdb;
		if (!gradebook_check_user_role('administrator')){	
			echo json_encode(array("status" => "Not Allowed."));
			die();
		}   
  		$wpdb->delete('an_gradebooks',array('id'=>$_POST['id']));
  		$wpdb->delete('an_gradebook',array('gbid'=>$_POST['id']));  
  		$wpdb->delete('an_assignments',array('gbid'=>$_POST['id']));
  		$wpdb->delete('an_assignment',array('gbid'=>$_POST['id']));  
  		echo json_encode(array('delete_course'=>'Success'));
  		die();
	}


	public function delete_student(){
		global $wpdb;
		if (!gradebook_check_user_role('administrator')){	
			echo json_encode(array("status" => "Not Allowed."));
			die();
		}  
		$delete_options = $_POST['delete_options'];
		$x = $_POST['id'];
		$y = $_POST['gbid'];		
		switch($delete_options){
			case 'gradebook':
				$results1 = $wpdb->delete('an_gradebook',array('uid'=>$x, 'gbid'=>$y));
				$results2 = $wpdb->delete('an_assignment',array('uid'=>$x, 'gbid'=>$y));
				echo json_encode('student deleted from gradebook');							
			break;
			case 'all_gradebooks':
				$results1 = $wpdb->delete('an_gradebook',array('uid'=>$x));
				$results2 = $wpdb->delete('an_assignment',array('uid'=>$x));	
				echo json_encode('student deleted from all gradebooks');	
			break;
			case 'database':
				$results1 = $wpdb->delete('an_gradebook',array('uid'=>$x));
				$results2 = $wpdb->delete('an_assignment',array('uid'=>$x));				
				require_once(ABSPATH.'wp-admin/includes/user.php' );
				wp_delete_user($x);			
				echo json_encode('student removed from wordpress database');					
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
          'id'=>$current_user->ID
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
		$assignmentDetail['assign_points_earned'] = intval($assignmentDetail['assign_points_earned']);		
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

public function update_assignment(){
   global $wpdb;
   $wpdb->show_errors();
if (!gradebook_check_user_role('administrator')){	
		echo json_encode(array("status" => "Not Allowed."));
		die();
	}    
   $wpdb->update( 
	'an_assignment', 
	array( 'assign_points_earned' => $_POST['assign_points_earned']),
	array( 'uid' => $_POST['uid'], 'amid' => $_POST['amid'] )
   );   
   $assign_points_earned = $wpdb->get_row('SELECT assign_points_earned FROM an_assignment WHERE uid = '. $_POST['uid'] . ' AND amid = '. $_POST['amid'] , ARRAY_A);
   echo json_encode($assign_points_earned);
   die();
}

public function add_assignment(){
    global $wpdb;
    $wpdb->show_errors();
if (!gradebook_check_user_role('administrator')){	
		echo json_encode(array("status" => "Not Allowed."));
		die();
	}     
    $assignOrders = $wpdb->get_col('SELECT assign_order FROM an_assignments WHERE gbid = '. $_POST['gbid']);    
    $assignOrder = max($assignOrders)+1;
	$wpdb->insert('an_assignments', 
				array( 
					'assign_name' => $_POST['assign_name'],
					'assign_date' => $_POST['assign_date'],					
					'assign_due' => $_POST['assign_due'],					
					'gbid' => $_POST['gbid'],
					'assign_order'=> $assignOrder
				), 
				array( 
					'%s',
					'%s',
					'%s', 
					'%d',
					'%d'
				) 
	);
	$assignID = $wpdb->insert_id;
    $studentIDs = $wpdb->get_results('SELECT uid FROM an_gradebook WHERE gbid = '. $_POST['gbid'], ARRAY_N);
    foreach($studentIDs as $value){
	$wpdb->insert('an_assignment', 
				array( 
					'amid' => $assignID,
					'uid' => $value[0],
					'gbid' => $_POST['gbid'],
					'assign_order' => $assignOrder,
					'assign_points_earned' => 0
				), 
				array( 
					'%d', 
					'%d',
					'%d',
					'%d'
				) 
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
	$data = array("assignmentDetails"=>$assignmentDetails,
			"assignmentStudents"=>$assignmentStudents);
	echo json_encode($data);
	die();
   }
}

$an_gradebook_scripts = new AN_GradeBook_Scripts();
$an_gradebook_database = new AN_GradeBook_Database();
$an_gradebookapi = new AN_GradeBookAPI();

function an_gradebook_menu_page(){

if (gradebook_check_user_role('administrator')){
	include_once( dirname( __FILE__ ) . '/templates/edit-student-template.php' );	
	include_once( dirname( __FILE__ ) . '/templates/delete-student-template.php' );
	include_once( dirname( __FILE__ ) . '/templates/edit-assignment-template.php' );
	include_once( dirname( __FILE__ ) . '/templates/stats-assignment-template.php' );	
	include_once( dirname( __FILE__ ) . '/templates/gradebook-interface-template.php' );
	include_once( dirname( __FILE__ ) . '/templates/student-courses-interface-template.php' );
	include_once( dirname( __FILE__ ) . '/templates/edit-course-template.php' );
	include_once( dirname( __FILE__ ) . '/templates/courses-interface-template.php' );	
	include_once( dirname( __FILE__ ) . '/templates/student-gradebook-interface-template.php' );	
	echo '<div class="wrap">
			<h2>GradeBooks</h2>
			<div id="an-gradebooks"></div>
		  </div>';
} elseif (get_current_user_id()>0 && !gradebook_check_user_role('administrator')){
	include_once( dirname( __FILE__ ) . '/templates/student-courses-interface-template.php' );
	
ob_start();
?>
    <script id="student-gradebook-interface-template" type="text/template">   
    <hr/>
    <table id="an-gradebook-container" class="wp-list-table widefat fixed pages">  
    <thead id="students-header">
      <tr>
      	<th></th>
      </tr>
    </thead>
    <tbody id="students"></tbody>
    </table>
    </script>       
<?php

$mytemplates = ob_get_contents();
ob_get_clean();

echo $mytemplates;

echo '<div class="wrap"><h2>GradeBooks</h2><div id="an-gradebooks">
	</div></div>';
	} else {	
		echo 'You do not have premissions to view this GradeBook.';
	}	
}
?>