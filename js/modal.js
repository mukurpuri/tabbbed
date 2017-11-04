
$(document).ready(function(){
	$(".modal-close").on("click", function(){
		$(".modal-bg").hide();
	});

	$(".modal-close").on("click", function(){
    	chrome.storage.sync.set({'tabTree': 'hide'});
		$(".modal-bg").hide();
	});

	$(".modal").on("click", function(event){
		//event.stopImmediatePropagation();
	});
});