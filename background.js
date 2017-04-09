chrome.runtime.onConnect.addListener(function(port){
  port.postMessage({greeting:historyArray});
});

// storage stores the deleteAt value
var storage = [];

// store the url in history when removed
var historyArray = [];

chrome.tabs.onCreated.addListener(function(newTab) {
  var id = JSON.stringify(newTab.id);
  var now = new Date();
  var newObj = Object.create(newTab);
  newObj.deleteAt = now.setTime(now.getTime() + (5000));

  storage.push(newObj);
});

var interval = setInterval(function() {

  if (storage.length) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if(tabs[0] === undefined) {
        return;
      }
      var activeTab = JSON.stringify(tabs[0].id);
      var index;
      for (var i = 0; i < storage.length; i++) {
        if (JSON.stringify(storage[i].id) == activeTab) {
          index = i;
          break;
        }
      }
      if (index >= 0) {
        var now = new Date();
        storage[index].deleteAt = now.setTime(now.getTime() + (5000));
        storage[index].url = tabs[0].url;
      }
    })
  }

  for (var i = 0; i < storage.length;) {
    if (Date.now() - storage[i].deleteAt >= 20000) {
      // store in history
      if (storage[i].url !== 'chrome://newtab/') {
        historyArray.push(storage[i].url);
      }
      // remove from window
      chrome.tabs.remove(storage[i].id, function() {
        console.log('removed tab from window');
      });
      // remove from storage
      storage = storage.slice(0, i).concat(storage.slice(i+1));
    } else {
      i++;
    }
  }
  
}, 1000);
