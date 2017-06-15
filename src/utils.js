const axios = require('axios');

module.exports.loadSession = () => {
  axios.get('https://hault.herokuapp.com/pageviews/active')
  .then(({ data }) => {
    data.forEach((page) => {
      window.open(page.url, '_blank');
    });
  })
  .catch((err) => {
    console.error(err);
  });
};
