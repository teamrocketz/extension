(() => {
  const ps = [];
  document.querySelectorAll('div p').forEach(x => ps.push(x));

  const textNodes = ps.map(x => x.innerText);
  const filteredTextNodes = textNodes.sort((y, z) => y.length - z.length);
  const longestElement = filteredTextNodes.pop();
  let snippet;

  if (longestElement.length > 1000) {
    snippet = longestElement.slice(0, 1000);
  } else if (longestElement.length > 800 && longestElement.length < 1000) {
    snippet = longestElement;
  } else {
    snippet = filteredTextNodes.join(' ').slice(0, 1000);
  }

  const port2 = chrome.runtime;
  port2.sendMessage({
    url: document.URL,
    title: document.title,
    snippet,
  });

  // fetch('https://localhost:3000/pageviews/snippet', {
  //   method: 'post',
  //   credentials: 'include',
  //   headers: {
  //     Accept: 'application/json, text/plain, */*',
  //     'Content-Type': 'application/json',
  //     extension: true,
  //   },
  //   body: JSON.stringify({
  //     url: document.URL,
  //     title: document.title,
  //     snippet,
  //   }),
  // })
  // .then(response =>
  //   response.json(),
  // )
  // .then((data) => {
  //   console.log(data);
  // })
  // .catch((err) => {
  //   console.error(err);
  // });
})();
