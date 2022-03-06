import '../img/icon-128.png'

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
    } else if (request.type === 'promptInteraction') {
      chrome.notifications.getAll((existingNotifications) => {
        if (!Object.prototype.hasOwnProperty.call(existingNotifications, 'interact_first')) {
          chrome.notifications.create("interact_first", {
            type: "basic",
            title: "Chess.com Voice Commentary",
            message: "Audio was blocked by the browser, please click anywhere in the page first. Read more: https://goo.gl/xX8pDD",
            iconUrl: "icon-128.png"
          }, () => {
            chrome.notifications.onClicked.addListener(() => {
              chrome.tabs.create({url: "https://goo.gl/xX8pDD"});
            });
          });
        }
      })
    } else if (request.type === 'clearPromptInteraction') {
      chrome.notifications.clear("interact_first", () => {});
    }
  }
);
