(function($){
	var _x = document.querySelector('.toplevel_page_an_gradebook');	
	_x.setAttribute('href',_x.getAttribute('href') + '#courses');
	var _x = document.querySelector('[href$="an_gradebook"]');
	_x.setAttribute('href',_x.getAttribute('href') + '#courses');
	var _x = document.querySelector('[href$="an_gradebook_settings"]');
	_x.setAttribute('href',_x.getAttribute('href') + '#settings');	
})(jQuery);