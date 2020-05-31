/* globals chrome */

function setIcon() {
  chrome.storage.sync.get({ enabled: true }, (items) => {
    const isEnabled = items.enabled;

    if (isEnabled) {
      chrome.browserAction.setIcon({ path: 'images/enabled-16.png' });
    } else {
      chrome.browserAction.setIcon({ path: 'images/disabled-16.png' });
    }
  });
}

function main() {
  setIcon();

  chrome.browserAction.onClicked.addListener(() => {
    chrome.storage.sync.get({ enabled: true }, (items) => {
      const isEnabled = !items.enabled;

      chrome.storage.sync.set({ enabled: isEnabled }, () => {
        setIcon();
      });
    });
  });
}

main();
