const port = chrome.extension.connect({
  name: 'Sample Communication',
});

port.postMessage('Hi BackGround');

port.onMessage.addListener((msg) => {
  console.log(`message recieved ${msg}`);
});

// const background = () => {
//   const test = chrome.extension.getBackgroundPage();
//   return test;
// };

// const dev = 'http://localhost:3000/';
// const prod = 'https://hault.herokuapp.com/';
// let config;

// const getEnvironment = chrome.management.getSelf((result) => {
//   if (result.installType === 'development') {
//     config = dev;
//     return config;
//   }
//   config = prod;
//   return config;
// });
