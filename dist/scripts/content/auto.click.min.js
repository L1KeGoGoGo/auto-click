chrome.extension.sendRequest({
  "action": "getOptions",
  "args": []
}, function (response) {
  var queries = {}
  for (var k in response) {
    if (k.match(/^(xpath|url|interval|count)-(\d+)/)) {
      var type = RegExp.$1;
      var id = RegExp.$2;
      queries[id] = queries[id] || {}
      queries[id][type] = response[k];
    }
  };
  for (id in queries) {
    var q = queries[id]
    if (document.location.href.match(new RegExp(q['url']))) {
      q.id = id;
      q[id + "tempCount"] = q["count"];
      click(q);
    }
  }
});

var retry = 5;
function click(q) {
  if (q[q["id"] + "tempCount"] > 0) {
    q[q["id"] + "tempCount"] = parseInt(q[q["id"] + "tempCount"]) - 1;

    var i = 0, nodes = document.evaluate(q['xpath'], document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (nodes !== null) {
      retry = 5;
      while (i < nodes.snapshotLength) {
        nodes.snapshotItem(i++).click();
      }
      setTimeout(function () {
        click(q);
      }, q['interval'] * 1000);
    } else {
      if (retry != 0) {
        retry--;
        click(q);
      } else {
        console.error(q);
      }
    }
  } else {
    delete q[q["id"] + "tempCount"];
    delete q["id"];
  }
}
