$(document).ready(function(){
    var totalTabs = 6;

    setDashboard();
    function setDashboard() {
        $(".tab-container").html("");

        chrome.storage.sync.get("tabbbes", function(_tabbbes){
            var tabbbes = _tabbbes.tabbbes;
            console.log(tabbbes);
            if(!tabbbes) {chrome.storage.sync.set({'tabbbes': []});}
            _.each(tabbbes, function(tabbb){
                var icons = "";
                _.each(tabbb.tabbbes, function(tabbb){
                    icons = icons + '<img title="' + tabbb.title + '" class="tab-icons" src="' + tabbb.favIconUrl + '"  />'
                });
                var tabs = '<a tabbbID="'+tabbb.id+'" class="tabs filledTabs">'+
                '<div class="tab-opener-buttons">'+
                '<div class="tab-opener-btn openTab" title="Open in the current Tab"><i class="fa fa-send"></i></div>'+
                '<div class="tab-opener-btn openNew" title="Open in a new window"><i class="fa fa-window-restore"></i></div>'+
                '</div>'+
                '<div class="tab-opener"></div>'+
                '<div>'+
                '<span id="' + tabbb.id +'" title="Close" class="fa fa-times tab-remove"></span>'+
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
    }

    $("body").on('click', '.filledTabs', function(event) {
        var id = $(this).attr("tabbbID");
        chrome.storage.sync.get("tabbbes", function(_tabbbes){
            var urlList = [];
            var selectedTabbb = _.find(_tabbbes.tabbbes, function(tabbb) { return parseInt(tabbb.id) === parseInt(id); });
            console.log(selectedTabbb);
            var mode = selectedTabbb.mode === "true" ? true : false;
            _.each(selectedTabbb.tabbbes, function(tabbb){
                urlList.push(tabbb.url);
            });
            chrome.windows.create({'url':urlList,'focused':true, 'incognito': mode, 'state':'maximized'}, function(){
            });
        });
    });
});