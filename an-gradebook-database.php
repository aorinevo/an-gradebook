<?php
class AN_GradeBook_Database{
	const an_gradebook_db_version = 3;
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
			name MEDIUMTEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
			school TINYTEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
			semester TINYTEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
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
		if(get_site_option( 'an_gradebook_db_version' )>=2 && get_site_option( 'an_gradebook_db_version' )< self::an_gradebook_db_version){
			$sql = "ALTER TABLE an_gradebooks CHANGE name name MEDIUMTEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL, 
				CHANGE school school TINYTEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL, 
				CHANGE semester semester TINYTEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL";
			$wpdb->query($sql);		
		}
		update_option( "an_gradebook_db_version", self::an_gradebook_db_version );		
	}	
}
?>