
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
    				'<a title="'+ tab.title +'" class="link-tag" id="tab_tag_' + tab.id + '" favIconUrl="'+ tab.favIconUrl +'">' +
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
		$("#tab_tag_" + parseInt($(this).attr("tabID"))).remove();
	});

	$("#tabbbed_save").on('click', function(event) {
		event.preventDefault();
		var tabbb = [];
		var name = $("#name").val().trim();
		var description = $("#description").val().trim();
		var tabbbes = [];

		if(name) {
			$(".link-tag").each(function(){
				var tag = {
					"id": $(this).attr("id"),
					"title": $(this).attr("title"),
					"favIconUrl": $(this).attr("favIconUrl")
				};
				tabbbes.push(tag);
			});
			if(tabbbes.length <= 0) {
				alert("Select atleast one website")
			} else {
				tabbb = {
					"id": Math.floor(Date.now()),
					"name": name,
					"description": description,
					"tabbbes": tabbbes
				}
				chrome.storage.sync.get("tabbbes", function(_tabbbes){
					var newTabbbes = _tabbbes.tabbbes;
					newTabbbes.push(tabbb);
					chrome.storage.sync.set({'tabbbes': newTabbbes}, function(){
						alert("Saved");
					});
				});
			}
		} else {
			alert("Please provide a name for new tabbbed window");
		}
	});
});