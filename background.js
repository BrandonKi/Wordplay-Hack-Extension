// background.js

// Called when the user clicks on the browser action.
var username;
var password;
chrome.browserAction.onClicked.addListener(function(tab) {
    // Send a message to the active tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {message: "clicked_browser_action"});
    });
  });
  
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "open_new_tab" ) {
        chrome.tabs.create({"url": request.url});
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.storage.sync.get(['name'], function(result) {
                username = result.name;
              });
    
              chrome.storage.sync.get(['pass'], function(result) {
                password = result.pass;
              });
            var des = confirm("Username: " + username + "\nPassword: " + password);

            if (des){
                txt = "Confirmed";
                
            } else {
                txt = "User cancelled the prompt.";
            }
            alert(txt);
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": "done-loading", username: "test", password: "test1"});
        });
      }
    }
  );

