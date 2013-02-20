(function($) {
	var wasselecteddata;
	var nonetosome = 0;
	$("#GradeBook_courses tbody tr td").click(function() {
    		$(this).parent().toggleClass('ui-selected').siblings().removeClass('ui-selected');
    		isselected = $('#GradeBook_courses').find('.ui-selected td').map(function() {
        		return $(this).text();
    		}).get();
		isselectedlength = isselected.length;
		
		isselecteddata = isselected[0];

		if (nonetosome === 0 && isselectedlength !=0)  {
			nonetosome =1;
			$('#wp_students_GradeBook_' + isselecteddata).show('slide', {
					direction: 'right'
				});

			wasselecteddata = isselecteddata;					
		} else if (nonetosome === 0 && isselectedlength ===0)  {

			$('#wp_students_GradeBook_' + wasselecteddata).hide('slide', {
					direction: 'left'
				});
			nonetosome=0;
			wasselecteddata = isselecteddata;					
		} else if (nonetosome == 1 && isselectedlength === 0)  {

			$('#wp_students_GradeBook_' + wasselecteddata).hide('slide', {
					direction: 'left'
				});
			nonetosome=0;
			wasselecteddata = isselecteddata;					
		} else {

			$('#wp_students_GradeBook_' + wasselecteddata).hide('slide', {
					direction: 'left'
				}, function() {
					$('#wp_students_GradeBook_' + isselecteddata).show('slide', {
						direction : 'right'
					});
				});
				wasselecteddata = isselected[0];
				
		}
	$('.students_GradeBook thead th').removeClass('ui-selected');
	$('#chart_div').css('visibility', 'hidden');
	    $.get(ajax_object.ajax_url,
		{ action: 'get_assign_data', course_id: isselecteddata}, 
		function(data){
			var num_rows = data['num_rows'];
			var assign_data = data['data'];
			for(j=0;j<num_rows; j++){
			$( '#wp_students_GradeBook_' + isselecteddata + ' thead tr th[id=assign_'+assign_data[j][0]+']')
			.tooltip({content: 'Date Due: '+ assign_data[j][3] });
			}
				},
				"json"	
			);
	});
	

	
	var yz = $( '#GradeBook_courses tbody tr td:first-child').map(function() {
        		return $(this).text();
    		}).get();    		
    	for(i = 0; i<yz.length; i++){
	$('#wp_students_GradeBook_'+yz[i]+' thead th:eq(3)').nextAll().click(function() {
    		$(this).toggleClass("ui-selected").siblings().removeClass("ui-selected"); 
		var assign_id = $( '#wp_students_GradeBook_' + isselecteddata ).find('.ui-selected').attr('id');
		if($('.students_GradeBook thead th').hasClass('ui-selected')){
		$.get(ajax_object.ajax_url, { 
						action: 'get_pie_chart',
						assign_id : assign_id.slice(7),
						course_id : isselecteddata
					},
					function(data){
						drawChart(data['num']);
						$('#chart_div').css('visibility','visible');
					}, 
					'json');
		} else {
		$('#chart_div').css('visibility', 'hidden');
		}
  	});
  	}						
})(jQuery);