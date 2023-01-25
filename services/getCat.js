const { default: axios } = require("axios");

const getCat = async () => {
  const res = await axios.get("https://api.thecatapi.com/v1/images/search");
  return res.data[0].url;
};

module.exports = { getCat };
