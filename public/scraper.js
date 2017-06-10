(() => {
  const port = chrome.runtime;
  const ps = [];
  document.querySelectorAll('div p').forEach(x => ps.push(x));

  const textNodes = ps.map(x => x.innerText);
  const filteredTextNodes = textNodes.sort((y, z) => y.length - z.length);
  const longestElement = filteredTextNodes.pop();
  let snippet = '';

  if (longestElement.length > 1000) {
    snippet = longestElement.slice(0, 1000);
  } else if (longestElement.length > 800 && longestElement.length < 1000) {
    snippet = longestElement;
  } else {
    snippet = filteredTextNodes.join(' ').slice(0, 1000);
  }

  port.sendMessage({
    url: document.URL,
    title: document.title,
    snippet,
  });
})();
