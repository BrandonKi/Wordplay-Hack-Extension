// content.js
var data;
var amount;
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message == "login") {
      chrome.runtime.sendMessage({ message: "login" });
    }
    else if (request.message === "clicked_browser_action") {
      var firstHref = 'https://wordplay.com/login';
      chrome.runtime.sendMessage({ "message": "open_new_tab", "url": firstHref });
    }
    else if (request.message === "done-loading") {
      const username = document.getElementById('username');
      const password = document.getElementById('password');
      const login = getElementByXpath("/html/body/div/div/div/div/div/div/div/div[1]/form/button");
      username.focus();
      document.execCommand('insertText', false, request.username);
      password.focus();
      document.execCommand('insertText', false, request.password);
      login.click();
      chrome.storage.local.get(['data'], function (result) {
        if (typeof result.data == 'undefined') {
          waitForElementToDisplay("/html/body/div/div/div/div/div[3]/div[1]/div/div[2]/div[2]/div", 100, function (element) {
            simulateClick(element);
            waitForElementToDisplay("/html/body/div/div/div/div/div[2]/div[2]/div/a", 100, function (element) {
              simulateClick(element);
              waitForElementToDisplay("/html/body/div/div/div/div/h2", 100, function (element) {
                var arr = document.getElementsByClassName("word-line");
                var dataStr;
                for (let item of arr) {
                  if (typeof item.children[0] != 'undefined' && typeof item.children[1] != 'undefined') {
                    dataStr += item.children[0].innerHTML + '|' + item.children[1].innerHTML + '|';
                  }
                }
                dataStr = dataStr.substring(9);
                chrome.storage.local.set({ data: dataStr });
                chrome.storage.local.get(['data'], function (result) {
                  data = toArray(result.data);
                  simulateClick(getElementByXpath('/html/body/div/div/nav/div/div/div[2]/ul/li[2]/a'));
                  setTimeout(function(){
                    chrome.runtime.sendMessage({ "message": "restart"});
                  }, 100);
                });
              });
            });
          });
        } else {
          chrome.storage.local.get(['data'], function (result) {
            data = toArray(result.data);
            waitForElementToDisplay("/html/body/div/div/div/div/div[3]/div[2]/div[1]/div[2]/div[2]/a", 100, function (element) {
              amount = parseInt(getElementByXpath('/html/body/div/div/div/div/div[3]/div[2]/div[1]/div[2]/div[1]/div[2]/div/div[3]/h5').innerHTML, 10) + parseInt(getElementByXpath('/html/body/div/div/div/div/div[3]/div[2]/div[1]/div[2]/div[1]/div[2]/div/div[2]/h5').innerHTML, 10);
              setTimeout(function () {
                simulateClick(element);
                setTimeout(function () {
                  startQuestionLoop();
                }, 100);
              }, 100);

            });
          });
        }
      });

    }
  }
);

function startQuestionLoop() {
    waitForElementToDisplay('/html/body/div/div/div[1]/div[2]/div[2]/div[1]/div', 100, function(qBox){
      arr = qBox.children;
      var searchFor;
      searchFor = arr[0].innerHTML;
      //searchFor = arr[0].innerHTML + typeof arr[1] != 'undefined'? '' : arr[1].innerHTML;
      var result = find(searchFor);
      result = result.indexOf('[') != -1 ? result.substring(0, result.indexOf('[')): result;
      waitForElementToDisplay('/html/body/div/div/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div[2]/div[1]/input', 100, function(inputBox){
        inputBox.focus();
        insertText(inputBox, result, function(){
          waitForElementToDisplay('/html/body/div/div/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div[2]/div[1]/span/button', 100, function(submitButton){
            setTimeout(function(){
              if(inputBox.value != "")
                submitButton.click();
            }, 10);
            if(getElementByXpath('/html/body/div/div/div[1]/div[2]/div[2]/div[2]/div/div[1]/div/p').textContent.indexOf('T') != -1){
              console.log(1111);
              insertText(inputBox, getElementByXpath('/html/body/div/div/div[1]/div[2]/div[2]/div[2]/div/div[1]/div/p').textContent.substring(5), function(){
                setTimeout(function(){
                  if(inputBox.value != "")
                    submitButton.click();
                }, 10);
                waitForElementToChange('/html/body/div/div/div[1]/div[2]/div[2]/div[1]/div', 100, searchFor, function(qBox){
                  startQuestionLoop();
              });
              });
            }else
              waitForElementToChange('/html/body/div/div/div[1]/div[2]/div[2]/div[1]/div', 100, searchFor, function(qBox){
                  startQuestionLoop();
              });
          });
        });
        
        
      });
    });
}

function insertText(input, value, callback){
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  //document.execCommand('insertText', false, value);
  setTimeout(function(){
    callback();
  }, 1000);
}

function find(searchFor){
  for(let i = 0; i < data.length; i++){
    if(data[i] == searchFor || data[i] === searchFor.substring(0,'['))
      if(i % 2 === 0)
        return data[i+1];
      else if (i % 2 === 1)
        return data[i-1];
  }
  for(let i = 0; i < data.length; i++){
    if(data[i].indexOf(searchFor) !== -1)
      if(i % 2 == 0)
        return data[i+1];
      else if (i % 2 == 1)
        return data[i-1];
  }
}

function backFind(searchFor){
  for(let i = data.length; i > 0; i++){
    if(data[i] === searchFor)
      if(i % 2 === 0)
        return data[i+1];
      else if (i % 2 === 1)
        return data[i-1];
  }
  for(let i = data.length; i < 0; i++){
    if(data[i].indexOf(searchFor) !== -1)
      if(i % 2 == 0)
        return data[i+1];
      else if (i % 2 == 1)
        return data[i-1];
  }
}

function toArray(string) {
  return string.split('|');
}

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function waitForElementToChange(xpath, time, current, callback) {
  selector = getElementByXpath(xpath);
  if (selector != null && selector.children[0] != current) {
    callback(selector);
    return;
  }
  else {
    setTimeout(function () {
      waitForElementToDisplay(xpath, time, callback);
    }, time);
  }
}

function waitForElementToDisplay(xpath, time, callback) {
  selector = getElementByXpath(xpath);
  if (selector != null) {
    callback(selector);
    return;
  }
  else {
    setTimeout(function () {
      waitForElementToDisplay(xpath, time, callback);
    }, time);
  }
}

function simulateClick(elem) {
  var evt = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  elem.dispatchEvent(evt);
};