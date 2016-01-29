
var reg;
var sub;
var isSubscribed = false;
var subscribeButton = document.querySelector('button');
var subId = document.getElementById('sub_id');
var debugOut = document.getElementById('debug');

function log(msg) {
  console.log(msg);
  //debugOut.innerHTML += msg + '<br>';
}

if ('serviceWorker' in navigator) {
  log('Service Worker is supported');
  navigator.serviceWorker.register('sw.js').then(function() {
    return navigator.serviceWorker.ready;
  }).then(function(serviceWorkerRegistration) {
    reg = serviceWorkerRegistration;
    subscribeButton.disabled = false;
    log('Service Worker is ready :^) ' + reg);
    serviceWorkerRegistration.pushManager.getSubscription()
      .then(function(subscription) {
        if (!subscription) {
          subscribeButton.textContent = 'Subscribe';
          isSubscribed = false;
          return;
        }

        subscribeButton.textContent = 'Unsubscribe';
        subId.innerText = subscription.endpoint;
        isSubscribed = true;
        
        setSubId(subscription);
      })
      .catch(function(err) {
        log('Error during getSubscription() ' + err);
      });
  }).catch(function(error) {
    log('Service Worker Error :^( ' + error);
  });
}

subscribeButton.addEventListener('click', function() {
  if (isSubscribed) {
    unsubscribe();
  } else {
    subscribe();
  }
});

function subscribe() {
  reg.pushManager.subscribe({userVisibleOnly: true}).
  then(function(pushSubscription) {
    sub = pushSubscription;
    log('Subscribed! Endpoint:' + sub.endpoint);
    subscribeButton.textContent = 'Unsubscribe';
    subId.innerText = sub.endpoint;
    isSubscribed = true;
    setSubId(sub);
  });
}

function unsubscribe() {
  sub.unsubscribe().then(function(event) {
    subscribeButton.textContent = 'Subscribe';
    log('Unsubscribed! ' + event);
    isSubscribed = false;
  }).catch(function(error) {
    log('Error unsubscribing ' + error);
    subscribeButton.textContent = 'Subscribe';
  });
}

function setSubId(subscription) {
  var endpoint = subscription.endpoint;
  var parts = endpoint.split('/');
  subscriptionId = parts[parts.length - 1];
}
