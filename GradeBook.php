<?php
/*
Plugin Name: GradeBook
Plugin URI: http://www.aorinevo.com/
Description: A simple GradeBook plugin
Version: 4.0
Author: Aori Nevo
Author URI: http://www.aorinevo.com
License: GPL
*/

define( "AN_GRADEBOOK_VERSION", "4.0");

$database_file_list = glob(dirname( __FILE__ ).'/database/*.php');
foreach($database_file_list as $database_file){
	include($database_file);
}	

$an_gradebook_database = new AN_GradeBook_Database();
$an_gradebook_api = new an_gradebook_api();  
$an_gradebook_course_api = new gradebook_course_API();
$an_gradebook_assignment_api = new gradebook_assignment_API();
$an_gradebook_cell_api = new gradebook_cell_API();
$an_gradebookapi = new AN_GradeBookAPI();
$angb_course_list = new ANGB_COURSE_LIST();
$angb_gradebook = new ANGB_GRADEBOOK();
$angb_user = new ANGB_USER();
$angb_user_list = new ANGB_USER_LIST();

function register_an_gradebook_menu_page(){	
		$roles = wp_get_current_user()->roles;
		$my_admin_page = add_menu_page( 'GradeBook', 'GradeBook', $roles[0], 'an_gradebook', 'init_an_gradebook', 'dashicons-book-alt', '6.12' ); 			
		if (in_array($roles[0],
			array_keys(
				get_option('an_gradebook_settings')))) {		
 			add_submenu_page( 'an_gradebook', 'Settings', 'Settings', 'administrator', 'an_gradebook_settings', 'init_an_gradebook_settings' );		
 		}
} 	
add_action( 'admin_menu', 'register_an_gradebook_menu_page' );	
	
function enqueue_an_gradebook_scripts($hook){	
	$an_gradebook_develop = false;
	$app_base = plugins_url('js',__FILE__);
	$current_screen = get_current_screen()->id;
	wp_register_style( 'jquery_ui_css', $app_base.'/lib/jquery-ui/jquery-ui.css', array(), null, false );	
	wp_register_style( 'GradeBook_css', plugins_url('GradeBook.css',__File__), array('bootstrap_css','jquery_ui_css'), null, false );				
	wp_register_style( 'bootstrap_css', $app_base.'/lib/bootstrap/css/bootstrap.css', array(), null, false);	
	wp_register_script( 'requirejs', $app_base.'/require.js', array(), null, true);	
	if( $hook == "toplevel_page_an_gradebook" || $hook == "gradebook_page_an_gradebook_settings" ){	
		wp_enqueue_style('GradeBook_css');								
		wp_enqueue_script('requirejs');			
		switch($current_screen){	
			case "toplevel_page_an_gradebook":		
				wp_localize_script( 'requirejs', 'require', array(
					'baseUrl' => $app_base,				
					'deps'    => array( $app_base . ($an_gradebook_develop ? '/an-gradebook-app.js' : '/an-gradebook-app-min.js')
				)));
				break;
			case  "gradebook_page_an_gradebook_settings":
				wp_localize_script( 'requirejs', 'require', array(
					'baseUrl' => $app_base,				
					'deps'    => array( $app_base . ($an_gradebook_develop ? '/an-gradebook-settings.js' : '/an-gradebook-settings-min.js')
				)));
				break;	
		}	
	}				
}
add_action( 'admin_enqueue_scripts', 'enqueue_an_gradebook_scripts');
	
	function init_an_gradebook_settings(){
		ob_start();	
		include( dirname( __FILE__ ) . '/js/app/templates/settings-template.php' );	
		echo ob_get_clean();
	}

	function init_an_gradebook(){	
			$template_list = glob(dirname( __FILE__ ).'/js/app/templates/*.php');

			foreach($template_list as $template){
				include($template);
			}	
	}	

function an_gradebook_my_delete_user( $user_id ) {
	global $wpdb;
	$results1 = $wpdb->delete('an_gradebook_users',array('uid'=>$user_id));
	$results2 = $wpdb->delete('an_gradebook_cells',array('uid'=>$user_id));	
}
add_action( 'delete_user', 'an_gradebook_my_delete_user' );

/*
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
*/
?>