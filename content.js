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
        const password = document.getElementById('password');
        const login = getElementByXpath("/html/body/div/div/div/div/div/div/div/div[1]/form/button");
        // This updates the value on the DOM, but not the displayed value:
        // username.setAttribute('value', 'Bob');

        // This updates the value displayed on the input, but not the DOM:
        //username.value = 'Lumos';

        // Dispatch an "input" event. In some cases, "change" would also work:
        //username.dispatchEvent(new Event('input', { bubbles: true }));

        // It looks like only one field will be updated if both events are dispatched
        // straight away, so you could use a setTimeout here:
        username.focus();
        document.execCommand('insertText', false, 'Lumos');
        password.focus();
        document.execCommand('insertText', false, 'Wordplay');
        login.click();
        
      }
    }
  );

  function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }
  
  function waitForElementToDisplay(selector, time) {
    if(document.querySelector(selector)!=null) {
        alert("The element is displayed, you can put your code instead of this alert.")
        return;
    }
    else {
        setTimeout(function() {
            waitForElementToDisplay(selector, time);
        }, time);
    }
}