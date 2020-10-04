/* globals chrome, window, document */

const extractors = [
  {
    name: 'CNN',
    urlMatchers: [/cnn\.com/],
    paywallMatchers: [],
    headlineSelectors: ['.pg-headline'],
    bylineSelectors: ['.metadata__info'],
    dateSelectors: [],
    bodySelectors: ['.zn-body__paragraph'],
  },

  {
    name: 'LA Times',
    urlMatchers: [/latimes\.com/],
    paywallMatchers: ['Subscribe to continue reading'],
    headlineSelectors: ['.headline'],
    bylineSelectors: ['.authors'],
    dateSelectors: ['.published-date'],
    bodySelectors: [
      '.RichTextArticleBody-body>p',
      '.page-article-body p',
    ],
  },

  {
    name: 'New York Times',
    urlMatchers: [/nytimes\.com/],
    paywallMatchers: ['Keep reading The Times by creating a free account or logging in.'],
    headlineSelectors: ['*[data-test-id=headline]'],
    bylineSelectors: ['*[itemprop=author] span[itemprop=name]'],
    dateSelectors: ['article header time>span'],
    bodySelectors: ['section[name=articleBody]>div>div>p'],
  },

  {
    name: 'Washington Post',
    urlMatchers: [/washingtonpost\.com/],
    paywallMatchers: ['Subscribe to read the full article'],
    headlineSelectors: ['header h1'],
    bylineSelectors: ['article span.author-name'],
    dateSelectors: ['article .font--subhead>.display-date'],
    bodySelectors: ['.article-body p'],
  },

  {
    name: 'Quartz',
    urlMatchers: [/qz\.com/],
    paywallMatchers: ['Start free trial'],
    headlineSelectors: ['article header h1'],
    bylineSelectors: ['article>div>div>div>div>div>div>div>span>a'],
    dateSelectors: ['article>div>div>div>div>div>div>time'],
    bodySelectors: ['#article-content>p,#article-content>h2'],
  },
];

const resolver = {
  getExtractorForUrl(url) {
    return extractors.find((extractor) => extractor.urlMatchers.some((matcher) => url.match(matcher)));
  },
};

const writer = {
  write({ headlineNodes, bylineNodes, dateNodes, paragraphNodes }) {
    console.debug('[news-reader] Writing');

    document.open();
    document.write("<html><body><div style='width:600px;margin:auto'>");

    headlineNodes.forEach((node) => { document.write(`<h1>${node.innerHTML}</h1>`); });

    const authors = [];
    bylineNodes.forEach((node) => { authors.push(node.innerHTML); });
    document.write(`<p>${authors.join(', ')}</p>`);

    dateNodes.forEach((node) => { document.write(`<p>${node.innerHTML}</p>`); });

    document.write('<hr>');

    paragraphNodes.forEach((node) => { document.write(`<p>${node.innerHTML}</p>`); });

    document.write('</div></body></html>');
    document.close();
  },
};

function run() {
  chrome.storage.sync.get({ enabled: true }, (items) => {
    if (!items.enabled) { return; }

    const extractor = resolver.getExtractorForUrl(window.location.hostname);
    if (!extractor) {
      console.warn('[news-reader] No extractor available for this URL.');
      return;
    }

    console.debug('[news-reader] Found extractor', extractor);

    let paragraphNodes = [];
    const foundPgs = extractor.bodySelectors.some((querySelector) => {
      paragraphNodes = document.querySelectorAll(querySelector);
      return paragraphNodes.length > 0;
    });

    if (!foundPgs) {
      console.warn('[news-reader] None of the query selectors worked.');
      return;
    }

    let headlineNodes = [];
    extractor.headlineSelectors.some((querySelector) => {
      headlineNodes = document.querySelectorAll(querySelector);
      return headlineNodes.length > 0;
    });

    let bylineNodes = [];
    extractor.bylineSelectors.some((querySelector) => {
      bylineNodes = document.querySelectorAll(querySelector);
      return bylineNodes.length > 0;
    });

    let dateNodes = [];
    extractor.dateSelectors.some((querySelector) => {
      dateNodes = document.querySelectorAll(querySelector);
      return dateNodes.length > 0;
    });

    writer.write({ headlineNodes, bylineNodes, dateNodes, paragraphNodes });

    // Now check if a paywall is still present. We use this as an indicator that something didn't work.
    const foundPaywall = extractor.paywallMatchers.some((paywallMatcher) => {
      return document.body.innerText.match(paywallMatcher);
    });

    if (foundPaywall) {
      console.debug('[news-reader] Paywall detected. Reloading page.');
      window.location.reload();
      return;
    }
  });
}

function entrypoint() {
  chrome.storage.onChanged.addListener((changes /* , areaName */) => {
    if (!changes.enabled) { return; }
    window.location.reload();
  });

  run();
}

entrypoint();
