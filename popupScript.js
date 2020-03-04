let u = document.getElementById('username');
let p = document.getElementById('password');
chrome.storage.local.get(['name'], function (result) {
    u.value = typeof result.name != 'undefined' ? result.name : '';
    chrome.storage.local.get(['pass'], function (result) {
        p.value = typeof result.pass != 'undefined' ? result.pass : '';
    });
});
document.getElementById('button').addEventListener("click", function () {
    chrome.storage.local.set({ name: u.value });
    chrome.storage.local.set({ pass: p.value });
    chrome.tabs.query({ active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: "login" });
    });
});

document.getElementById('reset').addEventListener("click", function () {
    chrome.storage.local.clear();
    u.value = '';
    p.value = '';
});