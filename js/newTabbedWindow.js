
$(document).ready(function(){
	$(".tab-button").on("click", function(){
		var tabs_all = [];
    	$(".link-tag-container").html("");
    	chrome.tabs.query({currentWindow:true},function(_tabs){
    		_tabs.forEach(function(tab){
    			var favURL = tab.favIconUrl;

    			if(!favURL) {
    				favURL = "../images/icons/icon"+  (parseInt(Math.random() * (9 - 1) + 1)).toString() +".png" 
    			}
    			var tab = {
    				'id': tab.id,
    				'title': tab.title,
    				'url': tab.url,
    				'favIconUrl': favURL
    			};
    			tabs_all.push(tab);
    		});
    		$.each(tabs_all, function(index) {
    			var tab = tabs_all[index];
    			$(".link-tag-container").append(
    				'<a title="'+ tab.title +'" class="link-tag" id="tab_tag_' + tab.id + '">' +
    				'<span tabIndex="' + index + '" tabID="' + tab.id + '" class="fa fa-times remove-tab-tag"></span>' +
    				'<img class="link-image" height="20" width="20" src="'+ tab.favIconUrl +'">' +
    				'<span class="link-text">' + tab.title + '</span>' +
    				'</a>'
    			);
    		});
			$(".modal-bg").show();
    	});
	});

	$("body").on('click', '.remove-tab-tag', function(event) {
		console.log('qewf');
		var tabID = parseInt($(this).attr("tabID"));
		$("#tab_tag_" + tabID).remove();
	});

	$("#tabbbed_save").on('click', function(event) {
		event.preventDefault();
		var name = $("#name").val().trim();
		var description = $("#description").val().trim();

		if(name) {

		} else {
			alert("Please provide a name for new tabbbed window");
		}
	});
});