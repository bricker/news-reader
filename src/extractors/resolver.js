/* eslint-disable global-require */

const extractors = [
  require('./cnn'),
  require('./washingtonpost'),
  require('./nytimes'),
  require('./latimes'),
];

const Resolver = {
  getExtractorForUrl(url) {
    return extractors.find((extractor) => url.match(extractor.urlMatcher));
  },
};

module.exports = Resolver;
