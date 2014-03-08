<?php
/*
Plugin Name: GradeBook
Plugin URI: http://www.aorinevo.com/
Description: A simple GradeBook plugin
Version: 2.0.5
Author: Aori Nevo
Author URI: http://www.aorinevo.com
License: GPL
*/
/*icons courtesy Iconic: created and is maintained primarily by P.J. Onori (www.github.com/somerandomdude)*/

define( 'GRADEBOOK_URL', plugin_dir_url(__File__) );


/**************/
/* Load files */
/**************/

class AN_GradeBook_Scripts{
	public function __construct(){
		add_action('wp_enqueue_scripts', array($this,'scripts'));		
	}
	public function scripts(){
		wp_register_style( 'GradeBook_css', plugins_url('GradeBook.css',__File__), false, false );
		wp_enqueue_style( 'GradeBook_css');  
	
    	wp_enqueue_script( 'backbone' );
    	wp_enqueue_script( 'underscore' );	
		wp_enqueue_script( 'jquery1.11.0', plugins_url('jquery-1.11.0.min.js',__File__),array('json2'),false,false); 
		wp_enqueue_script( 'jquery-ui-button', array('jquery2.0') );			
		wp_enqueue_script( 'jquery-ui-datepicker', array('jquery2.0') );		
	
		if (gradebook_check_user_role('administrator')){	
			wp_register_script( 'GradeBook_js', plugins_url('GradeBook.js',__File__),array( 'jquery1.11.0', 'backbone','underscore' ), false, true );
			wp_enqueue_script('GradeBook_js');
			wp_localize_script( 'GradeBook_js', 'ajax_object', array( 'ajax_url' => admin_url( 'admin-ajax.php' )) );	
 		}
	}
}

class AN_GradeBook_Database{
	public function __construct(){
		register_activation_hook(__FILE__,array($this,'database_setup'));		
	}	
	public function database_setup() {
		global $wpdb;
	  	$db_name = 'an_gradebooks';
		if($wpdb->get_var('SHOW TABLES LIKE' . $db_name) != $db_name){
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
		if($wpdb->get_var('SHOW TABLES LIKE' . $db_name1) != $db_name1){
			$sql = 'CREATE TABLE ' . $db_name1 . ' (
			id int(11) NOT NULL AUTO_INCREMENT,
			uid int(11) NOT NULL,
			gbid int(11) NOT NULL,
			PRIMARY KEY  (id) )';
		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		dbDelta($sql);
		}
		$db_name2 = 'an_assignments';
		if($wpdb->get_var('SHOW TABLES LIKE' . $db_name2) != $db_name2){
			$sql = 'CREATE TABLE ' . $db_name2 . ' (
			id int(11) NOT NULL AUTO_INCREMENT,
			gbid int(11) NOT NULL,
			assign_order int(11) NOT NULL,		
			assign_name mediumtext NOT NULL,
			PRIMARY KEY  (id) )';
			require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
			dbDelta($sql);
		}
 		$db_name3 = 'an_assignment';
		if($wpdb->get_var('SHOW TABLES LIKE' . $db_name3) != $db_name3){
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
		add_action('wp_ajax_add_student', array($this,'add_student'));
		add_action('wp_ajax_update_student', array($this, 'update_student'));
		add_action('wp_ajax_add_course', array($this, 'add_course'));
		add_action('wp_ajax_update_course', array($this, 'update_course'));
		add_action('wp_ajax_get_courses', array($this, 'get_courses'));
		add_action('wp_ajax_delete_course', array($this, 'delete_course'));
		add_action('wp_ajax_delete_student', array($this, 'delete_student'));
		add_action('wp_ajax_get_students', array($this, 'get_students'));
		add_action('wp_ajax_get_assignments',array($this, 'get_assignments'));
		add_action('wp_ajax_update_assignments', array($this, 'update_assignments'));
		add_action('wp_ajax_get_assignment', array($this, 'get_assignment'));
		add_action('wp_ajax_delete_assignment', array($this, 'delete_assignment'));
		add_action('wp_ajax_update_assignment', array($this, 'update_assignment'));
		add_action('wp_ajax_add_assignment', array($this,'add_assignment'));	
	}

	public function add_student(){	
    	global $wpdb;
    	$wpdb->show_errors(); 
		if (!gradebook_check_user_role('administrator')){	
			echo json_encode(array("status" => "Not Allowed."));
			die();
		}       
		$result = wp_insert_user(array(
			'user_login' => 'user_login',
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
				array('uid' => $result,'gbid' => $_POST['gbid']), 
				array('%d','%d') 
			);
			$assignments = $wpdb->get_results('SELECT * FROM an_assignment WHERE uid = '. $result, ARRAY_A);			
			usort($assignments, build_sorter('assign_order'));
			echo json_encode(array(
	      		student=> array(firstname => $studentDetails -> first_name,
	      		lastname => $studentDetails -> last_name,
	      		gbid => strval($_POST['gbid']),
	      		id => strval($result)),
	      		assignment => $assignments
			));
			die();
		}else{
			echo $result->get_error_message();
			die();
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
			student=> array(firstname => $studentDetails -> first_name,
	    	lastname => $studentDetails -> last_name,
	    	id => strval($result))
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
  $results1 = $wpdb->delete('an_gradebook',array('uid'=>$x));
  $results2 = $wpdb->delete('an_assignment',array('uid'=>$x));
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
          'gbid' => $_GET['gbid']
        );
    }
    echo json_encode($studentIDs);
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
	array( 'assign_name' => $_POST['assign_name']),
	array('id' => $_POST['id'] )
   );   
   $assignmentDetails = $wpdb->get_row('SELECT * FROM an_assignments WHERE id = '. $_POST['id'] , ARRAY_A);
   echo json_encode($assignmentDetails);
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
					'gbid' => $_POST['gbid'],
					'assign_order'=> $assignOrder
				), 
				array( 
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
	$assignmentStudents = $wpdb->get_results("SELECT * FROM an_assignment WHERE amid = $assignID", ARRAY_A);
	
	$data = array("assignmentDetails"=>$assignmentDetails,
			"assignmentStudents"=>$assignmentStudents);
	echo json_encode($data);
	die();
}
}

$an_gradebook_scripts = new AN_GradeBook_Scripts();
$an_gradebook_database = new AN_GradeBook_Database();
$an_gradebookapi = new AN_GradeBookAPI();

function GradeBook_shortcode(){

if (gradebook_check_user_role('administrator')){	

ob_start();
?>
    <script id="edit-student-template" type="text/template">
    <div id="edit-student-form-container">    
    <form id="edit-student-form">
       <legend><%= student ? 'Edit ' : 'Create ' %>Student</legend>
    <hr/>       
        <input type="hidden" name="action" value="<%= student ? 'update_student' : 'add_student' %>"/>
        <input type="hidden" name="id" value="<%= student ? student.get('id') : '' %>"/>         
        <label>First Name:</label>
        <input type="text" name="firstname" value="<%= student ? student.get('firstname') : '' %> "/>
        <label>Last Name:</label>
        <input type="text" name="lastname" value="<%= student ? student.get('lastname') : '' %> "/>
        <%= student ? 'Update user ' + student.get('id') + ' from course ' + gradebook.get('id')  : 'Add to course ' + gradebook.get('id') %>?
        <input type="hidden" name="gbid" value="<%= gradebook.get('id') %>"/>
    <hr/>       
     <button type="submit" id="edit-student-save">Save</button><button type="submit" id="edit-student-cancel">Cancel</button>          
    </form>
    </div>    
    </script>
    
    <script id="edit-assignment-template" type="text/template">
    <div id="edit-assignment-form-container">    
    <form id="edit-assignment-form">
       <legend><%= assignment ? 'Edit ' : 'Create ' %>Assignment</legend>    
        <hr />
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
    <hr/>       
     <button type="submit" id="edit-assignment-save">Save</button><button type="submit" id="edit-assignment-cancel">Cancel</button>     
    </form>
    </div>    
    </script>
    
    <script id="edit-course-template" type="text/template">
    <div id="edit-course-form-container">
    <form id="edit-course-form">
       <legend><%= course ? 'Edit ' : 'Create ' %> Course</legend>
    <hr />       
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
    <hr/>       
     <button type="submit" id="edit-course-save">Save</button><button type="submit" id="edit-course-cancel">Cancel</button>     
    </form>
    </div>
    </script>
    
    <script id="gradebook-interface-template" type="text/template">
    <div id="gradebook-interface-buttons-container">
    <button type="button" id="add-student">Add Student</button>
    <button type="button" id="edit-student">Edit Student</button>  
    <button type="button" id="delete-student">Delete Student</button>
    <button type="button" id="add-assignment">Add Assignment</button>
    <button type="button" id="edit-assignment">Edit Assignment</button>  
    <button type="button" id="delete-assignment">Delete Assignment</button>
    </div>    
    <hr/>
    <table id="an-gradebook-container">  
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
    <button type="button" id="add-course">Add Course</button>
    <button type="button" id="edit-course">Edit Course</button>
    <button type="button" id="delete-course">Delete Course</button>
    </div>    
    <table id="an-courses-container">  
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

echo '<div id="an-gradebooks">
	</div>';
	} else {
echo 'You do not have premissions to view this GradeBook.';
}	
}
add_shortcode( 'GradeBook', 'GradeBook_shortcode' );


?>