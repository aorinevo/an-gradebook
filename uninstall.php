<?php

if( defined( 'WP_UNINSTALL_PLUGIN' ) ) {

	global $wpdb;

	$wpdb->query("DROP TABLE IF EXISTS an_gradebooks");
	$wpdb->query("DROP TABLE IF EXISTS an_gradebook");	
	$wpdb->query("DROP TABLE IF EXISTS an_assignments");	
	$wpdb->query("DROP TABLE IF EXISTS an_assignment");		
	$wpdb->query( 
		$wpdb->prepare( 
			"DELETE FROM $wpdb->options
		 	WHERE option_name = %s",
	        'an_gradebook_db_version'
        )
	);	
	return false;	
}

?>