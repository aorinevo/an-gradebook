<?php
/*
Plugin Name: GradeBook
Plugin URI: http://www.aorinevo.com/
Description: A simple GradeBook plugin
Version: 1.2
Author: Aori Nevo
Author URI: http://www.aorinevo.com
License: GPL
*/
/*icons courtesy Iconic: created and is maintained primarily by P.J. Onori (www.github.com/somerandomdude)*/

define( 'GRADEBOOKS_URL', plugin_dir_url(__File__) );

class GBUser {
	
	protected $_id;
	
	public function __construct($id) {
		$this->_id = $id;
	}
	
	public function isAdmin() {
		if ($this->_id == 1) {
			return true;
		}
		
		return false;
	}
	
	public function verifyAdmin() {
		if (!$this->isAdmin()) {
			$result = array("status" => "Not Allowed.");
			echo json_encode($result);
			die();
		}
	}
}

function GradeBook_options_install() {
	
	global $wpdb;
  	$db_name = $wpdb->prefix . 'GradeBook_courses';
 
	if($wpdb->get_var('SHOW TABLES LIKE' . $db_name) != $db_name) 
	{
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
 
}
// run the install scripts upon plugin activation
register_activation_hook(__FILE__,'GradeBook_options_install');

/***************************************************************/
/* Load javascript files: jEditable, jQuery-ui, and GradeBook  */
/* Load css files: jQuery-ui and GradeBook                     */
/***************************************************************/

function register_css_and_js_files(){
global $wpdb;
	wp_register_script( 'GradeBook_jquery_editable_js', plugins_url('jquery.jeditable.js',__File__), false, false);
	wp_enqueue_script( 'jquery', array('json2') );	
	wp_enqueue_script( 'GradeBook_jquery_editable_js', array('jquery'));
	wp_enqueue_script( 'jquery-ui-core', array('jquery') );	
	
	wp_register_style( 'GradeBook_jquery-ui_css', 'http://code.jquery.com/ui/1.9.2/themes/base/jquery-ui.css', false, false );
	wp_register_style( 'GradeBook_css', plugins_url('GradeBook.css',__File__), false, false );
	
	wp_enqueue_style( 'GradeBook_jquery-ui_css');
	wp_enqueue_style( 'GradeBook_css');  
	
	if(1 == wp_get_current_user()->ID){		
	wp_enqueue_script( 'GradeBook_js',
		plugins_url('GradeBook.js',__File__),
		array( 'jquery', 'GradeBook_jquery_editable_js' ), false, true );
	wp_localize_script( 'GradeBook_js', 'ajax_object',
            array( 'ajax_url' => admin_url( 'admin-ajax.php' )) );	
	}else{
	wp_enqueue_script( 'GradeBook_student_js',
		plugins_url('GradeBook_student.js',__File__),
		array( 'jquery' ), false, true);
	wp_localize_script( 'GradeBook_student_js', 'ajax_object',
            array( 'ajax_url' => admin_url( 'admin-ajax.php' )) );
	}
}
add_action('wp_enqueue_scripts', 'register_css_and_js_files');

function get_pie_chart_callback(){
	global $wpdb;
	
	$pie_chart_data = $wpdb->get_col("SELECT assign_". $_GET['assign_id'] ." FROM wp_GradeBook_". $_GET['course_id']);
	$pie_chart_name = $wpdb->get_col("SELECT name FROM wp_GradeBook_assignments_". $_GET['course_id'] ." WHERE assign_id = ".$_GET['assign_id']);	
	
	function isA($n){
		if( $n>=90){
			return true;
		} else {
			return false;
		}
	}
	function isB($n){
		if( $n>=80 && $n<90){
			return true;
		} else {
			return false;
		}
	}
	function isC($n){
		if( $n>=70 && $n<80){
			return true;
		} else {
			return false;
		}
	}
	function isD($n){
		if( $n>=60 && $n<70){
			return true;
		} else {
			return false;
		}
	}
	function isF($n){
		if( $n<60){
			return true;
		} else {
			return false;
		}
	}
	
	$is_A = count(array_filter( $pie_chart_data, 'isA'));
	$is_B = count(array_filter( $pie_chart_data, 'isB'));
	$is_C = count(array_filter( $pie_chart_data, 'isC'));
	$is_D = count(array_filter( $pie_chart_data, 'isD'));	
	$is_F = count(array_filter( $pie_chart_data, 'isF'));	
	
	$output = array(
		"pie_chart_data" => $pie_chart_data,
		"pie_chart_name" => $pie_chart_name,
		"num" => array($is_A,$is_B,$is_C,$is_D,$is_F)
	);

	echo json_encode($output);
	die();
}
add_action('wp_ajax_get_pie_chart','get_pie_chart_callback');

function get_table_data_callback(){
	global $wpdb;
	
	$assign_id = $wpdb->get_col("SELECT assign_id FROM wp_GradeBook_assignments_". $_GET['course_id']);
	$assign_data = $wpdb->get_results("SELECT * FROM wp_GradeBook_assignments_". $_GET['course_id'],ARRAY_N);
	$acolumn_ids = array();
	for ($i=0; $i < count($assign_id); $i++){
		$acolumn_ids[$i]= 'assign_'. $assign_id[$i];
	}
	$a1 = array('comment_ID', 'user_ID', 'first_name', 'last_name');
	$acolumn_ids = array_merge( $a1, $acolumn_ids);
	$column_ids = implode(",",$acolumn_ids);
	
	
	$table_data = $wpdb->get_results("SELECT ". $column_ids ." FROM wp_GradeBook_". $_GET['course_id'] ,ARRAY_N);
	$number_of_rows = $wpdb->get_var("SELECT FOUND_ROWS()");	
	
	$column_names = $wpdb->get_col("SELECT name FROM wp_GradeBook_assignments_". $_GET['course_id']);
	$a2 = array('ID', 'user ID', 'first name', 'last name');
	$acolumn_names = array_merge( $a2, $column_names);
	$column_names = implode(",",$acolumn_names);
	
	$output = array(
		"column_ids" => $acolumn_ids,
		"column_names" => $acolumn_names,
	        "table_data" => $table_data,
	        "number_of_rows" => $number_of_rows,
	        "assign_data" => $assign_data
	);

	echo json_encode($output);
	die();
}
add_action('wp_ajax_get_table_data','get_table_data_callback');

function add_course_callback() {
	
	global $wpdb;
	
	$user = new GBUser(wp_get_current_user()->ID);
	$user->verifyAdmin();
	
	$aColumns = $wpdb->get_col( 
     	"SELECT column_name
	FROM information_schema.columns
	WHERE table_name = 'wp_GradeBook_courses'                 
	ORDER BY ordinal_position" );
        
	$wpdb->insert( 
		'wp_GradeBook_courses', 
			array( 
				'name' => $_GET['course_name'], 
				'school' => $_GET['course_school'],
				'semester' => $_GET['course_semester'],
				'year' => $_GET['course_year']
			), 
			array( 
				'%s', 
				'%s',
				'%s',
				'%d' 
			) 
		);
		
	$output = $wpdb->get_row("SELECT * FROM wp_GradeBook_courses WHERE id = LAST_INSERT_ID()", ARRAY_N);
	
	$your_db_name1 = $wpdb->prefix . 'GradeBook_'. $wpdb->insert_id;
 
	if($wpdb->get_var('SHOW TABLES LIKE ' . $your_db_name1) != $your_db_name1) 
	{
		$sql = 'CREATE TABLE ' . $your_db_name1 . ' (
		comment_ID bigint(2) NOT NULL AUTO_INCREMENT,
		user_ID int(11) NOT NULL,
		last_name TINYTEXT NOT NULL,
		first_name TINYTEXT NOT NULL,		
		PRIMARY KEY  (comment_ID) )';
 
		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		dbDelta($sql);
	}

	$your_db_name2 = $wpdb->prefix . 'GradeBook_assignments_'. $wpdb->insert_id;	
 
	if($wpdb->get_var('SHOW TABLES LIKE ' . $your_db_name2) != $your_db_name2) 
	{
		$sql = 'CREATE TABLE ' . $your_db_name2 . ' (
		assign_id int(11) NOT NULL AUTO_INCREMENT,
		name TINYTEXT NOT NULL,		
		assigned_on DATE NOT NULL,
		due_date DATE NOT NULL,
		PRIMARY KEY  (assign_id) )';
 
		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		dbDelta($sql);
	}	
	
	

	
	echo json_encode($output);
	die();
}
add_action('wp_ajax_add_course', 'add_course_callback');

function edit_course_callback(){
	global $wpdb;

	$sTable = "wp_GradeBook_courses";
		
	$aColumns = $wpdb->get_col( 
     	"SELECT column_name
	FROM information_schema.columns
	WHERE table_name = '$sTable' 
	ORDER BY ordinal_position" );
	

	$wpdb->update( 
		$sTable, 
		array( 
			$aColumns[$_POST['colIndex']] => $_POST['value']
		), 
		array( 'id' => $_POST['course_id'] ), 
		array( 
			'%s'
		)
	);
	echo $_POST['value'];
	die();
}
add_action('wp_ajax_edit_course', 'edit_course_callback');

function delete_course_callback(){
	global $wpdb;
	
	$user = new GBUser(wp_get_current_user()->ID);
	$user->verifyAdmin();
	
	require_once($_SERVER['DOCUMENT_ROOT'].'/wp-admin/includes/user.php');
	
	$course_name = 'wp_GradeBook_'. $_GET['course_id'];
	$ids = $wpdb->get_col("SELECT user_ID FROM $course_name");
	for($i=0; $i<count($ids); $i++){
		$x = get_user_meta($ids[$i],'courses',true);
		$y = count($x);
		if ($y==1){
			wp_delete_user( $ids[$i]);
		} else {
		function evalstr ($q) { 
			if ($q != $_GET['course_id']) { 
        			return true;
    			} else { 
    				return false;
    			}
		}
	
		$z = array_values(array_filter($x, "evalstr"));
		update_user_meta($ids[$i],'courses',$z);
		}
	}
	
	$wpdb->query( 
		$wpdb->prepare( 
			"
			DELETE FROM wp_GradeBook_courses
			WHERE id = %d
			",
	        	$_GET['course_id']
        	)
	);
	
	$wpdb->query($wpdb->prepare("DROP TABLE wp_GradeBook_%d", $_GET['course_id']));
	$wpdb->query($wpdb->prepare("DROP TABLE wp_GradeBook_assignments_%d", $_GET['course_id']));
	die();
}
add_action('wp_ajax_delete_course','delete_course_callback');

function add_assignment_callback(){
	global $wpdb;
	
	$user = new GBUser(wp_get_current_user()->ID);
	$user->verifyAdmin();

	$wpdb->query("INSERT 
		INTO wp_GradeBook_assignments_". 
		$_GET['course_id'].
		" (assign_id, name, assigned_on, due_date) 
		VALUES (NULL , '". 
		$_GET['assignment_name'] .
		"' , '". 
		$_GET['assigned_on'] .
		"' , '". 
		$_GET['assignment_due_date'] .
		"' );"
	);
	
	
	$assignment_name = $_GET['assignment_name'];
	$assign_id = 'assign_'. $wpdb->insert_id;	
	
	$wpdb->query("ALTER TABLE wp_GradeBook_". 
		$_GET['course_id'] .
		" ADD $assign_id DECIMAL(5,2) DEFAULT 0"
	); 
	
	echo json_encode( Array( 'assign_id' => $assign_id, 'assignment_name' => $assignment_name, 'assignment_due_date'=> $_GET['assignment_due_date'] ));
	die();
}
add_action('wp_ajax_add_assignment','add_assignment_callback');

function delete_assignment_callback(){
	global $wpdb;
	
	$user = new GBUser(wp_get_current_user()->ID);
	$user->verifyAdmin();
	
	$wpdb->show_errors();
	$wpdb->query("ALTER TABLE wp_GradeBook_". $_GET['course_id'] ." DROP ". $_GET['assignment_name'] );
	$wpdb->query("DELETE FROM wp_GradeBook_assignments_". $_GET['course_id'] ." WHERE assign_id = ". $_GET['assign_id']);
	die();
}
add_action('wp_ajax_delete_assignment','delete_assignment_callback');


function add_student_callback(){
	global $wpdb;
	
	$user = new GBUser(wp_get_current_user()->ID);
	$user->verifyAdmin();
	
	$wpdb->show_errors();

	$x = username_exists($_GET['user_login']);
	if (!$x){
	$result = wp_insert_user( array(
			'user_login' => $_GET['user_login'],
			'user_email' => $_GET['user_email'],
			'first_name' => $_GET['first_name'],
			'last_name'  => $_GET['last_name'],
			'user_pass'  => $_GET['password']
		) 
	);
	$wpdb->insert( 
				'wp_GradeBook_'. $_GET['course_id'], 
				array( 
					'first_name' => $_GET['first_name'], 
					'last_name' => $_GET['last_name'],
					'user_ID' => $result
				), 
				array( 
					'%s', 
					'%s',
					'%d' 
				) 
			);
	update_user_meta($result, 'courses', array($_GET['course_id']));
	$assign_id = $wpdb->get_col("SELECT assign_id FROM wp_GradeBook_assignments_". $_GET['course_id']);
	$acolumn_ids = array();
	for ($i=0; $i < count($assign_id); $i++){
		$acolumn_ids[$i]= 'assign_'. $assign_id[$i];
	}
	$a1 = array('comment_ID', 'user_ID', 'first_name', 'last_name');
	$acolumn_ids = array_merge( $a1, $acolumn_ids);
	$column_ids = implode(",",$acolumn_ids);
	
	$output = $wpdb->get_row("SELECT ". $column_ids ." FROM wp_GradeBook_". $_GET['course_id'] ." WHERE user_ID = ". $result, ARRAY_N);		

	} else {	
		$wpdb->insert('wp_GradeBook_'. $_GET['course_id'], 
				array( 
					'first_name' => get_user_meta($x,'first_name',true), 
					'last_name' => get_user_meta($x,'last_name',true),
					'user_ID' => $x
				), 
				array( 
					'%s', 
					'%s',
					'%d' 
				) 
			);
			
		function iden ($value) {
    			return $value;
		}
    		$current_courses = get_user_meta( $x,'courses',true ) ;
    		if(is_array($current_courses)){
  		array_push( $current_courses, $_GET['course_id'] );
  			update_user_meta( $x, 'courses', $current_courses );
  		} else {
  			update_user_meta( $x, 'courses', array($_GET['course_id']) );
  		}
  		
  	$assign_id = $wpdb->get_col("SELECT assign_id FROM wp_GradeBook_assignments_". $_GET['course_id']);
	$acolumn_ids = array();
	for ($i=0; $i < count($assign_id); $i++){
		$acolumn_ids[$i]= 'assign_'. $assign_id[$i];
	}
	$a1 = array('comment_ID', 'user_ID', 'first_name', 'last_name');
	$acolumn_ids = array_merge( $a1, $acolumn_ids);
	$column_ids = implode(",",$acolumn_ids);
	
	$output = $wpdb->get_row("SELECT ". $column_ids ." FROM wp_GradeBook_". $_GET['course_id'] ." WHERE user_ID = ". $x, ARRAY_N);			
	}
	echo json_encode( $output );
	die();
}
add_action('wp_ajax_add_student','add_student_callback');

function edit_student_callback(){
	global $wpdb;
	
	$user = new GBUser(wp_get_current_user()->ID);
	$user->verifyAdmin();
	
	$wpdb->show_errors();

	/* DB table to use */
	$sTable = "wp_GradeBook_". $_POST['course_id'];
		
	

	$wpdb->update( 
		$sTable, 
		array( 
			$_POST['column_id'] => $_POST['value']
		), 
		array( 'comment_ID' => $_POST['comment_ID'] ), 
		array( 
			'%s'
		)
	);


	echo $_POST['value'];
	die();
}
add_action('wp_ajax_edit_student', 'edit_student_callback');

function delete_student_callback(){
	global $wpdb;
	
	$user = new GBUser(wp_get_current_user()->ID);
	$user->verifyAdmin();
	
	$wpdb->show_errors();
	
	$course_name = 'wp_GradeBook_'. $_GET['course_id'];
	$x = get_user_meta($_GET['user_id'],'courses',true);
	$y = count($x);
	if ($y==1||$y==0){
		$wpdb->query( 
			$wpdb->prepare( 
				"
				DELETE FROM $course_name
				WHERE comment_ID = %d
				",
	     		   	$_GET['comment_ID']
        		)
		);
		wp_delete_user( $_GET['user_id']);
	} else {
		$wpdb->query( 
			$wpdb->prepare( 
				"
				DELETE FROM $course_name
				WHERE comment_ID = %d
				",
	        		$_GET['comment_ID']
        		)
		);
		function evalstr ($q) { 
			if ($q != $_GET['course_id']) { 
        			return true;
    			} else { 
    				return false;
    			}
		}
	
		$z = array_values(array_filter($x, "evalstr"));
		if(count($z)==0){
			wp_delete_user( $_GET['user_id'] );
		} else {
			update_user_meta($_GET['user_id'],'courses',$z);
		}
	}
	die();
}
add_action('wp_ajax_delete_student','delete_student_callback');

function get_assign_data_callback(){
	global $wpdb;
	
	$user = new GBUser(wp_get_current_user()->ID);
	$user->verifyAdmin();
	
	$wpdb->show_errors();

	/* DB table to use */
	$sTable = "wp_GradeBook_assignments_". $_GET['course_id'];	
	$output=$wpdb->get_results('SELECT * FROM '. $sTable, ARRAY_N);
	echo json_encode(array('data'=>$output,'num_rows' => $wpdb->num_rows));
	die();
}
add_action('wp_ajax_get_assign_data', 'get_assign_data_callback');

function GradeBook_shortcode(){
	global $wpdb;
	
	$cColumns = $wpdb->get_col( 
     	"SELECT column_name
	FROM information_schema.columns
	WHERE table_name = 'wp_GradeBook_courses'                 
	ORDER BY ordinal_position" );
	
	$cResults = $wpdb->get_results("SELECT * FROM wp_GradeBook_courses" ,ARRAY_N);
	$cNum_rows = $wpdb->get_var("SELECT FOUND_ROWS()");
	$Course_ids = array();
	for($i=0;$i < $cNum_rows; $i++){
	    array_push($Course_ids, $cResults[$i][0]);	
	}
	$nCourse_ids = count($Course_ids);


	ob_start();

	$current_user = wp_get_current_user();
	
    	if(1==$current_user-> ID){
    	

?>

<br/>
<p>
</p>




<div id="add-course-form" title="Add a Course">
    <p class="validateTips">All form fields are required.</p>
 
    <form>
    <fieldset>
        <label for="course_name">Course Name: </label>
		<input type="text" name="course_name" id="course_name" class="text ui-widget-content ui-corner-all" />
	<label for="course_school">School: </label>
        	<input type="text" name="course_school" id="course_school" class="text ui-widget-content ui-corner-all" />
	<label for="course_semester">Semester: </label>
		<input type="text" name="course_semester" id="course_semester" class="text ui-widget-content ui-corner-all" />
        <label for="course_year">Year: </label>
		<input type="text" name="course_year" id="course_year" value="" class="text ui-widget-content ui-corner-all" />
    </fieldset>
    </form>
</div>

<div id="delete-course-confirm" title="Delete Course">
    <p><span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 20px 0;"></span> This course will be permanently deleted and cannot be recovered. Are you sure?</p>
</div>


<button id="add-course">
	<?php
		echo '<img id="icon_add_course" src='. GRADEBOOKS_URL .'icons/book_alt_32x32.png style="opacity:.5;" > ';
	?>
		Add Course
</button> <button id="delete-course">
	<?php
		echo '<img id="icon_delete_course" src='. GRADEBOOKS_URL .'icons/trash_stroke_32x32.png style="opacity:.5;" > ';
	?>
		Delete Course
</button>

<table id="GradeBook_courses" border="0" cellpadding="0" cellspacing="0">
    <thead>
        <tr>
		<th style="width:5%">ID</th>
		<th style="width:50%">Name</th>
		<th style="width: 15%">School</th>
		<th style="width: 15%">Semester</th>
		<th style="width:15%">Year</th>
        </tr>
    </thead>
    <tbody>
            <?php
		for ($i=1; $i<=$cNum_rows; $i++){
			if( $i%2){
				echo "<tr class = 'even'>";
			} else {
				echo "<tr class = 'odd'>";
			}
			echo "<td class='noteditable'>". $cResults[$i-1][0] ."</td>";
			for ($j=1; $j<count($cColumns); $j++){
				echo "<td>". $cResults[$i-1][$j] ."</td>";
				}
			echo "</tr>";
		}
	     ?>	
    </tbody>
</table>


<div id="add-student-form" title="Add a Student">
    <p class="validateTips">All form fields are required.</p>
 
    <form>
    <fieldset>
        <label for="user_login">User Login: </label>
		<input type="text" name="user_login" id="user_login" class="text ui-widget-content ui-corner-all" />
	<label for="user_login">First Name: </label>
        	<input type="text" name="first_name" id="first_name" class="text ui-widget-content ui-corner-all" />
	<label for="last_name">Last Name: </label>
		<input type="text" name="last_name" id="last_name" class="text ui-widget-content ui-corner-all" />
        <label for="email">Email</label>
		<input type="text" name="email" id="email" value="" class="text ui-widget-content ui-corner-all" />
        <label for="password">Password</label>
		<input type="password" name="password" id="password" value="" class="text ui-widget-content ui-corner-all" />
    </fieldset>
    </form>
</div>

<div id="add-assignment-form" title="Assignment Information">
    <p class="validateTips">All form fields are required.</p>
 
    <form>
    <fieldset>
       <label for="assignment_name">Title: </label>
		<input type="text" name="assignment_name" id="assignment_name" class="text ui-widget-content ui-corner-all" />
       <label for="assigned_on">Date Assigned: </label>
		<input type="text" id="datepicker_assigned_on" />		
       <label for="assignment_due_date">Date Due: </label>
		<input type="text" id="datepicker_assignment_due_date" />
    </fieldset>
    </form>
</div>


<div id="delete-student-confirm" title="Delete Student">
    <p><span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 20px 0;"></span> This student will be permanently deleted and cannot be recovered. Are you sure?</p>
</div>

<div id="delete-assignment-confirm" title="Delete Assignment">
    <p><span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 20px 0;"></span> This assignment will be permanently deleted and cannot be recovered. Are you sure?</p>
</div>

 
 
<hr/>

<div id="CRUD-students" style = "display: none;">
<button id="add-student" >
	<?php
		echo '<img id="icon_add_student" src='. GRADEBOOKS_URL .'icons/user_24x32.png style="opacity:.5;" > ';
	?>
	Add Student
</button> 
<button id="delete-student" >
	<?php
		echo '<img id="icon_delete_student" src='. GRADEBOOKS_URL .'icons/trash_stroke_32x32.png style="opacity:.5;" > ';
	?>
		Delete Student
</button>
<button id="add-assignment" >
	<?php
		echo '<img id="icon_add_assignment" src='. GRADEBOOKS_URL .'icons/pin_32x32.png style="opacity:.5;" > ';
	?>
		Add Assignment
</button> 
<button id="delete-assignment" >
	<?php
		echo '<img id="icon_delete_assignment" src='. GRADEBOOKS_URL .'icons/document_stroke_32x32.png style="opacity:.5;" > ';
	?>
		Delete Assignment
</button> 
</div>


<?php
echo "<div id='GradeBook_container'>";
for($i = 0; $i < $nCourse_ids; $i++){
	echo 	"<table  id='wp_GradeBook_$Course_ids[$i]' class='GradeBook_students' ".
		"border='0' cellpadding='0' cellspacing='0' style = 'display: none;' >" .
			"<thead>".
				"<tr>" .
				"</tr>" .
			"</thead>" .
			"<tbody>" .
			"</tbody>" .
		"</table>";	
}
echo "</div>";
?>

<br/>


<?php
	
    $output_string=ob_get_contents();
    ob_end_clean();

    }elseif (is_user_logged_in()&& 1!=$current_user->ID)
    { 

    ob_start();

    $GradeBook_user_ID = $current_user->ID;

	$x = get_user_meta($GradeBook_user_ID,'courses',true);
	$student_data = array();
	$column_names = array();
	$column_names_and_ids = array();
	$column_assign_ids = array();
	$course_data = array();
	for ($i = 0; $i < count($x); $i++){
		$course_data[$i] = $wpdb->get_row("SELECT * FROM wp_GradeBook_courses WHERE id = ".$x[$i] ,ARRAY_N);
		$column_names[$i] = $wpdb->get_col("SELECT name FROM wp_GradeBook_assignments_". $x[$i]);
		$column_assign_ids[$i] =$wpdb->get_col("SELECT assign_id FROM wp_GradeBook_assignments_". $x[$i]);
		$student_data[$i] = $wpdb->get_row("SELECT * FROM wp_GradeBook_". $x[$i] ." WHERE user_ID = ".$GradeBook_user_ID ,ARRAY_N);
	}
?>


<table id="GradeBook_courses" border="0" cellpadding="0" cellspacing="0">
    <thead>
        <tr>
		<th style="width:5%">ID</th>
		<th style="width:50%">Name</th>
		<th style="width: 15%">School</th>
		<th style="width: 15%">Semester</th>
		<th style="width:15%">Year</th>
        </tr>
    </thead>
    <tbody>
            <?php
		for ($i=0; $i<count($x); $i++){
			if( $i%2){
				echo "<tr class = 'odd'>";
			} else {
				echo "<tr class = 'even'>";
			}
			for ($j=0; $j<count($course_data[$i]); $j++){
				echo "<td>". $course_data[$i][$j]  ."</td>";
				}
			echo "</tr>";
		}
	     ?>	
    </tbody>
</table>


<?php	
echo "<div id='students_GradeBook_container'>";
for($i = 0; $i < count($x); $i++){	
	echo 	"<table  id=wp_students_GradeBook_$x[$i] style='display:none;' class=students_GradeBook ".
		"border='0' cellpadding='0' cellspacing='0' >" .
			"<thead>".
				"<tr>".
				"<th>ID</th><th>USER ID</th><th>First Name</th><th>Last Name</th>";
	for($j=0;$j<count($column_names[$i]);$j++){
		echo "<th id=assign_".	$column_assign_ids[$i][$j]." title=''>". $column_names[$i][$j] ."</th>";
	}			
	echo			"</tr>" .
			"</thead>" .
			"<tbody>".
			"<tr>";
	for($k=0;$k<count($student_data[$i]);$k++){
		echo "<td>". $student_data[$i][$k] ."</td>";
	}
	echo 		"</tr>".
		"</tbody>" .
	"</table>";	
}
echo "</div>";

?>
<head>
    <!--Load the AJAX API-->
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script type="text/javascript">

      // Load the Visualization API and the piechart package.
      google.load('visualization', '1.0', {'packages':['corechart']});


        function drawChart(num) {
        // Create the data table.
        var datag = new google.visualization.DataTable();
	datag.addColumn('string', 'Grades');
        datag.addColumn('number', 'Number');
        datag.addRows([
          ['A', num[0]],
          ['B', num[1]],
          ['C', num[2]],
          ['D', num[3]],
          ['F', num[4]]
        ]);

        // Set chart options
        var optionsg = {'title':'Grade Distribution',
                       'width':500,
                       'height':400};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
         chart.draw(datag, optionsg);
      }
      
    </script>
  </head>

    <div id="chart_div"></div>


<?php
    $output_string=ob_get_contents();
     ob_end_clean();
    }
    
    return $output_string;
}
add_shortcode( 'GradeBook', 'GradeBook_shortcode' );


?>