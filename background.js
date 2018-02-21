function enableAndReload() {
  chrome.storage.sync.set({enabled: true}, function() {
    window.location.reload();
  })
}

function disableAndReload() {
  chrome.storage.sync.set({enabled: false}, function() {
    window.location.reload();
  })
}

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.storage.sync.get({enabled: true}, function(items) {
    if (items.enabled) {
      disableAndReload();
    } else {
      enableAndReload();
    }
  })
});
