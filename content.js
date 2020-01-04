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
        username.focus();
        document.execCommand('insertText', false, request.username);
        password.focus();
        document.execCommand('insertText', false, request.password);
        login.click();
        waitForElementToDisplay("/html/body/div/div/div/div/div[3]/div[1]/div/div[2]/div[2]/div", 100, function(element){
          simulateClick(element);
          waitForElementToDisplay("/html/body/div/div/div/div/div[2]/div[2]/div/a", 100, function(element){
            simulateClick(element);
            waitForElementToDisplay("/html/body/div/div/div/div/h2", 100, function(element){
              var arr = document.getElementsByClassName("word-line");
              var data;
              for(let item of arr){
                if(typeof item.children[0] != 'undefined' && typeof item.children[1] != 'undefined'){
                  data += item.children[0].innerHTML + " : " + item.children[1].innerHTML + "|";
                }
              }
              data = data.substring(9);
              console.log(data);
            });
          });
        });  
      }
    }
  );

  function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }
  

function waitForElementToDisplay(xpath, time, callback) {
  selector = getElementByXpath(xpath);
  if(selector!=null) {
      callback(selector);
      return;
  }
  else {
      setTimeout(function() {
          waitForElementToDisplay(xpath, time, callback);
      }, time);
  }
}

function simulateClick (elem) {
	var evt = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window
	});
	elem.dispatchEvent(evt);
};





