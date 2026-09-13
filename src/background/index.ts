// Background Service Worker
chrome.runtime.onInstalled.addListener((details: chrome.runtime.InstalledDetails) => {
  if (details.reason === 'install') {
    console.log('TASS Extension Installed');
  }
});

chrome.action.onClicked.addListener(() => {
  console.log('Action clicked');
});
