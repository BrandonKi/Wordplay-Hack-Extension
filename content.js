// content.js
var data;
var amount;
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
        chrome.storage.local.get(['data'], function(result){
          if(typeof result.data == 'undefined'){
            waitForElementToDisplay("/html/body/div/div/div/div/div[3]/div[1]/div/div[2]/div[2]/div", 100, function(element){
              simulateClick(element);
              waitForElementToDisplay("/html/body/div/div/div/div/div[2]/div[2]/div/a", 100, function(element){
                simulateClick(element);
                waitForElementToDisplay("/html/body/div/div/div/div/h2", 100, function(element){
                  var arr = document.getElementsByClassName("word-line");
                  var dataStr;
                  for(let item of arr){
                    if(typeof item.children[0] != 'undefined' && typeof item.children[1] != 'undefined'){
                      dataStr += item.children[0].innerHTML + '|' + item.children[1].innerHTML + '|';
                    }
                  }
                  dataStr = dataStr.substring(9);
                  console.log(dataStr);
                  chrome.storage.local.set({data: dataStr});
                  chrome.storage.local.get(['data'], function(result){
                    data = toArray(result.data);
                    console.log(data);
                    window.location.href = 'https://wordplay.com/account';
                    //chrome.runtime.sendMessage({"message": "navigate_to", "url": 'https://wordplay.com/account'});
                    waitForElementToDisplay("/html/body/div/div/div/div/div[3]/div[2]/div[1]/div[2]/div[2]/a", 100, function(element){
                      amount = parseInt(getElementByXpath('/html/body/div/div/div/div/div[3]/div[2]/div[1]/div[2]/div[1]/div[2]/div/div[3]/h5').innerHTML, 10) + parseInt(getElementByXpath('/html/body/div/div/div/div/div[3]/div[2]/div[1]/div[2]/div[1]/div[2]/div/div[2]/h5').innerHTML, 10);
                      console.log(amount);
                      setTimeout(function(){
                        simulateClick(element);
                      }, 10);
                    });
                  });
                });
              }); 
            });  
          }else{
            chrome.storage.local.get(['data'], function(result){
              data = toArray(result.data);
              console.log(data);
              waitForElementToDisplay("/html/body/div/div/div/div/div[3]/div[2]/div[1]/div[2]/div[2]/a", 100, function(element){
                amount = parseInt(getElementByXpath('/html/body/div/div/div/div/div[3]/div[2]/div[1]/div[2]/div[1]/div[2]/div/div[3]/h5').innerHTML, 10) + parseInt(getElementByXpath('/html/body/div/div/div/div/div[3]/div[2]/div[1]/div[2]/div[1]/div[2]/div/div[2]/h5').innerHTML, 10);
                console.log(amount);
                setTimeout(function(){
                  simulateClick(element);
                }, 10);
                
              });
            });
          }
        });
        
      }
    }
  );

  function toArray(string){
    return string.split('|');
  }

  function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }
  

function waitForElementToDisplay(xpath, time, callback) {
  selector = getElementByXpath(xpath);
  console.log(selector);
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





