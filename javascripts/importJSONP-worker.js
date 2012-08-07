// Make a JSONP import call from message data
// callback should be set to 'postMessage'
self.onmessage = function (e) {
    importScripts(e.data);
}
