
$(document).ready(function(){

    chrome.storage.sync.get("tabbbes", function(tabbbes){
        if(!tabbbes) {
            chrome.storage.sync.set({'tabbbes': {}});
        }
        $(".unoccupied").each(function(){
            $(this).html("");
            $(this).removeClass("unoccupied").addClass("occupied");
        });
    }); /* Initiating Tabbbes*/



	$(".power-button").on("click", function(){
		$(this).hide();
		$(".sidebar").removeClass("sidebar-hide").addClass("show-sidebar");
	});
});