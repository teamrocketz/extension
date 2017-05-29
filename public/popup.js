const port = chrome.extension.connect({
  name: "Sample Communication"
});

port.postMessage("Hi BackGround");

port.onMessage.addListener((msg) => {
  console.log("message recieved" + msg);
});