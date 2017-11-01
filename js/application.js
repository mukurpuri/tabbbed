
$(document).ready(function(){
    var totalTabs = 6;
	$(".power-button").on("click", function(){
		$(this).hide();
		$(".sidebar").removeClass("sidebar-hide").addClass("show-sidebar");
	});
	chrome.storage.onChanged.addListener(function(){
		$(".tab-container").html("");
		chrome.storage.sync.get("tabbbes", function(_tabbbes){
            var tabbbes = _tabbbes.tabbbes;
            if(!tabbbes) {
                console.log('Tabbes cleaned');
                chrome.storage.sync.set({'tabbbes': []});
            }
            _.each(tabbbes, function(tabbb){
                var icons = "";
                _.each(tabbb.tabbbes, function(tabbb){
                    icons = icons + '<img title="' + tabbb.title + '" class="tab-icons" src="' + tabbb.favIconUrl + '"  />'
                });
                var tabs = '<a tabbbID="'+tabbb.id+'" class="tabs filledTabs">'+
                '<span id="' + tabbb.id +'" title="Close" class="fa fa-times tab-close"></span>'+
                '<div class="tab-body">'+icons+'</div>'+ 
                '<div class="tab-footer">'+
                '<div class="tab-name">' + tabbb.name + '</div>'+
                '</div>'+
                '</div>'+
                '</a>';
                $(".tab-container").append(tabs);
            });
            var leftOver = totalTabs - (tabbbes.length);
            if(leftOver > 0) {
                var emptyTabs = '<a class="tabs emptyTabs">'+
                '<div title="Add new Tabbbed Window">'+
                '<div class="tab-body"></div>'+ 
                '<div class="tab-footer">'+
                '<div class="tab-name">' + 'New +' + '</div>'+
                '</div>'+
                '</div>'+
                '</a>';
                for(var i=0;i<leftOver;i++) {
                    $(".tab-container").append(emptyTabs);
                }
            }
        });
	});
});