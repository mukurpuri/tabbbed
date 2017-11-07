
$(document).ready(function(){

    chrome.storage.sync.get("tabTree", function(tabTree){
        console.log(tabTree.tabTree);
        if(!tabTree.tabTree) {
            chrome.storage.sync.set({'tabTree': 'hide'});
        }
        if(tabTree.tabTree === "show") {
            openTabTree();    
        }
    });

    var totalTabs = 6;
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
                var tabs = '<a class="tabs filledTabs">'+
                '<span id="' + tabbb.id +'" title="Close" class="fa fa-times tab-remove"></span>'+
                '<div class="tab-opener-buttons">'+
                '<div class="tab-opener-btn openTab" tabbbID="'+tabbb.id+'" title="Open in the current Tab"><i class="fa fa-send"></i></div>'+
                '<div class="tab-opener-btn openNew" tabbbID="'+tabbb.id+'" title="Open in a new window"><i class="fa fa-window-restore"></i></div>'+
                '</div>'+
                '<div class="tab-opener"></div>'+
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

    $("body").on('click', '#group-similar', function(event) {
        var windows = [];
        var tabs = [];
        var urls = [];
        chrome.tabs.query({currentWindow: true},function(_tabs){
            _.each(_tabs, function(tab){
                tabs.push({
                        id: tab.id,
                        url: tab.url,
                });
                chrome.tabs.update(tab.id, {pinned: false});
            });
            
            

            _.each(tabs, function(tab){urls.push(tab.url)});

            

            _.each(_.flattenDeep(groupUrls(urls)), function(url, index){
                var ar = _.find(tabs, function(o) { return o.url === url; });
                chrome.tabs.move(ar.id, {index: index});
            });

        });
    });

    $("body").on("click",".tab-tree", function(){
        openTabTree();
    });

    $("body").on("click",".volume-icon", function(){
        var id = $(this).attr('id');
        if($(this).hasClass('fa-volume-up')) {
            chrome.tabs.update(parseInt(id), {muted: true});
            $(this).removeClass('fa-volume-up').addClass('fa-volume-off');
            $(this).attr("title","Click to unmute");
        } else {
            chrome.tabs.update(parseInt(id), {muted: false});
            $(this).removeClass('fa-volume-off').addClass('fa-volume-up');
            $(this).attr("title","Click to mute");
        }
    });

    $("body").on("click",".close-window-tab", function(){
        var id = parseInt($(this).attr('id').split("_")[2]);
        console.log(id);
        chrome.windows.remove(id, function(){
            $("#tree_"+id).hide('slow', function(){ $("#tree_"+id).remove(); });           
        });
    });

    $("body").on("click",".close-tab", function(){
        var id = parseInt($(this).attr('id').split("_")[2]);
        chrome.tabs.remove(id, function(){
            $("#branch_tab_"+id).hide('slow', function(){ $("#branch_tab_"+id).remove();});
        });
    });

    $("body").on("click", ".navigate-tab", function(){
        var id = parseInt($(this).attr("tabId"));
        var windowId = parseInt($(this).attr("windowId"));
        chrome.windows.update(windowId, {focused: true});
        chrome.tabs.update(id, {'active': true});
    });

    $("body").on("click", ".navigate_window", function(){
        var id = parseInt($(this).attr('id').split("_")[2]);
        chrome.windows.update(id, {focused: true});
    });
});

function groupUrls(urls) {
    const results = urls.reduce((a, x) => {
        const hostparts = new URL(x).host.split('.');
        let host;
        if (hostparts.length < 3) {
            host= hostparts.shift();
        } else {
            host= hostparts.slice(1, hostparts.length - 1);
        }

        if (a[host]) {
            a[host].push(x);
        } else {
            a[host] = [x];
        }
        return a;
    }, {});
    return Object.values(results);
}

function openTabTree() {
    $("#tab-tree-creator").show();
    chrome.storage.sync.set({'tabTree': 'show'});
    fetchTrees();
}

function fetchTrees() {
    $(".tree-container").html("");
    console.log("qwef");
    chrome.windows.getAll(function(windows){
        _.each(windows, function(window, index){
            var windowId = window.id;
            var current_window_indicator = window.focused ? '<span class="current_window_indicator"></span>' : '';
            chrome.tabs.query({windowId:windowId},function(tabs){
                if(!(_.isEmpty(tabs))){
                    var tree_header = '<div class="tree-header" id="tab_tree_header_'+ windowId+'"><span class="close-window-tab fa fa-times-circle" id="close_window_'+ windowId +'"></span>'+ current_window_indicator +'<label class="navigate_window" id="navigate_window_'+ windowId +'">Window '+ (index+1) +'</label></div>';
                    var tree_body = '<div class="tree-body" id="tab_tree_body_'+ windowId+'"></div>';
                    $(".tree-container").append('<div class="tree grid-item" id="tree_'+ windowId +'">' + tree_header + tree_body +'</div>');
                    _.each(tabs, function(tab){
                        var volume_icons = '';
                        if(tab.audible){
                            volume_icons = '<div class="volume-icons"><span title="Click to mute" id="'+ tab.id +'" class="volume-icon fa fa-volume-up"></span></div>';                
                        }
                        var current_tab_indicator = tab.active ? 'current_tab_indicator' : '';
                        $("#tab_tree_body_"+windowId).append('<div id="branch_tab_'+ tab.id +'" class="branch">'+ volume_icons +'<span title="Close this Tab" class="close-tab fa fa-times-circle" id="close_tab_'+ tab.id +'"></span><label tabId="'+ tab.id +'" windowId="'+windowId+'" class="navigate-tab"><img src="' + tab.favIconUrl + '" class="label-favIcon fa fa-file-o"/><span class="label-text '+ current_tab_indicator + '">' + tab.title + '</span></label></div>');
                    });
                }
            });
        })
    });
}