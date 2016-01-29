
var reg;
var sub;
var isSubscribed = false;
var subscribeButton = document.querySelector('button');
var subId = document.getElementById('sub_id');
var curlId = document.getElementById('curl');

if ('serviceWorker' in navigator) {
  console.log('Service Worker is supported');
  navigator.serviceWorker.register('sw.js').then(function() {
    return navigator.serviceWorker.ready;
  }).then(function(serviceWorkerRegistration) {
    reg = serviceWorkerRegistration;
    subscribeButton.disabled = false;
    console.log('Service Worker is ready :^)', reg);
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
        console.log('Error during getSubscription()', err);
      });
  }).catch(function(error) {
    console.log('Service Worker Error :^(', error);
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
    console.log('Subscribed! Endpoint:', sub.endpoint);
    subscribeButton.textContent = 'Unsubscribe';
    subId.innerText = sub.endpoint;
    isSubscribed = true;
    setSubId(sub);
  });
}

function unsubscribe() {
  sub.unsubscribe().then(function(event) {
    subscribeButton.textContent = 'Subscribe';
    console.log('Unsubscribed!', event);
    isSubscribed = false;
  }).catch(function(error) {
    console.log('Error unsubscribing', error);
    subscribeButton.textContent = 'Subscribe';
  });
}

function setSubId(subscription) {
  var endpoint = subscription.endpoint;
  var parts = endpoint.split('/');
  subscriptionId = parts[parts.length - 1];
}
