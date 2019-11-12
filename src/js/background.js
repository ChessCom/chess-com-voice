import '../img/icon-128.png'
import '../img/icon-34.png'

'use strict';

import { Settings } from './settings';

chrome.runtime.onInstalled.addListener(() => {
  Settings.set(Settings.defaults);
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type === 'log') {
      console.log('LOG: ' + request.message);
    } else if (request.type === 'settingsChanged') {
      console.log('SETTINGS CHANGED');
      chrome.runtime.sendMessage({ type: 'callback' });
      console.log('message sent');
    }
  }
);
