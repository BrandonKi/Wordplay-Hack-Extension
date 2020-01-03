// content.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request.message);
      if(request.message == "login"){
          chrome.runtime.sendMessage({message:"login"});
      }
      else if( request.message === "clicked_browser_action" ) {
        var firstHref = 'https://wordplay.com/login';
        console.log(firstHref);
        chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
      }
      else if (request.message === "done-loading"){
          const username = document.getElementById('username');
          username.value = request.username;
          username.dispatchEvent(new Event('change'));
          const password = document.getElementById('password');
          password.value = request.password;
          password.dispatchEvent(new Event('change'));
      }
    }
  );