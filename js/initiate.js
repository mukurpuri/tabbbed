$(document).ready(function(){
    var totalTabs = 6;

    setDashboard();
    function setDashboard() {
        $(".tab-container").html("");
        
        chrome.storage.sync.get("titles", function(_titles){
            if(_titles) {chrome.storage.sync.set({'_titles': []});}
        }

        chrome.storage.sync.get("urls", function(_urls){
            if(_urls) {chrome.storage.sync.set({'_urls': []});}
        }
        
        chrome.storage.sync.get("favIconUrls", function(_favIconUrls){
            if(_favIconUrls) {chrome.storage.sync.set({'_favIconUrls': []});}
        }

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
                '<div>'+
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
    }

    $("body").on('click', '.filledTabs', function(event) {
        var id = $(this).attr("tabbbID");
        console.log(id);
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