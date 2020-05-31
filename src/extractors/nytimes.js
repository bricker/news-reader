const NytimesExtractor = {
  urlMatcher: /www\.cnn\.com/,
  paywallMatcher: 'Keep reading The Times by creating a free account or logging in.',

  extract(document) {
    const pgs = document.querySelectorAll('section[name=articleBody]>div>div>p');
    return pgs;
  },
};

module.exports = NytimesExtractor;
