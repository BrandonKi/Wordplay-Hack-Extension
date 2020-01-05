// background.js

// Called when the user clicks on the browser action.
var username;
var password;
var activeTab;
// chrome.browserAction.onClicked.addListener(function(tab) {
//   });

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "login") {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { message: "clicked_browser_action" });
      });
    }
    else if (request.message === "open_new_tab") {
      chrome.tabs.create({ "url": request.url });
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.storage.local.get(['name'], function (result) {
          username = result.name;
          chrome.storage.local.get(['pass'], function (result) {
            password = result.pass;
          });
        });
        activeTab = tabs[0];
      });
      setTimeout(function () {
        chrome.tabs.sendMessage(activeTab.id, { "message": "done-loading", username: username, password: password });
      }, 1000);
    } else if (request.message == 'restart') {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.remove(tabs[0].id, function(){
          chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { message: "clicked_browser_action" });
          });
        });
      });
      
    }
  }
);

