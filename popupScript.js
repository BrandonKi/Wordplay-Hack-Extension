document.getElementById('button').addEventListener("click", function(){
    let u = document.getElementById('username');
    let p = document.getElementById('password');
    console.log(u.value + " " + p.value);
    chrome.storage.sync.set({name: u});
    chrome.storage.sync.set({pass: p});
    chrome.tabs.query({active: true}, function(tab){
        chrome.tabs.sendMessage(tab[0].id, {message: "login"});
    });
});