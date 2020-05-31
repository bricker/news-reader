const LatimesExtractor = {
  urlMatcher: /www\.cnn\.com/,
  paywallMatcher: 'Subscribe to continue reading',

  extract(document) {
    const pgs = document.querySelectorAll('.RichTextArticleBody-body>p');
    return pgs;
  },
};

module.exports = LatimesExtractor;
