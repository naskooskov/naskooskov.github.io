'use strict'; 

console.log('Started', self);

var url_linux = "https://chrome-infra-stats.appspot.com/_ah/api/stats/v1/steps/last/chromium.fyi/Site%20Isolation%20Linux/overall__build__result__/1"
var url_win = "https://chrome-infra-stats.appspot.com/_ah/api/stats/v1/steps/last/chromium.fyi/Site%20Isolation%20Win/overall__build__result__/1"

self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
}); 

self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});
  
self.addEventListener('push', function(event) {
  console.log('Push message', event);
  fetch(url_linux).then(function(response) { return response.json(); }).then(notifyBotStatus);
  fetch(url_win).then(function(response) { return response.json(); }).then(notifyBotStatus);
});       

self.addEventListener('notificationclick', function(event) {
  console.log('Notification click: tag', event.notification.tag);
  event.notification.close();
});

function notifyBotStatus(json) {                                            
  console.log('build status:', json);                                       
  var msg = json.step_records[0].builder + ": ";
  if (json.step_records[0].result === "0") {
    msg += " successful.";
  } else if (json.step_records[0].result == "2") {
    msg += " failed!";
  } else {
    msg += " other.";
  }   
  self.registration.showNotification("Build Bot Status", {
    'body': msg,
    'icon': 'images/icon.png'
  }); 
}
