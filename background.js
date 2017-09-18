chrome.runtime.onUpdateAvailable.addListener(function(details) {
    console.log("updating to version " + details.version);
    chrome.runtime.reload();
});

var core = {
  "getOptions": function(){
    console.log('getOptions', localStorage);
    return localStorage;
  },
}

window.onload = function(){
  chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
    var ret = (core[request.action] || function(){}).apply(this, request.args);
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
        iconUrl: icon+'.png',
        title: title,
        message: message		
    });
	chrome.notifications.onClicked.addListener(function() {
		if(info.u != undefined && info.u != ""){
			chrome.tabs.create({url: info.u});
		}
    });
}

function GetSavedItem(id)
{
	if (!savedItems[id])
	{
		var properties = new Object;
		
		properties.display = true;
		properties.folded = true;
		
		savedItems[id] = properties;
	}
	return savedItems[id];
}

function CreateMenuItem(parentId, node, callback)
{
	var properties = new Object;
	
	
	if (node.title && node.title.length)
		properties.title = node.title;
	else
		properties.title = node.url;

	properties.contexts = defaultButtonVisibility;
	
	if (node.url)
	{
		properties.onclick = function(info, tab)
							{
								var openInTab			= GetBooleanFromStorage("OpenInTab");
								var openInBackground	= GetBooleanFromStorage("OpenInBackground");
								OpenLink(tab, node, openInTab, openInBackground);
							};
	}
	else
	{
		properties.onclick = function(info, tab)
							{
								if (GetBooleanFromStorage("RightClickOpenFolder") == false)
									return ;
								var openInBackground	= GetBooleanFromStorage("OpenFolderInBackground");
								OpenAllLink(tab, node, true, openInBackground);
							};
	}
		
	if (parentId)
		properties.parentId = parentId;

	return chrome.contextMenus.create(properties, function () {
		if( !! chrome.runtime.lastError )
			console.log('Error creating menu item: ' + chrome.runtime.lastError);
		if (callback)
			callback();
	});
}

function ParseTree(rootId, nodeId, tree, parentId, displayLink)
{
	for (var index in tree)
	{
		var node = tree[index];
		var id =  parentId;	
		var display = GetSavedItem(node.id).display;
		
		if (display && (!node.url || displayLink))
		{
			id = CreateMenuItem(parentId, node);
			if (!rootId && id)
			{
				rootId = id;
				AddChromeSpecific(rootId);
			}
		}
		if (node.children)
			rootId = ParseTree(rootId, node.id, node.children, id, display);
			
		if (!parentId && rootId)
			parentId = rootId;
	}
	
	if (displayLink)
		AddActions(nodeId, parentId);
		
	return rootId;
}

function AddChromeSpecific(parentId)
{
	var displayAppLink	= GetBooleanFromStorage("DisplayAppLink");
	
	if (displayAppLink)
		chrome.contextMenus.create({'title':chrome.i18n.getMessage("Title_AppLink"), 'parentId':parentId, 'onclick': OpenAppLink, 'contexts':defaultButtonVisibility });
	if (displayAppLink)
		chrome.contextMenus.create({'type':'separator', 'parentId':parentId, 'contexts':defaultButtonVisibility});
		
}

function AddOptions(parentId)
{
	var displayOptions	= GetBooleanFromStorage("DisplayOptions");
	var displayRefresh	= GetBooleanFromStorage("DisplayRefresh");
	var displayManager	= GetBooleanFromStorage("DisplayBookmarkManager");
	
	if (displayOptions || displayRefresh || displayManager)
		chrome.contextMenus.create({'type':'separator', 'parentId':parentId, 'contexts':defaultButtonVisibility});
	if (displayManager)
		chrome.contextMenus.create({'title':chrome.i18n.getMessage("Title_ManageBookmarks"), 'parentId':parentId, 'onclick': OpenManager, 'contexts':defaultButtonVisibility});
	if (displayOptions)
		chrome.contextMenus.create({'title':chrome.i18n.getMessage("Title_Options"), 'parentId':parentId, 'onclick': OpenOptions, 'contexts':defaultButtonVisibility});
	if (displayRefresh)
		chrome.contextMenus.create({'title':chrome.i18n.getMessage("Title_Refresh"), 'parentId':parentId, 'onclick': Refresh, 'contexts':defaultButtonVisibility});
}

function StartParseTree(tree)
{
	var rootId = null;
	rootId = ParseTree(rootId, tree[0].id, tree[0].children, null, true);
	if (rootId == null)
		AddChromeSpecific(rootId);
	AddOptions(rootId);
		
	buildingMenu = false;
	if (needRefresh)
		Refresh();
}

function BuildMenu()
{
	chrome.storage.local.get('BookmarksSetting', function (items) {
	
		savedItems = items['BookmarksSetting'];
		if (!savedItems)
			savedItems = new Object;
			
		chrome.bookmarks.getTree(StartParseTree);
	});
}

function requestHandler(requestStr, sender, sendResponse)
{
	Refresh();
}

function Refresh(){
    chrome.contextMenus.removeAll(BuildMenu);
}

chrome.extension.onRequest.addListener(requestHandler);