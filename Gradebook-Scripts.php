<?php
class AN_GradeBook_Scripts{
	public function __construct(){
			add_action('admin_init', array($this,'register_gradebook_scripts'));
			add_action( 'admin_menu', array($this,'register_gradebook_menu_page' ));					
			add_action('admin_enqueue_scripts', array($this,'enqueue_gradebook_scripts'));		
	}
	public function register_gradebook_scripts(){
		wp_register_style( 'GradeBook_css', plugins_url('GradeBook.css',__File__), array('media-views'), null, false );
		wp_register_style( 'bootstrap_css', plugins_url('js/packages/bootstrap/css/bootstrap.min.css',__File__), array(), null, false );		
		//wp_register_style( 'list-tables', plugins_url('list-tables.css',__File__), array(), null, false );		
		wp_register_script('googlejsapi', 'https://www.google.com/jsapi', array(), null, false ); 
	//models
		wp_register_script( 'models/Cell', plugins_url('js/models/Cell.js',__File__),array( 'js/init_app','jquery','backbone','underscore' ), null, true );		
		wp_register_script( 'models/CellList', plugins_url('js/models/CellList.js',__File__),array( 'js/init_app','jquery','backbone','underscore', 'models/Cell' ), null, true );				
		wp_register_script( 'models/Assignment', plugins_url('js/models/Assignment.js',__File__),array( 'js/init_app','jquery','backbone','underscore' ), null, true );				
		wp_register_script( 'models/AssignmentList', plugins_url('js/models/AssignmentList.js',__File__),array( 'js/init_app','jquery','backbone','underscore', 'models/Assignment' ), null, true );	
		wp_register_script( 'models/Student', plugins_url('js/models/Student.js',__File__),array( 'js/init_app','jquery','backbone','underscore' ), null, true );			
		wp_register_script( 'models/StudentList', plugins_url('js/models/StudentList.js',__File__),array( 'js/init_app','jquery','backbone','underscore', 'models/Student' ), null, true );					
		wp_register_script( 'models/Course', plugins_url('js/models/Course.js',__File__),array( 'js/init_app','jquery','backbone','underscore' ), null, true );			
		wp_register_script( 'models/StudentCourse', plugins_url('js/models/StudentCourse.js',__File__),array( 'js/init_app','jquery','backbone','underscore' ), null, true );			
		wp_register_script( 'models/CourseList', plugins_url('js/models/CourseList.js',__File__),array( 'js/init_app','jquery','backbone','underscore', 'models/Course' ), null, true );					
		wp_register_script( 'models/StudentCourseList', plugins_url('js/models/StudentCourseList.js',__File__),array( 'js/init_app','jquery','backbone','underscore', 'models/StudentCourse' ), null, true );							
		wp_register_script( 'models/CourseGradebook', plugins_url('js/models/CourseGradebook.js',__File__),array( 'js/init_app','jquery','backbone','underscore' ), null, true );					
		wp_register_script( 'models/StudentCourseGradebook', plugins_url('js/models/StudentCourseGradebook.js',__File__),array( 'js/init_app','jquery','backbone','underscore' ), null, true );							
		wp_register_script( 'models/ANGradebook', plugins_url('js/models/ANGradebook.js',__File__),array( 'js/init_app','jquery','backbone','underscore' ), null, true );			
		wp_register_script( 'models/ANGradebookList', plugins_url('js/models/ANGradebookList.js',__File__),array( 'js/init_app','jquery','backbone','underscore' ), null, true );							
	//views
		wp_register_script( 'views/CellView', plugins_url('js/views/CellView.js',__File__),array( 'js/init_app','jquery','backbone','underscore' ), null, true );																	
		wp_register_script( 'views/StudentCellView', plugins_url('js/views/StudentCellView.js',__File__),array( 'js/init_app','jquery','backbone','underscore' ), null, true );																			
		wp_register_script( 'views/AssignmentView', plugins_url('js/views/AssignmentView.js',__File__),array( 'js/init_app','jquery','backbone','underscore' ), null, true );								
		wp_register_script( 'views/StudentAssignmentView', plugins_url('js/views/StudentAssignmentView.js',__File__),array( 'js/init_app','jquery','backbone','underscore' ), null, true );										
		wp_register_script( 'views/StudentView', plugins_url('js/views/StudentView.js',__File__),array( 'js/init_app','jquery','backbone','underscore' ), null, true );										
		wp_register_script( 'views/StudentStudentView', plugins_url('js/views/StudentStudentView.js',__File__),array( 'js/init_app','jquery','backbone','underscore' ), null, true );												
		wp_register_script( 'views/CourseView', plugins_url('js/views/CourseView.js',__File__),array( 'js/init_app','jquery','backbone','underscore' ), null, true );												
		wp_register_script( 'views/GradebookView', plugins_url('js/views/GradebookView.js',__File__),array( 'js/init_app','jquery','backbone','underscore' ), null, true );														
		wp_register_script( 'views/StudentGradebookView', plugins_url('js/views/StudentGradebookView.js',__File__),array( 'js/init_app','jquery','backbone','underscore' ), null, true );																
		wp_register_script( 'views/EditStudentView', plugins_url('js/views/EditStudentView.js',__File__),array( 'js/init_app','jquery','backbone','underscore','jquery-ui-autocomplete' ), null, true );														
		wp_register_script( 'views/DeleteStudentView', plugins_url('js/views/DeleteStudentView.js',__File__),array( 'js/init_app','jquery','backbone','underscore' ), null, true );																
		wp_register_script( 'views/EditAssignmentView', plugins_url('js/views/EditAssignmentView.js',__File__),array( 'js/init_app','jquery','backbone','underscore', 'jquery-ui-datepicker' ), null, true );																		
		wp_register_script( 'views/EditCourseView', plugins_url('js/views/EditCourseView.js',__File__),array( 'js/init_app','jquery','backbone','underscore' ), null, true );																		
		wp_register_script( 'views/AssignmentStatisticsView', plugins_url('js/views/AssignmentStatisticsView.js',__File__),array( 'js/init_app','jquery','backbone','underscore', 'googlejsapi' ), null, true );																		
		wp_register_script( 'views/StudentStatisticsView', plugins_url('js/views/StudentStatisticsView.js',__File__),array( 'js/init_app','jquery','backbone','underscore', 'googlejsapi' ), null, true );																		
	//other scripts		
		wp_register_script( 'js/GradeBook_js', plugins_url('js/GradeBook.js',__File__),
			array( 
			'jquery', 'backbone', 'underscore', 'js/init_app', 'models/Cell','models/CellList','models/Assignment','models/AssignmentList',
			'models/Student','models/StudentList', 'models/Course', 'models/CourseList', 'models/ANGradebook', 'models/ANGradebookList', 'models/CourseGradebook',
	    	 'views/CellView' ,	
    		 'views/AssignmentView' ,     	
    		 'views/StudentView' ,         	
	    	 'views/CourseView' ,    
    		 'views/EditStudentView',     	
    		 'views/DeleteStudentView',     	    	
	    	 'views/EditAssignmentView',     	    	    	
    		 'views/EditCourseView',     	    	    	    	   	    	    	    	    	
    		 'views/AssignmentStatisticsView' ,  
	    	 'views/StudentStatisticsView' ,  
    		 'views/GradebookView' 			
			 ), null, true );
		wp_register_script( 'js/GradeBook_student_js', plugins_url('js/GradeBook_student.js',__File__),
			array( 
			'jquery', 'backbone', 'underscore', 'js/init_app', 'models/Cell', 'models/CellList', 'models/Assignment', 'models/AssignmentList',
			'models/Student','models/StudentList', 'models/StudentCourse', 'models/StudentCourseList', 'models/StudentCourseGradebook',
			'views/StudentCellView', 
			'views/StudentAssignmentView',
    		'views/StudentStudentView' ,
	    	'views/CourseView' ,     		 			
    		'views/AssignmentStatisticsView',		
    	    'views/StudentStatisticsView',
    		'views/StudentGradebookView' 		    	    		
			), null, true );			 
		wp_register_script( 'js/init_app', plugins_url('js/init_app.js',__File__),array( 'jquery', 'backbone','underscore', 'googlejsapi' ), null, true );		
		wp_register_script( 'bootstrap_js', plugins_url('js/packages/bootstrap/js/bootstrap.min.js',__File__),array( 'jquery', 'backbone','underscore' ), null, true );
	}
	public function enqueue_gradebook_scripts($hook){
        if( $hook == "toplevel_page_an_gradebook_page" ){
			wp_enqueue_style( 'GradeBook_css' );	
			wp_enqueue_style( 'bootstrap_css' );		  		   	
			wp_enqueue_script( 'bootstrap_js' ); 					
		} else {
	  		return;
		}	
	
		if (gradebook_check_user_role('administrator')){			
			wp_enqueue_script('js/GradeBook_js');
 		} else {
			wp_enqueue_script('js/GradeBook_student_js');
 		}
 	}	
	public function an_gradebook_admin_help_tab(){
   		$screen = get_current_screen();
		$screen->add_help_tab( array( 
	   	'id' => 'an_gradebook_display_course',     
	   	'title' => 'GradeBook',     
	   	'content' => '<ul>
	   	  <li>Create a gradebook by clicking on the Add Course button.</li>
	   	  <li>To show the gradebook, click on the Course name.</li>
	   	  </ul>' 
		) );
		$screen->add_help_tab( array( 
	   	'id' => 'an_gradebook_display_student_statistics',       
	   	'title' => 'Student Statistics',     
	   	'content' => '<ul>
	   	  <li>Click on student\'s name</li>
	   	  <li>Click on the Student Statistics button</li>
	   	</ul>' 
		) );	
	} 	
	public function an_gradebook_student_help_tab(){
   		$screen = get_current_screen();
		$screen->add_help_tab( array( 
	   	'id' => 'an_gradebook_display_course',     
	   	'title' => 'GradeBook',     
	   	'content' => '<ul>
	   	  <li>To show the gradebook, click on the Course name.</li>
	   	  </ul>' 
		) );
		$screen->add_help_tab( array( 
	   	'id' => 'an_gradebook_display_student_menu',           
	   	'title' => 'Student Menu',      
	   	'content' => '<ul>
	   	  <li>Click on the student menu</li>
	   	  <li>Submenu items are edit, delete, statistics</li>
	   	</ul>'  
		) );	
		$screen->add_help_tab( array( 
	   	'id' => 'an_gradebook_display_assignment_menu',   
	   	'title' => 'Assignment Menu',    
	   	'content' => '<ul>
	   	  <li>Click on an assignment menu</li>
	   	  <li>Submenu items are edit, delete, statistics</li>
	   	</ul>'  
		) );		
	} 		
	public function register_gradebook_menu_page(){	
		if (gradebook_check_user_role('administrator')){
    		$gradebook_page = add_menu_page( 'GradeBook', 'GradeBooks', 'administrator', 'an_gradebook_page', array($this,'an_gradebook_menu_page'), 'dashicons-book-alt', '6.12' ); 
    		//add_action('load-'.$gradebook_page,array($this, 'an_gradebook_admin_help_tab'));			    		
			//add_submenu_page( 'an_gradebook_page', 'GradeBook','All GradeBooks', 'administrator', 'an_gradebook_page');
			//add_submenu_page( 'an_gradebook_page', 'Setting','Settings', 'administrator', 'an_gradebook_settings_page','an_gradebook_settings_page' );     	
    		//add_action('load-'.$settings_help, 'an_gradebook_settings_add_help_tab');			
		} else {
    		$gradebook_page = add_menu_page( 'GradeBook', 'GradeBooks', 'subscriber', 'an_gradebook_page', array($this,'an_gradebook_menu_page'), 'dashicons-book-alt', '6.12' ); 
    		//add_action('load-'.$gradebook_page,array($this, 'an_gradebook_student_help_tab'));		
		}
	} 	
	public function an_gradebook_menu_page(){
		if (gradebook_check_user_role('administrator')){
			ob_start();	
			include( dirname( __FILE__ ) . '/templates/edit-student-template.php' );	
			include( dirname( __FILE__ ) . '/templates/delete-student-template.php' );
			include( dirname( __FILE__ ) . '/templates/edit-assignment-template.php' );
			include( dirname( __FILE__ ) . '/templates/stats-assignment-template.php' );	
			include( dirname( __FILE__ ) . '/templates/stats-student-template.php' );	
			include( dirname( __FILE__ ) . '/templates/assignment-view-template.php' );		
			include( dirname( __FILE__ ) . '/templates/student-view-template.php' );		
			include( dirname( __FILE__ ) . '/templates/gradebook-interface-template.php' );
			include( dirname( __FILE__ ) . '/templates/student-courses-interface-template.php' );
			include( dirname( __FILE__ ) . '/templates/edit-course-template.php' );
			include( dirname( __FILE__ ) . '/templates/courses-interface-template.php' );	
			include( dirname( __FILE__ ) . '/templates/student-gradebook-interface-template.php' );	
			$mytemplates = ob_get_clean();	
			echo $mytemplates;		
			echo '<div class="wrap">
					<h2>GradeBooks</h2>
					<div id="an-gradebooks"></div>
		  			</div>';
		} elseif (get_current_user_id()>0 && !gradebook_check_user_role('administrator')){
			ob_start();
			include( dirname( __FILE__ ) . '/templates/stats-assignment-template.php' );	
			include( dirname( __FILE__ ) . '/templates/stats-student-template.php' );
			include( dirname( __FILE__ ) . '/templates/student-student-view-template.php' );				
			include( dirname( __FILE__ ) . '/templates/student-assignment-view-template.php' );				
			include( dirname( __FILE__ ) . '/templates/student-courses-interface-template.php' );
			include( dirname( __FILE__ ) . '/templates/student-gradebook-interface-template.php' );
			$mytemplates = ob_get_clean();	
			echo $mytemplates;		
			echo '<div class="wrap">
					<h2>GradeBooks</h2>
					<div id="an-gradebooks"></div>
				  </div>';
		} else {	
			echo 'You do not have premissions to view this GradeBook.';
		}
	}
	public function an_gradebook_settings_page(){
		if (gradebook_check_user_role('administrator')){	
		ob_start();		
		include( dirname( __FILE__ ) . '/templates/settings/grade-range.php' );	
		$mytemplates = ob_get_clean();	
		echo '<div class="wrap">
				<h2>Settings</h2>'.
				$mytemplates.'
			  </div>';			
		}
	}
}
?>