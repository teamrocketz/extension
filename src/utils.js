const axios = require('axios');

module.exports.loadSession = () => {
  axios.get('http://localhost:3000/pageviews/active')
  .then(({ data }) => {
    data.forEach((page) => {
      window.open(page.url, '_blank');
    });
  })
  .catch((err) => {
    console.error(err);
  });
};


// module.exports.openVault = () => {
//   window.open('http://localhost:3000/', '_blank');
// };
