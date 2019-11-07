'use strict';

export class Settings {
  static get(keys, callback) {
    return chrome.storage.sync.get(keys, callback);
  }

  static set(dict, callback) {
    return chrome.storage.sync.set(dict, callback);
  }
};

Settings.defaults = {
  voice: 'default',
  volume: 50,
  mute: false,
};
