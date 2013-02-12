(function($) {

// LIST OF DOM IDS:
// '#GradeBook_courses' refers to the courses table.
// '#wp_GradeBook_' + isselecteddata references the currently selected gradebook. 
// '#wp_GradeBook_' + wasselected references the prior selected gradebook. Example: if selected 
//		gradebook with id 1 and then grade book with id 10 the value of was selected is 1
// '#wp_GradeBook_assignments_' + isselected references the currently selected gradebooks assignments table. 
// '#add-course' refers to the Add Course button
// '#delete-course' refers to the Delete Course button
// '#add-assignment' refers to the Add Assignment button
// '#delete-assignment' refers to the Delete Assignment button
// '#add-student' refers to the Add Student button
// '#delete-student' refers to the Delete Student button
// '#CRUD-student' refers to the contains the 4 buttons Add Stuent, Delete Student, Add Assignment, Delete Assignment




	
//**********************/
//* Add/Delete Courses */
//**********************/

$( '#add-course' ).hover(function(){
	$( '#icon_add_course' ).css('opacity',1);
},function(){
	$( '#icon_add_course' ).css('opacity',.5);		
});

$( '#delete-course' ).hover(function(){
	$( '#icon_delete_course' ).css('opacity',1);
},function(){
	$( '#icon_delete_course' ).css('opacity',.5);		
});

$( '#add-assignment' ).hover(function(){
	$( '#icon_add_assignment' ).css('opacity',1);
},function(){
	$( '#icon_add_assignment' ).css('opacity',.5);		
});

$( '#delete-assignment' ).hover(function(){
	$( '#icon_delete_assignment' ).css('opacity',1);
},function(){
	$( '#icon_delete_assignment' ).css('opacity',.5);		
});

$( '#add-student' ).hover(function(){
	$( '#icon_add_student' ).css('opacity',1);
},function(){
	$( '#icon_add_student' ).css('opacity',.5);		
});

$( '#delete-student' ).hover(function(){
	$( '#icon_delete_student' ).css('opacity',1);
},function(){
	$( '#icon_delete_student' ).css('opacity',.5);		
});

$( '#GradeBook_courses tbody td:not(.noteditable)' ).each(function()
{
    $(this).editable(ajax_object.ajax_url,{ 
	submitdata: {
		action: 'edit_course',
		course_id : $(this).siblings()[0].innerHTML,
		colIndex : $( this ).prevAll().length 
	},
	indicator : 'Saving...',        
        height:$(this).height()+'px',
        width:$(this).width()+'px',
        onblur: 'submit'
   	});
});

	
	var course_name = $( "#course_name" ),
	    course_school = $( "#course_school" ),
	    course_semester = $( "#course_semester")
            course_year = $( "#course_year" ),
            allFields = $( [] ).add( course_name ).add( course_school ).add( course_semester ).add( course_year ),
            tips = $( ".validateTips" );
	
	$( "#add-course-form" ).dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"Add Course": function() {
				var bValid = true;
				allFields.removeClass( "ui-state-error" );
 
				bValid = bValid && checkLength( course_name, "Course Name: ", 3, 40 );
				bValid = bValid && checkLength( course_school, "School: ", 3, 40 );				
				bValid = bValid && checkLength( course_semester, "Semester: ", 3, 40 );				
				bValid = bValid && checkRegexp( course_year, /^\d{4}$/, "Year: YYYY" );
 
				if ( bValid ) {
				//"../../wp-content/plugins/AN_GradeBook/add_course.php"
					$.get(ajax_object.ajax_url, { 
						action: 'add_course',
						course_name : course_name.val(),
						course_school : course_school.val(),
						course_semester : course_semester.val(),
						course_year: course_year.val()
					}, function(data){
						$( "#GradeBook_courses tbody" ).append(function(){
							var row_data = "";
							for(i = 0; i<data.length;i++){
							if(i==0){
								row_data = row_data + "<td class = 'noteditable'>" + 
								data[i] + "</td>";
							} else{
			    					row_data = row_data + "<td>" + data[i] + "</td>";
			    				}};
			    				return "<tr>" + row_data + "</tr>"; 
			    			});
			    			$( '#GradeBook_courses tbody tr:nth-child(even)' )
							.removeClass('even')
							.addClass('odd');
						$( '#GradeBook_courses tbody tr:nth-child(odd)' )
      							.removeClass('odd')
      							.addClass('even');    							
						$( '#GradeBook_courses tbody tr:last-child td:not(.noteditable)' ).each(function(){
							$(this).editable(ajax_object.ajax_url,{ 
								submitdata: {
									action: 'edit_course',
									course_id : $(this).siblings()[0].innerHTML,
									colIndex : $( this ).prevAll().length 
								},
								indicator : 'Saving...',        
       								height:$(this).height()+'px',
								width:$(this).width()+'px',
								onblur: 'submit'
						});
						});
						$('#GradeBook_container').append(function(){
						var x = "<table  id='wp_GradeBook_" + data[0] + "' class='GradeBook_students' border='0' cellpadding='0' cellspacing='0' style = 'display: none;' >" +
							"<thead>" +
								"<tr>" +
									"<th id='comment_ID'>ID</th>" +
									"<th id='user_id'>USER ID</th>" +
									"<th id='first_name'>FIRST NAME</th>" +
									"<th id='last_name'>LAST NAME</th>" +																		
								"</tr>" +
							"</thead>" +
							"<tbody>" +
							"</tbody>";
						return x;
						}
						);
						
						
$("#GradeBook_courses tbody tr:last-child td:first-child").click(function() {
    		$(this).parent().toggleClass('ui-selected').siblings().removeClass('ui-selected');
    		isselected = $('#GradeBook_courses').find('.ui-selected td').map(function() {
        		return $(this).text();
    		}).get();
		isselectedlength = isselected.length;
		isselecteddata = isselected[0];
		$( '#GradeBook_courses tbody tr' ).click(function(){
		if ( $( this ).hasClass('ui-selected') ) {
			$( "#delete-course" ).button( "option", "disabled", false );
		}else{
			$( "#delete-course" ).button( "option", "disabled", true );	
		}
		});
		if (nonetosome === 0)  {
			nonetosome =1;
			$('#wp_GradeBook_' + isselecteddata).show('slide', {
					direction: 'right'
				});
			$('#CRUD-students').show('slide', {
					direction: 'right'
				});
			wasselecteddata = isselecteddata;
			if (isselectedlength === 0) {
				nonetosome = 0;
				$('#CRUD-students').hide('slide', {
					direction: 'left'
				});
			}					
		} else {
			$('#wp_GradeBook_' + wasselecteddata).hide('slide', {
					direction: 'left'
				}, function() {
					$('#wp_GradeBook_' + isselecteddata).show('slide', {
						direction : 'right'
					});
				});
				wasselecteddata = isselected[0];
				if (isselectedlength === 0) {
					nonetosome = 0;
					$('#CRUD-students').hide('slide', {
						direction: 'left'
					});
				}
		}
	});						
						
						
						
						
						
						
														
						$( "#add-course-form" ).dialog( "close" );		
					},
					"json");
				}
                	},
			Cancel: function() {
				$( this ).dialog( "close" );
                	}
		},
		close: function() {
                	allFields.val( "" ).removeClass( "ui-state-error" );
		}
        });
        
 
        $( "#add-course" )
		.button()
		.click(function() {
			$( "#add-course-form" ).dialog( "open" );
		});
		

	
	$( "#delete-course-confirm" ).dialog({
		autoOpen: false,
		resizable: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
		   	"Delete": function(){
		   		var selected_row_data = $( '#GradeBook_courses' )
		   			.find( ".ui-selected td" ).map(function(){
		   				return this.innerHTML;
					}).get().join(",").split(',');
				if ( selected_row_data[0] > 0  ) {
					$.get(ajax_object.ajax_url, { 
						action: 'delete_course',
						course_id : selected_row_data[0]
					},
					function(data){
						$( '#GradeBook_courses')
							.find( ".ui-selected td" ).parent()
							.remove();
						$( '#wp_GradeBook_' + selected_row_data[0] ).remove();
						$( '#GradeBook_courses tbody tr:nth-child(odd)' )
							.removeClass('odd')
							.addClass('even');
						$( '#GradeBook_courses tbody tr:nth-child(even)' )
      							.removeClass('even')
      							.addClass('odd');     							
						$( "#delete-course-confirm" ).dialog( "close" );
						$( "#delete-course" ).button( "option", "disabled", true );
						$('#CRUD-students').hide('slide', {
							direction: 'left'
						});
						nonetosome = 0;
					});
				} else {
					alert( 'No row selected!' + selected_row_data + " space " + selected_row_data[0] );
					$( this ).dialog("close");
				}
		   	},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		}
	});
	$( "#delete-course" )
		.button()
		.click(function() {
			$( "#delete-course-confirm" ).dialog( "open" );
		});
	$( "#delete-course" ).button( "option", "disabled", true );
	

  	
  	$( '#GradeBook_courses tbody tr' ).click(function(){
  		var x = $( '#GradeBook_courses tbody tr' ).hasClass('ui-selected');
		if ( x ) {
			$( "#delete-course" ).button( "option", "disabled", false );
		}else{
			$( "#delete-course" ).button( "option", "disabled", true );	
		}
	});
	
	


	var user_login = $( "#user_login" ),
	    first_name = $( "#first_name" ),
	    last_name = $( "#last_name")
            email = $( "#email" ),
            password = $( "#password" ),
            allFields = $( [] ).add( user_login ).add( first_name ).add( last_name ).add( email ).add( password ),
            tips = $( ".validateTips" );
 
        function updateTips( t ) {
            tips
                .text( t )
                .addClass( "ui-state-highlight" );
            setTimeout(function() {
                tips.removeClass( "ui-state-highlight", 1500 );
            }, 500 );
        }
 
        function checkLength( o, n, min, max ) {
            if ( o.val().length > max || o.val().length < min ) {
                o.addClass( "ui-state-error" );
                updateTips( "Length of " + n + " must be between " +
                    min + " and " + max + "." );
                return false;
            } else {
                return true;
            }
        }
 
        function checkRegexp( o, regexp, n ) {
            if ( !( regexp.test( o.val() ) ) ) {
                o.addClass( "ui-state-error" );
                updateTips( n );
                return false;
            } else {
                return true;
            }
        }
 
	$( "#add-student-form" ).dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"Add Student": function() {
				var bValid = true;
				allFields.removeClass( "ui-state-error" );
 
				bValid = bValid && checkLength( user_login, "User Login: ", 3, 16 );
				bValid = bValid && checkLength( first_name, "First Name: ", 3, 16 );				
				bValid = bValid && checkLength( last_name, "Last Name: ", 3, 16 );				
				bValid = bValid && checkLength( email, "email", 6, 80 );
				bValid = bValid && checkLength( password, "password", 5, 16 );
				bValid = bValid && checkRegexp( user_login, /^[a-z]([0-9a-z_])+$/i, 
                    			"User login may consist of a-z, 0-9, underscores, begin with a letter." );
                    // From jquery.validate.js (by joern), contributed by Scott Gonzalez: 
                    // http://projects.scottsplayground.com/email_address_validation/
				bValid = bValid && checkRegexp( email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "eg. ui@jquery.com" );
				bValid = bValid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );
 
				if ( bValid ) {
					$.get(ajax_object.ajax_url, { 
						action: 'add_student',
						user_login: user_login.val(),
						first_name: first_name.val(),
						last_name: last_name.val(),
						user_email: email.val(),
						password: password.val(),
						course_id : isselecteddata
					}, function(data){
						$( "#wp_GradeBook_" + isselecteddata + " tbody" ).append(function(){
							var row_data = "";
							for(i = 0; i<data.length;i++){
							if(i==0 || i==1){
								row_data = row_data + "<td class = 'noteditable'>" + 
								data[i] + "</td>";
							} else{
			    					row_data = row_data + "<td>" + data[i] + "</td>";
			    				}};
	
			    				if($( "#wp_GradeBook_" + isselecteddata + 
			    				" tbody:last-child" ).hasClass('odd')){
			    					return "<tr class='even'>" + row_data + "</tr>"; 
			    				} else {
			    				return "<tr class='odd'>" + row_data + "</tr>"; 
			    				}
			    			});
			    			$( "#wp_GradeBook_" + isselecteddata + " tbody:last-child td:not(.noteditable)")
			    			.each(function(){
    						$(this).editable(ajax_object.ajax_url,{ 
						submitdata: {
							action: 'edit_student',
							column_id: $('#wp_GradeBook_' + isselecteddata + ' thead th:eq('+
							$( this ).index() +')').attr('id'),
							comment_ID : $(this).siblings()[0].innerHTML,
							course_id : isselecteddata
						},
							indicator : 'Saving...',        
        						height: '100%',
						        width: '100%',
						        onblur: 'submit'
   						});
					});			
						$( '#wp_GradeBook_' + isselecteddata + ' tbody tr:nth-child(odd)' )
							.removeClass('odd')
							.addClass('even');
      						$( '#wp_GradeBook_' + isselecteddata + ' tbody tr:nth-child(even)' )
      							.removeClass('even')
      							.addClass('odd');
      						$( "#wp_GradeBook_" + isselecteddata + " tbody tr:last-child td:eq(0)" ).click(function() {
    						$(this).parent().toggleClass("ui-selected").siblings().removeClass("ui-selected");
    						$('#wp_GradeBook_' + wasselecteddata + ' thead th').removeClass('ui-selected');
    			 			$( "#delete-assignment" ).button( "option", "disabled", true );
						var x = $( '#wp_GradeBook_' + isselecteddata + ' tbody tr' ).hasClass('ui-selected');
							if ( x ) {
								$( "#delete-student" ).button( "option", "disabled", false );
							}else{
								$( "#delete-student" ).button( "option", "disabled", true );	
							}
    						});  	     	
						$( "#add-student-form" ).dialog( "close" );		
					},
					"json");	
				}
                	},
			Cancel: function() {
				$( this ).dialog( "close" );
                	}
		},
		close: function() {
                	allFields.val( "" ).removeClass( "ui-state-error" );
		}
        });
        
 
        $( "#add-student" )
		.button()
		.click(function() {
			$( "#add-student-form" ).dialog( "open" );
		});
		
	var assignment_name = $( "#assignment_name" ),
	    assigned_on = $( "#datepicker_assigned_on" ),
	    assignment_due_date = $( "#datepicker_assignment_due_date");
	
 	$( '#add-assignment-form' ).dialog({
 		autoOpen: false,
 		height: 400,
 		width: 500,
 		modal: true,
 		buttons: {
 			"Create": function(){
 				var year1 = assigned_on.datepicker( "getDate" ).getFullYear(),
 			 	    day1 = assigned_on.datepicker( "getDate" ).getDate(),
 			 	    month1 = assigned_on.datepicker( "getDate" ).getMonth()+1;
 				var year2 = assignment_due_date.datepicker( "getDate" ).getFullYear(),
 			 	    day2 = assignment_due_date.datepicker( "getDate" ).getDate(),
 			 	    month2 = assignment_due_date.datepicker( "getDate" ).getMonth()+1;
 			 	     			 	    
				$.get(ajax_object.ajax_url,{ 
					action: 'add_assignment',
					assignment_name : assignment_name.val(),
					assigned_on : year1 + "-" + month1 + "-" + day1, 
					assignment_due_date : year2 + "-" + month2 + "-" + day2,
					course_id : isselecteddata
					},
					function(data){
      							$( '#wp_GradeBook_' + isselecteddata + ' thead tr' )
      								.append("<th id='" + data['assign_id'] + "'>" + data['assignment_name'] + "</th>");
      							$( '#wp_GradeBook_' + isselecteddata + ' tbody tr:nth-child(even)' )
      								.append("<td ></td>");
      							$( '#wp_GradeBook_' + isselecteddata + ' tbody tr:nth-child(odd)' )
      								.append("<td></td>"); 
      							$( '#wp_GradeBook_' + isselecteddata + ' tbody tr td:last-child' ).each(function(){
    						$(this).editable(ajax_object.ajax_url,{ 
						submitdata: {
							action: 'edit_student',							
							column_id: data['assign_id'],
							comment_ID : $(this).siblings()[0].innerHTML,
							course_id : isselecteddata
						},
							indicator : 'Saving...',        
        						height: '100%',
						        width: '100%',
						        onblur: 'submit'
   						});
					});   
					$( '#wp_GradeBook_' + isselecteddata + ' thead tr th:last-child' ).click(function() {
    						$(this).toggleClass("ui-selected").siblings().removeClass("ui-selected");
    						$('#wp_GradeBook_' + wasselecteddata + ' tbody tr').removeClass('ui-selected');
    			 			$( "#delete-student" ).button( "option", "disabled", true );
						var x = $( '#wp_GradeBook_' + isselecteddata + ' thead tr th' ).hasClass('ui-selected');
							if ( x ) {
								$( "#delete-assignment" ).button( "option", "disabled", false );
							}else{
								$( "#delete-assignment" ).button( "option", "disabled", true );	
							}
    						});  						
					}, 
					"json"
				);
				$(this).dialog( 'close' );
 			},
 			Cancel: function(){
 				$( this ).dialog( "close" );
 			}
 		}
 	});
 	
 	$( "#add-assignment" )
 		.button()
 		.click(function() {
 			$( "#add-assignment-form" ).dialog( "open" );
 		});
 		
	$( "#datepicker_assigned_on" ).datepicker();
	$( "#datepicker_assignment_due_date" ).datepicker();
	
 	$( '#delete-assignment-confirm' ).dialog({
 		autoOpen: false,
 		height: 400,
 		width: 500,
 		modal: true,
		buttons: {
		   	"Delete": function(){
				var x = $( '#wp_GradeBook_' + isselecteddata ).find('.ui-selected').attr('id');
				var y = $( '#wp_GradeBook_' + isselecteddata ).find('.ui-selected').index();
				y = y+1;
				$( '#wp_GradeBook_' + isselecteddata + ' tr th:nth-child(' + y + ')' ).remove();
				$( '#wp_GradeBook_' + isselecteddata + ' tr td:nth-child(' + y + ')' ).remove();
		   		$.get(ajax_object.ajax_url, { 
		   				action: 'delete_assignment',
						assignment_name : x,
						assign_id : x.slice(7),
						course_id : isselecteddata
				}, function(data){ 							
					$( "#delete-assignment-confirm" ).dialog( "close" );
					$( "#delete-assignment" ).button( "option", "disabled", true );
				});
				$(this).dialog('close');
		   	},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		}
 	});

 	
 	$( "#delete-assignment" )
 		.button()
 		.click(function() {
 			$( "#delete-assignment-confirm" ).dialog( "open" );
 		}); 
 	$( "#delete-assignment" ).button( "option", "disabled", true );	

 		
 		
//***************************************************************/
//* jQuery that creates the toggle selection in                 */
//* the courses table and slide transition between gradebooks   */
//***************************************************************/

	var wasselecteddata;
	var isselected;
	var nonetosome = 0;
	var tables_loaded = Array();
		
	
	$("#GradeBook_courses tbody tr td:first-child").each(function(){$(this).click(function() {
    		$(this).parent().toggleClass('ui-selected').siblings().removeClass('ui-selected');
    		isselected = $('#GradeBook_courses').find('.ui-selected td').map(function() {
        		return $(this).text();
    		}).get();
		isselectedlength = isselected.length;
		isselecteddata = isselected[0];
		var wasloaded = false;
		for (i = 0; i< tables_loaded.length;i++){
		    if(tables_loaded[i]==isselected[0]){
		    	wasloaded = true;
		    }
		}
		if (nonetosome === 0 && wasloaded==false) {
			$.ajax({
				url: ajax_object.ajax_url, 
				data:	{ action: 'get_table_data', course_id: isselected[0]}, 
				success: function(data, textStatus, jqXHR ){
					var column_names = data['column_names'];
					var column_id = data['column_ids'];
					var table_data = data['table_data'];
					var number_of_rows = data['number_of_rows'];													
					tables_loaded.push(isselected[0]);
					for(i = 0; i<column_names.length;i++){
						$( "#wp_GradeBook_" + isselecteddata + " thead tr" ).append(
			    				"<th id='" + column_id[i]  + "'>" + column_names[i] + "</th>" 						
       						);
       					};
       					for(i = 0; i<number_of_rows;i++){
						$( "#wp_GradeBook_" + isselecteddata + " tbody" ).append(function(){
						var row_data = "";
							for(j = 0; j<column_names.length;j++){
							if(j==0||j==1){
							row_data = row_data + "<td class='noteditable'>" + table_data[i][j] + "</td>"
							}else{
			    				row_data = row_data + "<td>" + table_data[i][j] + "</td>"
			    				}
			    				};
			    				if (i%2){
			    					return "<tr class='odd'>" + row_data + "</tr>";
			    				} else {
			    					return "<tr class='even'>" + row_data + "</tr>";
			    				}
			    			});
       					};
					$('#wp_GradeBook_' + wasselecteddata + ' tbody tr').removeClass('ui-selected');
    					$('#wp_GradeBook_' + wasselecteddata + ' thead th').removeClass('ui-selected');
			 		$( "#delete-assignment" ).button( "option", "disabled", true );					
					$( "#delete-student" ).button( "option", "disabled", true );   
					$( '#wp_GradeBook_' + isselecteddata + ' tbody td:not(.noteditable)' ).each(function(){
    						$(this).editable(ajax_object.ajax_url,{ 
						submitdata: {
							action: 'edit_student',
							column_id: $('#wp_GradeBook_' + isselecteddata + ' thead th:eq('+
							$( this ).prevAll().length +')').attr('id'),
							comment_ID : $(this).siblings()[0].innerHTML,
							course_id : isselecteddata
						},
							indicator : 'Saving...',        
        						height: '100%',
						        width: '100%',
						        onblur: 'submit'
   						});
					});
					$( "#wp_GradeBook_" + isselecteddata + " tbody td" ).live('click',
					function(){
						var x = $( "#wp_GradeBook_" + isselecteddata ).find( 
						".ui-selected td" ).map(function(){
							return this.innerHTML;
						}).get().join(",").split(',').length;
						if ( x > 1 ) {
							$( "#delete-student" ).button( "option", "disabled", false );
						}else{
							$( "#delete-student" ).button( "option", "disabled", true );	
						}
					});
					$('#wp_GradeBook_' + isselecteddata).show('slide', {
						direction: 'right'
					});
					$('#CRUD-students').show('slide', {
						direction: 'right'
					});
						wasselecteddata = isselecteddata;  					
				},
				dataType: "json",
				async: false	
			});
        		nonetosome = 1;

    		} else if (nonetosome === 1 && wasloaded==false && isselectedlength>1)  {
			$.ajax({
				url: ajax_object.ajax_url, 
				data:	{ action: 'get_table_data', course_id: isselected[0]}, 
				success: function(data, textStatus, jqXHR ){
					var column_names = data['column_names'];
					var column_id = data['column_ids'];
					var table_data = data['table_data'];
					var number_of_rows = data['number_of_rows'];													
					tables_loaded.push(isselected[0]);
					for(i = 0; i<column_names.length;i++){
						$( "#wp_GradeBook_" + isselecteddata + " thead tr" ).append(
			    				"<th id='" + column_id[i]  + "'>" + column_names[i] + "</th>" 						
       						);
       					};
       					for(i = 0; i<number_of_rows;i++){
						$( "#wp_GradeBook_" + isselecteddata + " tbody" ).append(function(){
						var row_data = "";
							for(j = 0; j<column_names.length;j++){
							if(j==0||j==1){
							row_data = row_data + "<td class='noteditable'>" + table_data[i][j] + "</td>"
							}else{
			    				row_data = row_data + "<td>" + table_data[i][j] + "</td>"
			    				}
			    				};
			    				if (i%2){			    				
			    					return "<tr class='odd'>" + row_data + "</tr>";
			    				} else {
			    					return "<tr class='even'>" + row_data + "</tr>";
			    				}
			    			});
       					};
					$('#wp_GradeBook_' + wasselecteddata + ' tbody tr').removeClass('ui-selected');
    					$('#wp_GradeBook_' + wasselecteddata + ' thead th').removeClass('ui-selected');
			 		$( "#delete-assignment" ).button( "option", "disabled", true );						
					$( "#delete-student" ).button( "option", "disabled", true );
					$( '#wp_GradeBook_' + isselecteddata + ' tbody td:not(.noteditable)' ).each(function(){
    						$(this).editable(ajax_object.ajax_url,{ 
						submitdata: {
							action: 'edit_student',
							column_id: $('#wp_GradeBook_' + isselecteddata + ' thead th:eq('+
							$( this ).prevAll().length +')').attr('id'),
							comment_ID : $(this).siblings()[0].innerHTML,
							course_id : isselecteddata
						},
							indicator : 'Saving...',        
        						height: '100%',
						        width: '100%',
						        onblur: 'submit'
   						});
					});
					$( "#wp_GradeBook_" + isselecteddata + " tbody td" ).live('click',
					function(){
						var x = $( "#wp_GradeBook_" + isselecteddata ).find( 
						".ui-selected td" ).map(function(){
							return this.innerHTML;
						}).get().join(",").split(',').length;
						if ( x > 1 ) {
							$( "#delete-student" ).button( "option", "disabled", false );
						}else{
							$( "#delete-student" ).button( "option", "disabled", true );	
						}
					});
					$('#wp_GradeBook_' + wasselecteddata).hide('slide', {
						direction: 'left'
					}, function() {
						$('#wp_GradeBook_' + isselecteddata).show('slide', {
							direction : 'right'
						});
					});
						wasselecteddata = isselected[0];  					     					
				},
				dataType: "json",
				async: false
			});
		} else if (nonetosome === 0 && wasloaded)  {
			nonetosome =1;
			$('#wp_GradeBook_' + isselecteddata).show('slide', {
					direction: 'right'
				});
			$('#CRUD-students').show('slide', {
					direction: 'right'
				});
			$('#wp_GradeBook_' + wasselecteddata + ' tbody tr').removeClass('ui-selected');
    			$('#wp_GradeBook_' + wasselecteddata + ' thead th').removeClass('ui-selected');
	 		$( "#delete-assignment" ).button( "option", "disabled", true );	    			
			$( "#delete-student" ).button( "option", "disabled", true );		
			if (isselectedlength === 0) {
				nonetosome = 0;
				$('#wp_GradeBook_' + wasselecteddata + ' tbody tr').removeClass('ui-selected');
    				$('#wp_GradeBook_' + wasselecteddata + ' thead th').removeClass('ui-selected');
		 		$( "#delete-assignment" ).button( "option", "disabled", true );	
				$( "#delete-student" ).button( "option", "disabled", true );
				$('#CRUD-students').hide('slide', {
					direction: 'left'
				});
			}
			wasselecteddata = isselecteddata;					
		} else {
			$('#wp_GradeBook_' + wasselecteddata).hide('slide', {
					direction: 'left'
				}, function() {	
					$('#wp_GradeBook_' + isselecteddata).show('slide', {
						direction : 'right'
					});
				});
				$('#wp_GradeBook_' + wasselecteddata + ' tbody tr').removeClass('ui-selected');
    				$('#wp_GradeBook_' + wasselecteddata + ' thead th').removeClass('ui-selected');				
				$( "#delete-student" ).button( "option", "disabled", true );
				if (isselectedlength === 0) {
					nonetosome = 0;
				$('#wp_GradeBook_' + wasselecteddata + ' tbody tr').removeClass('ui-selected');
    				$('#wp_GradeBook_' + wasselecteddata + ' thead th').removeClass('ui-selected');				
				$( "#delete-student" ).button( "option", "disabled", true );	
					$('#CRUD-students').hide('slide', {
						direction: 'left'
					});
				}
				wasselecteddata = isselected[0];				
		}
		if(!wasloaded){
		$('#wp_GradeBook_' + isselecteddata + ' thead th:eq(3)').nextAll().click(function() {
    			$(this).toggleClass("ui-selected").siblings().removeClass("ui-selected");  
    			$('#wp_GradeBook_' + wasselecteddata + ' tbody tr').removeClass('ui-selected');
    			 $( "#delete-student" ).button( "option", "disabled", true );	
		var x = $( '#wp_GradeBook_' + isselecteddata + ' thead tr th' ).hasClass('ui-selected');
		if ( x ) {
			$( "#delete-assignment" ).button( "option", "disabled", false );
		}else{
			$( "#delete-assignment" ).button( "option", "disabled", true );	
		}	
  		});
		$('#wp_GradeBook_' + isselecteddata + ' tbody tr td:first-child').each(function(){
			$(this).click(function() {
				$( "#delete-assignment" ).button( "option", "disabled", true );	
    				$(this).parent().toggleClass('ui-selected').siblings().removeClass('ui-selected');
    				$('#wp_GradeBook_' + wasselecteddata + ' thead th').removeClass('ui-selected');
    			});
    		});
    		}
	});
	});

//********************************************/
//* Add/Delete Student Add/Delete Assignment */
//********************************************/
	
	$( "#delete-student-confirm" ).dialog({
		autoOpen: false,
		resizable: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
		   	"Delete": function(){
		   		var x = $( "#wp_GradeBook_" + isselecteddata ).find( ".ui-selected td" ).map(function(){
					return this.innerHTML;	
				}).get().join(",").split(',');
				if ( x.length > 1  ) {
					$.get(ajax_object.ajax_url, { 
						action: 'delete_student',
						comment_ID : x[0],
						user_id : x[1],
						course_id : isselecteddata
					},
					function(data){
						$( "#wp_GradeBook_" + isselecteddata )
							.find( ".ui-selected td" ).parent()
							.remove();
						$( '#wp_GradeBook_' + isselecteddata + ' tbody tr:nth-child(odd)' )
							.removeClass('odd')
							.addClass('even');
      						$( '#wp_GradeBook_' + isselecteddata + ' tbody tr:nth-child(even)' )
      							.removeClass('even')
      							.addClass('odd');     							
						$( "#delete-student-confirm" ).dialog( "close" );
						$( "#delete-student" ).button( "option", "disabled", true );
					});
				} else {
					alert( 'No row selected!'  );
					$( this ).dialog("close");
				}
		   	},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		}
	});
	
	$( "#delete-student" )
		.button()
		.click(function() {
			$( "#delete-student-confirm" ).dialog( "open" );
		});
	$( "#delete-student" ).button( "option", "disabled", true );
	
	
})(jQuery);