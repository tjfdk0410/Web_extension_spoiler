'use strict';

var storage = chrome.storage.local;

var options = {
  site_onoff: false,
  all_onoff: false
};

var optionList = Object.keys(options);

function init_options()
{
  optionList.forEach((option) => {
    storage.get(option, (state) => {
      if(typeof(state[option]) === "undefined" || state[option] === null)
        storage.set(options);
    });
  });
}

function id_callback(callback)
{
  if(callback && typeof(callback) === "function")
  {
    callback("site_onoff");
    callback("all_onoff");
  }
}

window.addEventListener('load', () => {
  init_options();
});