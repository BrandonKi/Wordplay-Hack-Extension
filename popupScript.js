let u = document.getElementById('username');
let p = document.getElementById('password');
document.getElementById('button').addEventListener("click", function(){
    console.log(u.value + " " + p.value);
    chrome.storage.sync.set({name: u.value});
    chrome.storage.sync.set({pass: p.value});
    chrome.tabs.query({active: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {message: "login"});
    });
});