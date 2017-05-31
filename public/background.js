// https://stackoverflow.com/questions/19103183/how-to-insert-html-with-a-chrome-extensionconsole.log('hello planet, from background script');
const tabs = chrome.tabs;
const storage = chrome.storage.local;
const history = chrome.history;

// A new URL has loaded in a tab
tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && !changeInfo.url.match('chrome://')) {
    setTimeout(() => {
      history.deleteRange({
        startTime: new Date().getTime() - 30000,
        endTime: new Date().getTime() + 10000,
      }, () => {
        console.log('-----History cleared-----');
      });
    }, 4000);

    fetch('http://localhost:3000/pageviews/visitpage', {
      method: 'post',
      credentials: 'include',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        extension: true,
      },
      body: JSON.stringify({ url: changeInfo.url, title: tab.title }),
    })
    .then(response =>
      response.json(),
    )
    .then((data) => {
      storage.set({ [tabId]: { url: changeInfo.url, DBid: data.id } }, () => {
        console.log(`[${tabId}]: { url: ${changeInfo.url}, DBid: ${data.id} } ...NOW IN LOCAL STORAGE`);
        console.log(`${changeInfo.url} will be sent to databse`);
      });
    })
    .catch((err) => {
      console.error(err);
    });
  }
});

// A tab has been closed
tabs.onRemoved.addListener((e) => {
  storage.remove([e.toString()]);
});

// Local storage has been modified from tab closure or a new URL
// chrome.storage.onChanged.addListener((changes, namespace) => {   // namespace unused
chrome.storage.onChanged.addListener((changes) => {
  Object.keys(changes).forEach((key) => {
    const storageChange = changes[key];
    if (storageChange.oldValue !== undefined) {
      fetch('http://localhost:3000/pageviews/deactivate', {
        method: 'post',
        credentials: 'include',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          extension: true,
        },
        body: JSON.stringify({ url: storageChange.oldValue.url, id: storageChange.oldValue.DBid }),
      })
      .then(() => {
        console.log(`${storageChange.oldValue.url} Updated to inactive in DB`);
      })
      .catch((err) => {
        console.error(err);
      });
    }
  });
});

// History has been removed
history.onVisitRemoved.addListener(() => {
  console.log('Item has been removed from history successfully');
  // console.log(event);
});

// Keeping this here for popup:background communication
chrome.extension.onConnect.addListener((port) => {
  console.log('Connected .....');
  port.onMessage.addListener((msg) => {
    console.log(`message recieved ${msg}`);
    port.postMessage('Hi Popup.js');
  });
});
