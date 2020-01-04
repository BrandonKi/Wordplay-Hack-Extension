// background.js

// Called when the user clicks on the browser action.
var username;
var password;
var activeTab;
// chrome.browserAction.onClicked.addListener(function(tab) {
//   });
  
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if(request.message === "login"){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          var activeTab = tabs[0];
          chrome.tabs.sendMessage(activeTab.id, {message: "clicked_browser_action"});
      });
      }
      else if(request.message === "open_new_tab") {
        chrome.tabs.create({"url": request.url});
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.storage.sync.get(['name'], function(result) {
                username = result.name;
                chrome.storage.sync.get(['pass'], function(result) {
                  password = result.pass;
                  // var des = confirm("Please Confirm Username and PasswordUsername: " + username + "\nPassword: " + password);
                  // if (des){
                    
                  // } else {
                  //     throw new Error("Incorrect Username and Password");
                  // }
                });
              });
              activeTab = tabs[0];
        });
        setTimeout( function() {
          chrome.tabs.sendMessage(activeTab.id, {"message": "done-loading", username: username, password: password});
        }, 1000);
      }
    }
  );

