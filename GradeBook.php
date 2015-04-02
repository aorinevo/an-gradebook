<?php
/*
Plugin Name: GradeBook
Plugin URI: http://www.aorinevo.com/
Description: A simple GradeBook plugin
Version: 3.5.8
Author: Aori Nevo
Author URI: http://www.aorinevo.com
License: GPL
*/

define( "AN_GRADEBOOK_VERSION", "3.5.8");

include_once( dirname( __FILE__ ) . '/functions.php' );
include_once( dirname( __FILE__ ) . '/Gradebook-Database.php' );
include_once( dirname( __FILE__ ) . '/Gradebook-RESTful-API/an-gradebook-api.php' );
include_once( dirname( __FILE__ ) . '/Gradebook-RESTful-API/User.php' );
include_once( dirname( __FILE__ ) . '/Gradebook-RESTful-API/Assignment.php' );
include_once( dirname( __FILE__ ) . '/Gradebook-RESTful-API/Course.php' );
include_once( dirname( __FILE__ ) . '/Gradebook-RESTful-API/Cell.php' );
include_once( dirname( __FILE__ ) . '/Gradebook-RESTful-API/Gradebook-API.php' );

$an_gradebook_database = new AN_GradeBook_Database();
$an_gradebook_api = new an_gradebook_api();  
$an_gradebook_user = new an_gradebook_user();
$an_gradebook_course_api = new gradebook_course_API();
$an_gradebook_assignment_api = new gradebook_assignment_API();
$an_gradebook_cell_api = new gradebook_cell_API();
$an_gradebookapi = new AN_GradeBookAPI();

function register_an_gradebook_menu_page(){	
	if(gradebook_check_user_role('administrator')){		
		add_menu_page( 'an_gradebook', 'GradeBook', 'administrator', 'an_gradebook', 'init_an_gradebook', 'dashicons-book-alt', '6.12' ); 		
	} else {
		add_menu_page( 'an_gradebook', 'GradeBook', 'subscriber', 'an_gradebook', 'init_an_gradebook', 'dashicons-book-alt', '6.12' ); 			
	}
} 	
add_action( 'admin_menu', 'register_an_gradebook_menu_page' );	
	
function enqueue_an_gradebook_scripts($hook){	
	$an_gradebook_develop = true;
	$app_base = plugins_url('js',__FILE__);
	wp_register_style( 'jquery_ui_css', $app_base.'/lib/jquery-ui/jquery-ui.css', array(), null, false );	
	wp_register_style( 'GradeBook_css', plugins_url('GradeBook.css',__File__), array('bootstrap_css','jquery_ui_css'), null, false );				
	wp_register_style( 'bootstrap_css', $app_base.'/lib/bootstrap/css/bootstrap2.css', array(), null, false);	
	wp_register_script( 'requirejs', $app_base.'/require.js', array(), null, true);					
	if( $hook == "toplevel_page_an_gradebook" ){					
		wp_enqueue_style('GradeBook_css');					
		wp_enqueue_script('requirejs');				
		wp_localize_script( 'requirejs', 'require', array(
			'baseUrl' => $app_base,				
			'deps'    => array( $app_base . ($an_gradebook_develop ? '/an-gradebook-app.js' : '/an-gradebook-app-min.js')
			)
		));
	}				
}
add_action( 'admin_enqueue_scripts', 'enqueue_an_gradebook_scripts');
	
	function init_an_gradebook(){
			ob_start();	
			include( dirname( __FILE__ ) . '/templates/edit-student-template.php' );	
			include( dirname( __FILE__ ) . '/templates/delete-student-template.php' );
			include( dirname( __FILE__ ) . '/templates/edit-assignment-template.php' );
			include( dirname( __FILE__ ) . '/templates/stats-assignment-template.php' );
			include( dirname( __FILE__ ) . '/templates/edit-cell-template.php' );				
			include( dirname( __FILE__ ) . '/templates/stats-student-template.php' );	
			include( dirname( __FILE__ ) . '/templates/assignment-view-template.php' );		
			include( dirname( __FILE__ ) . '/templates/course-view-template.php' );			
			include( dirname( __FILE__ ) . '/templates/student-view-template.php' );		
			include( dirname( __FILE__ ) . '/templates/gradebook-interface-template.php' );
			include( dirname( __FILE__ ) . '/templates/student-courses-interface-template.php' );
			include( dirname( __FILE__ ) . '/templates/edit-course-template.php' );
			include( dirname( __FILE__ ) . '/templates/courses-interface-template.php' );	
			include( dirname( __FILE__ ) . '/templates/student-gradebook-interface-template.php' );	
			echo ob_get_clean();	
	}	

function an_gradebook_my_delete_user( $user_id ) {
	global $wpdb;
	$results1 = $wpdb->delete('an_gradebook_users',array('uid'=>$user_id));
	$results2 = $wpdb->delete('an_gradebook_cells',array('uid'=>$user_id));	
}
add_action( 'delete_user', 'an_gradebook_my_delete_user' );

function an_gradebook_ajaxurl() {
?>
<script type="text/javascript">
var ajaxurl = '<?php echo admin_url('admin-ajax.php'); ?>';
</script>
<?php
}
add_action('wp_head','an_gradebook_ajaxurl');

function an_gradebook_shortcode (){
	init_an_gradebook();	
	$an_gradebook_develop = true;
	$app_base = plugins_url('js',__FILE__);
	wp_register_style( 'yahoo_css_reset', 'http://yui.yahooapis.com/3.18.1/build/cssreset-context/cssreset-context-min.css', array(), null, false );	
	wp_register_style( 'jquery_ui_css', $app_base.'/lib/jquery-ui/jquery-ui.css', array(), null, false );	
	wp_register_style( 'GradeBook_css', plugins_url('GradeBook.css',__File__), array('bootstrap_css','jquery_ui_css','yahoo_css_reset'), null, false );				
	wp_register_style( 'bootstrap_css', $app_base.'/lib/bootstrap/css/bootstrap2.css', array(), null, false);	
	wp_register_script( 'requirejs', $app_base.'/require.js', array(), null, true);									
	wp_enqueue_style('GradeBook_css');					
	wp_enqueue_script('requirejs');				
	wp_localize_script( 'requirejs', 'require', array(
		'baseUrl' => $app_base,				
		'deps'    => array( $app_base . ($an_gradebook_develop ? '/an-gradebook-app.js' : '/an-gradebook-app-min.js'))
	));
	return '<div class="yui3-cssreset" id="wpbody-content">tester</div>';
}
add_shortcode('an_gradebook', 'an_gradebook_shortcode');

?>