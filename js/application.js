
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
        var windowId = parseInt($(this).attr('windowId'));
        chrome.windows.remove(windowId, function(){
            $("#tree_"+windowId).remove();
        });
    });

    $("body").on("click",".close-tab", function(){
        var id = parseInt($(this).attr('id'));
        var url = $(this).attr('url');
        var index = parseInt($(this).attr('index'));
        var windowId = parseInt($(this).attr('windowId'));

        if($(this).is(":checked")){
            chrome.tabs.create({'url':url, 'index': index,'active':false, 'windowId':windowId}, function(tab){
                $(".close-tab#" + id).attr("id",tab.id);
                $(".close-tab#" + id).attr("windowId",tab.windowId);
            });
        } else {
            chrome.tabs.remove(id);
        }
    });

    $("body").on("click", ".navigate-tab", function(){
        var id = parseInt($(this).attr("tabId"));
        var windowId = parseInt($(this).attr("windowId"));
        console.log(id+"__"+windowId);
        chrome.windows.update(windowId, {focused: true}, function(window){
            chrome.tabs.update(id, {'active': true});
        });
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
    chrome.windows.getAll(function(windows){
        _.each(windows, function(window, index){
            var windowId = window.id;
            chrome.tabs.query({windowId:windowId},function(tabs){
                if(!(_.isEmpty(tabs))){
                    var tree_header = '<div class="tree-header" id="tab_tree_header_'+ windowId+'"><input class="close-window-tab" windowId="'+windowId+'" checked id="close_window_'+ windowId +'" type="checkbox"/><label>Window '+ (index+1) +'</label></div>';
                    var tree_body = '<div class="tree-body" id="tab_tree_body_'+ windowId+'"></div>';
                    $(".tree-container").append('<div class="tree" id="tree_'+ windowId +'">'+ tree_header + tree_body +'</div>');
                    _.each(tabs, function(tab){
                        var volume_icon = '';
                        if(tab.audible){
                            volume_icon = '<span title="Click to mute" id="'+ tab.id +'" class="volume-icon fa fa-volume-up"></span>';                
                        }
                        $("#tab_tree_body_"+windowId).append('<div class="branch">'+ volume_icon +'<input class="close-tab" windowId="'+windowId+'" index="'+ tab.index +'" url="'+ tab.url +'" checked id="'+ tab.id +'" type="checkbox"><label tabId="'+ tab.id +'" windowId="'+windowId+'" class="navigate-tab"><img src="' + tab.favIconUrl + '" class="label-favIcon fa fa-file-o"/><span class="label-text">' + tab.title + '</span></label></div>');
                    });
                }
            });
        })
    });
}