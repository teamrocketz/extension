const tabs = chrome.tabs;
const storage = chrome.storage.local;
const history = chrome.history;
const windows = chrome.windows;
let config;

// ------extension production/development routes------
const dev = 'http://localhost:3000/';
const prod = 'https://hault.herokuapp.com/';
chrome.management.getSelf((result) => {
  if (result.installType === 'development') {
    config = dev;
  } else {
    config = prod;
  }
});
// ------extension production/development routes------

const storeSnippet = (page) => {
  if (page.snippet) {
    storage.set({ [page.url]: page.snippet });
  }
};

const scrapeHTML = (tabId, changeInfo, tab) => {
  if (tab.id) {
    chrome.tabs.executeScript(tab.id, {
      file: scraper.js, // eslint-disable-line no-undef
    });
  }
};

const clearHistory = () => {
  setTimeout(() => {
    history.deleteRange({
      startTime: Date.now() - 30000,
      endTime: Date.now() + 10000,
    }, () => {
      console.log('-----History cleared-----');
    });
  }, 4000);
};

const tabUpdate = (tabId, changeInfo, tab) => {
  const validUpdate = tab.status === 'complete'
                   && !tab.title.match(' messaged you')
                   && (!tab.url.match('chrome://') && !tab.url.match('localhost:') && !tab.url.match('about://'))
                   && tab.url
                   && tab.title
                   && tab.favIconUrl;

  if (validUpdate) {
    fetch(`${config}pageviews/visitpage`, {
      method: 'post',
      credentials: 'include',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        extension: true,
      },
      body: JSON.stringify({
        url: tab.url,
        title: tab.title,
        icon: tab.favIconUrl,
      }),
    })
    .then(response =>
      response.json(),
    )
    .then((data) => {
      if (!data.err) {
        storage.set({ [tabId]: { url: tab.url, DBid: data.id } }, () => {
          console.log(`${tab.url} will to be added to databse`);
        });
      }
    })
    .catch((err) => {
      console.error(err);
    });
  }
};

const tabRemoved = (e) => {
  storage.remove([e.toString()]);
};

const storageChanged = (changes) => {
  windows.getAll({}, (browsers) => {
    if (browsers.length > 0) {
      Object.keys(changes).forEach((key) => {
        const storageChange = changes[key].oldValue;
        if (storageChange !== undefined) {
          const url = storageChange.url;

          storage.get([url], (result) => {
            const snippet = result[url];
            storage.remove([url]);

            fetch(`${config}pageviews/deactivate`, {
              method: 'post',
              credentials: 'include',
              headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                extension: true,
              },
              body: JSON.stringify({
                url,
                id: storageChange.DBid,
                snippet,
              }),
            })
            .catch((err) => {
              console.error(err);
            });
          });
        }
      });
    }
  });
};


// A new URL has loaded in a tab
tabs.onUpdated.addListener(tabUpdate);
tabs.onUpdated.addListener(clearHistory);

// A new URL has loaded, creates snippet to be sent later.
tabs.onUpdated.addListener(scrapeHTML);

// A tab has been closed
tabs.onRemoved.addListener(tabRemoved);

// Storage has been edited
chrome.storage.onChanged.addListener(storageChanged);

// // A message has been received from scraper.js
chrome.runtime.onMessage.addListener(storeSnippet);
