
$(document).ready(function(){
	$(".power-button").on("click", function(){
		$(this).hide();
		$(".sidebar").removeClass("sidebar-hide").addClass("show-sidebar");
	});
});