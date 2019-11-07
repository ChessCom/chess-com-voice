import '../img/icon-128.png'
import '../img/icon-34.png'

'use strict';

import { Settings } from './settings';

chrome.runtime.onInstalled.addListener(() => {
  Settings.set(Settings.defaults);
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('LOG: ' + request.message);
  }
);
