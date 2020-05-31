const CnnExtractor = {
  urlMatcher: /www\.cnn\.com/,
  paywallMatcher: null,

  extract(document) {
    const pgs = document.getElementsByClassName('zn-body__paragraph');
    return pgs;
  },
};

module.exports = CnnExtractor;
