<?php
/*
Plugin Name: GradeBook
Plugin URI: http://www.aorinevo.com/
Description: A simple GradeBook plugin
Version: 2.3.1
Author: Aori Nevo
Author URI: http://www.aorinevo.com
License: GPL
*/



define( "AN_GRADEBOOK_VERSION", "2.2.6");

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

//Create/Upgrade Database
class AN_GradeBook_Database{
	const an_gradebook_db_version = 2;
	public function __construct(){
		register_activation_hook(__FILE__,array($this,'database_setup'));	
		add_action('plugins_loaded', array($this,'an_gradebook_upgrade_db'));	
	}	
	public function an_gradebook_upgrade_db(){
		if(!get_site_option( 'an_gradebook_db_version' ) || self::an_gradebook_db_version > get_site_option( 'an_gradebook_db_version' )){
			$this->database_setup();
		}
	}
	public function database_setup() {
		global $wpdb;
	  	$db_name = 'an_gradebooks';
		if($wpdb->get_var('SHOW TABLES LIKE "'.$db_name.'"') != $db_name){
			$sql = 'CREATE TABLE ' . $db_name . ' (
			id int(11) NOT NULL AUTO_INCREMENT,
			name mediumtext NOT NULL,
			school TINYTEXT NOT NULL,
			semester TINYTEXT NOT NULL,
			year int(11) NOT NULL,
			PRIMARY KEY  (id) )';
			require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
			dbDelta($sql);
		}
		$db_name1 = 'an_gradebook';
		if($wpdb->get_var('SHOW TABLES LIKE "'.$db_name1.'"') != $db_name1){
			$sql = 'CREATE TABLE ' . $db_name1 . ' (
			id int(11) NOT NULL AUTO_INCREMENT,
			uid int(11) NOT NULL,
			gbid int(11) NOT NULL,
			PRIMARY KEY  (id) )';
		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		dbDelta($sql);
		}
		//$db_name2 should be changed to $table_name but we'll stick with this for now
		$db_name2 = 'an_assignments';
		//The column headings that should be in the an_assignments table are stored in $table_columns
		$table_columns = array('id','gbid','assign_order','assign_name','assign_date','assign_due');
		$table_columns_specs = array(
			'id' => 'int(11) NOT NULL AUTO_INCREMENT',
			'gbid' => 'int(11) NOT NULL',
			'assign_order' => 'int(11) NOT NULL',
			'assign_name' => 'mediumtext NOT NULL',
			'assign_date' => 'DATE NOT NULL DEFAULT "0000-00-00"',
			'assign_due' => 'DATE NOT NULL DEFAULT "0000-00-00"');
		if($wpdb->get_var('SHOW TABLES LIKE "'.$db_name2.'"') != $db_name2){
			$sql = 'CREATE TABLE ' . $db_name2 . ' (
			id int(11) NOT NULL AUTO_INCREMENT,
			gbid int(11) NOT NULL,
			assign_order int(11) NOT NULL,		
			assign_name mediumtext NOT NULL,
			assign_date DATE NOT NULL DEFAULT "0000-00-00",
			assign_due DATE NOT NULL DEFAULT "0000-00-00",			
			PRIMARY KEY  (id) )';
			require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
			dbDelta($sql);
		} else {
			//Otherwise, check if there is something to upgrade in an_assignments table
			$an_assignments_columns = $wpdb->get_col( "SELECT column_name FROM information_schema.columns
				WHERE table_name = 'an_assignments' ORDER BY ordinal_position" );
			$missing_columns = array_diff($table_columns, $an_assignments_columns);
			if(count($missing_columns)){
				//add missing columns
				$sql = 'ALTER TABLE an_assignments ';
				foreach ($missing_columns as $missing_column){
					$sql = $sql. 'ADD '. $missing_column .' '. $table_columns_specs[$missing_column] .', ';
				}
				$sql = rtrim(trim($sql), ',');
				$wpdb->query($sql);	
			}				
		}
 		$db_name3 = 'an_assignment';
		if($wpdb->get_var('SHOW TABLES LIKE "'.$db_name3.'"') != $db_name3){
			$sql = 'CREATE TABLE ' . $db_name3 . ' (
			id int(11) NOT NULL AUTO_INCREMENT,
			uid int(11) NOT NULL,
			gbid int(11) NOT NULL,
    	    amid int(11) NOT NULL,
	        assign_order int(11) NOT NULL,
	        assign_points_earned int(11) NOT NULL,
			PRIMARY KEY  (id) )';
			require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
			dbDelta($sql);
		}
		update_option( "an_gradebook_db_version", self::an_gradebook_db_version );
	}	
}
	function build_sorter($key) {
   		return function ($a, $b) use ($key) {
        	return strnatcmp($a[$key], $b[$key]);
	    };
	}	
	
function gradebook_check_user_role( $role, $user_id = null ) {
 
    if ( is_numeric( $user_id ) ){
	$user = get_userdata( $user_id );
	}
    else{
        $user = wp_get_current_user();
 	}
    if ( empty( $user ) ){
	return false;
	}
 
    return in_array( $role, (array) $user->roles );
}

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
		$x = $_POST['id'];
		$y = $_POST['gbid'];
		$results1 = $wpdb->delete('an_gradebook',array('uid'=>$x, 'gbid'=>$y));
		$results2 = $wpdb->delete('an_assignment',array('uid'=>$x, 'gbid'=>$y));
		if (($results1+$results2)>0){
			echo json_encode(array('0'=>$results1,'1'=>$results2));
			die();
		} else {
			echo 'failed to delete student!';
			die();
		}
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

ob_start();
?>
    <script id="edit-student-template" type="text/template">
    <div id="edit-student-form-container" class="media-modal wp-core-ui"> 
    <a class="media-modal-close" title="Close"><span class="media-modal-icon"></span></a>
    	<div class="media-modal-content">
    	    <div class="media-frame wp-core-ui">
				<div class="media-frame-menu">
					<div class="media-menu">
						<a href="#" class="media-menu-item"><%= student ? 'Edit ' : 'Create ' %>Student</a>
						<div class="separator"></div>
					</div>
				</div>    	    
    	    	<div class="media-frame-title">
    				<h1><%= student ? 'Edit ' : 'Create ' %>Student</h1>
    			</div>    
    	    	<div class="media-frame-content">
    				<form id="edit-student-form">      
         				<input type="hidden" name="action" value="<%= student ? 'update_student' : 'add_student' %>"/>
				        <input type="hidden" name="id" value="<%= student ? student.get('id') : '' %>"/>         
				        <label>First Name:</label>
				        <input type="text" name="firstname" value="<%= student ? student.get('firstname') : '' %> "/>
				        <label>Last Name:</label>
				        <input type="text" name="lastname" value="<%= student ? student.get('lastname') : '' %> "/>
				        <label>ID<%= student ? ':' : ' (if student exists in the data base, use the students id to add. Otherwise a new record will be created for this student):'%></label>
				        <%= student ? student.get('id') : '<input type="text" name="id-exists"/>' %>
				        <p/>
				        <%= student ? 'Update user ' + student.get('id') + ' from course ' + gradebook.get('id')  : 'Add to course ' + gradebook.get('id') %>?
				        <input type="hidden" name="gbid" value="<%= gradebook.get('id') %>"/>
    				</form>
    			</div>			
        		<div class="media-frame-toolbar">
    				<div class="media-toolbar">         
     					<div class="media-toolbar-secondary"></div>
     					<div class="media-toolbar-primary">
     						<button id="edit-student-save" class="button media-button button-primary button-large">Save</button>
     					</div>
       				</div>
       			</div> 
       		</div>
    	</div>  
    </div> 
    </script>    
    
    <script id="edit-assignment-template" type="text/template">
    <div id="edit-assignment-form-container" class="media-modal wp-core-ui"> 
    <a class="media-modal-close" title="Close"><span class="media-modal-icon"></span></a>
    	<div class="media-modal-content">
    	    <div class="media-frame wp-core-ui">
				<div class="media-frame-menu">
					<div class="media-menu">
						<a href="#" class="media-menu-item"><%= assignment ? 'Edit ' : 'Create ' %>Assignment</a>
						<div class="separator"></div>
					</div>
				</div>
    	    	<div class="media-frame-title">
    				<h1><%= assignment ? 'Edit ' : 'Create ' %>Assignment</h1>
    			</div>    
    	    	<div class="media-frame-content">
    				<form id="edit-assignment-form">      
        				<input type="hidden" name="action" value="<%= assignment ? 'update_assignments' : 'add_assignment' %>"/>
				        <input type="hidden" name="id" value="<%= assignment ? assignment.get('id') : '' %>"/>  
				        <label>Title:</label>
				        <input type="text" name="assign_name" value="<%= assignment ? assignment.get('assign_name') : '' %>"/>
				        <label>Date Assigned:</label>
				        <input type="text" name="assign_date" id="assign-date-datepicker" />        
				        <label>Date Due:</label>
				        <input type="text" name="assign_due" id="assign-due-datepicker" />
				        <%= assignment ? 'Update assignment ' + assignment.get('id') + ' from course ' + gradebook.get('id')  : 'Add to course ' + gradebook.get('id') %>?        
				        <input type="hidden" name="gbid" value="<%= gradebook.get('id')%>"/>
    				</form>
    			</div>    			
        		<div class="media-frame-toolbar">
    				<div class="media-toolbar">         
     					<div class="media-toolbar-secondary"></div>
     					<div class="media-toolbar-primary">
     						<button id="edit-assignment-save" class="button media-button button-primary button-large">Save</button>
     					</div>
       				</div>
       			</div> 
       		</div>
    	</div>  
    </div> 
    </script>    
    
    <script id="edit-course-template" type="text/template">
    <div id="edit-course-form-container" class="media-modal wp-core-ui"> 
    <a class="media-modal-close" title="Close"><span class="media-modal-icon"></span></a>
    	<div class="media-modal-content">
    	    <div class="media-frame wp-core-ui">
    	    	<div class="media-frame-title">
    				<h1><%= course ? 'Edit ' : 'Create ' %> Course</h1>
    			</div>    
				<div class="media-frame-menu">
					<div class="media-menu">
						<a href="#" class="media-menu-item"><%= course ? 'Edit ' : 'Create ' %>Course</a>
						<div class="separator"></div>
					</div>
				</div>       			
    	    	<div class="media-frame-content">
    				<form id="edit-course-form">      
        				<input type="hidden" name="action" value="<%= course ? 'update_course' : 'add_course' %>"/>
        				<input type="hidden" name="id" value="<%= course ? course.get('id') : '' %>"/>        
        				<label>Course Name:</label>
        				<input type="text" name="name" value="<%= course ? course.get('name') : '' %>"/>
        				<label>School:</label>
        				<input type="text" name="school" value="<%= course ? course.get('school') : '' %>"/>
        				<label>Semester:</label>
        				<input type="text" name="semester" value="<%= course ? course.get('semester') : '' %>"/>
        				<label>Year:</label>
        				<input type="text" name="year" value="<%= course ? course.get('year') : '' %>"/>
    				</form>
    			</div>    			
        		<div class="media-frame-toolbar">
    				<div class="media-toolbar">         
     					<div class="media-toolbar-secondary"></div>
     					<div class="media-toolbar-primary">
     						<button id="edit-course-save" class="button media-button button-primary button-large">Save</button>
     					</div>
       				</div>
       			</div> 
       		</div>
    	</div>  
    </div> 
    </script>
    
    <script id="gradebook-interface-template" type="text/template">
    <hr/>
    <div id="gradebook-interface-buttons-container">
    <button type="button" id="add-student" class="wp-core-ui button">Add Student</button>
    <button type="button" id="edit-student" class="wp-core-ui button">Edit Student</button>  
    <button type="button" id="delete-student" class="wp-core-ui button">Delete Student</button>
    <button type="button" id="add-assignment" class="wp-core-ui button">Add Assignment</button>
    <button type="button" id="edit-assignment" class="wp-core-ui button">Edit Assignment</button>  
    <button type="button" id="delete-assignment" class="wp-core-ui button">Delete Assignment</button>
    </div>    
    <hr/>
    <table id="an-gradebook-container" class="wp-list-table widefat fixed pages">  
    <thead id="students-header">
      <tr>
        <th><div><span>First Name</span> <span class="sorting-indicator"></span> </div></th><th>Last Name</th><th>ID</th>
      </tr>
    </thead>
    <tbody id="students"></tbody>
    </table>
    <div id="chart-container">
    	<div id="chart_div"></div>
    </div>
    </script>

    <script id="student-gradebook-interface-template" type="text/template">   
    <hr/>
    <table id="an-gradebook-container" class="wp-list-table widefat fixed pages">  
    <thead id="students-header">
      <tr>
        <th>First Name</th><th>Last Name</th><th>ID</th>
      </tr>
    </thead>
    <tbody id="students"></tbody>
    </table>
    </script>    
    
    <script id="courses-interface-template" type="text/template">
    <div id="courses-interface-buttons-container">
    <button id="add-course" class="wp-core-ui button">Add Course</button>        
    <button id="edit-course" class="wp-core-ui button">Edit Course</button>    
    <button id="delete-course" class="wp-core-ui button">Delete Course</button>         
    </div> 
    <hr/>       
    <table id="an-courses-container" class="wp-list-table widefat fixed pages">  
       <thead>
        <tr>
            <th>ID</th><th>Course</th><th>School</th><th>Semester</th><th>Year</th>
        </tr>
       </thead>
       <tbody id="courses">
       </tbody>
      </table>
    </script>

    <script id="student-courses-interface-template" type="text/template">    
    <table id="an-courses-container" class="wp-list-table widefat fixed pages">  
       <thead>
        <tr>
            <th>ID</th><th>Course</th><th>School</th><th>Semester</th><th>Year</th>
        </tr>
       </thead>
       <tbody id="courses">
       </tbody>
      </table>
    </script>    
    

<?php

$mytemplates = ob_get_contents();
ob_get_clean();

echo $mytemplates;

echo '<div class="wrap"><h2>GradeBooks</h2><div id="an-gradebooks">
	</div></div>';
	} elseif (get_current_user_id()>0 && !gradebook_check_user_role('administrator')){
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
    


    <script id="student-courses-interface-template" type="text/template">    
    <table id="an-courses-container" class="wp-list-table widefat fixed pages">  
       <thead>
        <tr>
            <th>ID</th><th>Course</th><th>School</th><th>Semester</th><th>Year</th>
        </tr>
       </thead>
       <tbody id="courses">
       </tbody>
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