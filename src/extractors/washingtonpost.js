const WashingtonpostExtractor = {
  urlMatcher: /washingtonpost\.com/,
  paywallMatcher: 'Subscribe to read the full article',

  extract(document) {
    const pgs = document.querySelectorAll('.article-body>article>p');
    return pgs;
  },
};

module.exports = WashingtonpostExtractor;
