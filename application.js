$(document).ready(function(){

	$(".power-button").on("click", function(){
		$(this).hide();
		$(".sidebar").removeClass("sidebar-hide").addClass("show-sidebar");
	});

	$(".tab-button").on("click", function(){
		$(".modal-bg").show();
	});

	$(".modal-close").on("click", function(){
		$(".modal-bg").hide();
	});

});