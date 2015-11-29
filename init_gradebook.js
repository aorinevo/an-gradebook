(function($){
	var _x = $('a.toplevel_page_an_gradebook');
	console.log(_x);
	_x.attr('href',_x.attr('href') + '#courses');
	var _x = $('a[href$="an_gradebook"]');
	_x.attr('href',_x.attr('href') + '#courses');
	var _x = $('a[href$="an_gradebook_settings"]');
	_x.attr('href',_x.attr('href') + '#settings');		
})(jQuery);