console.log('hello planet, from background script');

// handles url's from navigating within a site
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && !changeInfo.url.match('chrome\:\/\/')) {
    console.log(changeInfo.url);
    console.log(tab.title);

    setTimeout( () => {
      chrome.history.deleteRange({startTime: new Date().getTime() - 15000, endTime: new Date().getTime() + 10000}, x => {
        console.log('removed some history');
        console.log(x);
      });
    }, 5000);

    $.get();
  }
}); 

// handles when a tab is closed
chrome.tabs.onRemoved.addListener(e => {
  console.log('A tab has been closed');
  console.log(e);
});

// lets us know a history item has been removed
chrome.history.onVisitRemoved.addListener(e => {
  console.log('Item has been removed from history successfully');
  console.log(e);
});
