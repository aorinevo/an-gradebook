<?php

if( defined( 'WP_UNINSTALL_PLUGIN' ) ) {

	global $wpdb;

	$wpdb->query("DROP TABLE IF EXISTS an_gradebooks");
	$wpdb->query("DROP TABLE IF EXISTS an_gradebook");	
	$wpdb->query("DROP TABLE IF EXISTS an_assignments");	
	$wpdb->query("DROP TABLE IF EXISTS an_assignment");		
	
	return false;	
}

?>