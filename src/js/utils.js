'use strict';

const LOG = (msg) => {
  chrome.runtime.sendMessage({ message: msg }, function(response) {
  });
}

export { LOG };
