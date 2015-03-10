<?php
/*
Plugin Name: GradeBook
Plugin URI: http://www.aorinevo.com/
Description: A simple GradeBook plugin
Version: 3.5.3
Author: Aori Nevo
Author URI: http://www.aorinevo.com
License: GPL
*/

define( "AN_GRADEBOOK_VERSION", "3.5.2");

include_once( dirname( __FILE__ ) . '/functions.php' );
include_once( dirname( __FILE__ ) . '/Gradebook-Database.php' );
include_once( dirname( __FILE__ ) . '/Gradebook-Scripts.php' );
include_once( dirname( __FILE__ ) . '/Gradebook-RESTful-API/Assignment.php' );
include_once( dirname( __FILE__ ) . '/Gradebook-RESTful-API/Course.php' );
include_once( dirname( __FILE__ ) . '/Gradebook-RESTful-API/Student.php' );
include_once( dirname( __FILE__ ) . '/Gradebook-RESTful-API/Cell.php' );
include_once( dirname( __FILE__ ) . '/Gradebook-RESTful-API/Gradebook-API.php' );

$an_gradebook_scripts = new AN_GradeBook_Scripts();
$an_gradebook_database = new AN_GradeBook_Database();
$an_gradebook_course_api = new gradebook_course_API();
$an_gradebook_assignment_api = new gradebook_assignment_API();
$an_gradebook_cell_api = new gradebook_cell_API();
$an_gradebook_student_api = new gradebook_student_API();
$an_gradebookapi = new AN_GradeBookAPI();

//echo $an_gradebook_course_api -> course('GET');

?>