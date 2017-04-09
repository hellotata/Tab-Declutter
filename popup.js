setInterval(function() {
  var port = chrome.runtime.connect({name:"mycontentscript"});
  port.onMessage.addListener(function(message,sender){
    var urls = message.greeting;
    var list = $('#list');
    list.html('');
    for (var i = 0; i < urls.length; i++) {
      list.append($('<a href="#">').text(urls[i]));
    }
  });
}, 60000);

document.addEventListener('DOMContentLoaded', function () {
  
var port = chrome.runtime.connect({name:"mycontentscript"});
  port.onMessage.addListener(function(message,sender){
    var urls = message.greeting;
    var list = $('#list');
    list.html('');
    for (var i = 0; i < urls.length; i++) {
      var li = $('<li>');
      var a = $('<a>').attr('href', urls[i]);
      a.attr('target', '_blank');
      a.text(urls[i].slice(0, 30) + "...");
      li.append(a);
      list.append(li);
    }
});
});
