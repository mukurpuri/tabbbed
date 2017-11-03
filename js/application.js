
$(document).ready(function(){
    
    openTabTree();

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

    $("body").on("click",".close-tab", function(){
        var id = $(this).attr('id');
        var url = $(this).attr('url');
        var index = $(this).attr('index');

        if($(this).is(":checked")){
            console.log(index);
            chrome.tabs.create({'url':url, 'index': parseInt(index),'active':false}, function(tab){
                $(".close-tab#" + id).attr("id",tab.id);
            });
        } else {
            chrome.tabs.remove(parseInt(id));
        }
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
    $(".tree").html("");

    chrome.windows.getAll(function(windows){
        _.each(windows, function(window){
            var windowId = window.id;
            $(".tree-container").append('<div class="tree" id="'+ windowId +'"></div>');
            chrome.tabs.query({windowId:windowId},function(tabs){
                _.each(tabs, function(tab){
                    var volume_icon = '';

                    if(tab.audible){
                        volume_icon = '<span title="Click to mute" id="'+ tab.id +'" class="volume-icon fa fa-volume-up"></span>';                
                    }
                    $(".tree#"+windowId).append('<div class="branch">'+ volume_icon +'<label><input class="close-tab" index="'+ tab.index +'" url="'+ tab.url +'" checked id="'+ tab.id +'" type="checkbox" name="checkbox" value="value"><img src="' + tab.favIconUrl + '" class="label-favIcon fa fa-file-o"/><span class="label-text">' + tab.title + '</span></label></div>');
                });
            });
        })
    });
}