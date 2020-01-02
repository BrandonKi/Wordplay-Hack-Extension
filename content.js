// content.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request.message);
      if(request.message == "login"){
          chrome.runtime.sendMessage({});
      }
      else if( request.message === "clicked_browser_action" ) {
        var firstHref = 'https://wordplay.com/login';
        console.log(firstHref);
        chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
      }
      else if (request.message === "done-loading"){
          var el = document.getElementById('username');
          el.value = request.username;
          el = document.getElementById('password');
          el.value = request.password;
      }
    }
  );