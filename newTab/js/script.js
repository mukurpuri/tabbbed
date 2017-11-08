$(document).ready(function($) {
	$("#search_form_input_homepage").focus();
	$("body").on('keyup', '#search_form_input_homepage', function(event) {
		if(event.keyCode == 13){
			location.href = 'https://www.google.co.in/search?q=' + $("#search_form_input_homepage").val();
		}
	});
});

