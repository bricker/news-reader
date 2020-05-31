/* globals chrome, window, document */

const extractors = [
  {
    name: 'CNN',
    urlMatcher: /www\.cnn\.com/,
    paywallMatcher: null,
    querySelector: '.zn-body__paragraph',
  },

  {
    name: 'LA Times',
    urlMatcher: /latimes\.com/,
    paywallMatcher: 'Subscribe to continue reading',
    querySelector: '.RichTextArticleBody-body>p',
  },

  {
    name: 'New York Times',
    urlMatcher: /nytimes\.com/,
    paywallMatcher: 'Keep reading The Times by creating a free account or logging in.',
    querySelector: 'section[name=articleBody]>div>div>p',
  },

  {
    name: 'Washington Post',
    urlMatcher: /washingtonpost\.com/,
    paywallMatcher: 'Subscribe to read the full article',
    querySelector: '.article-body p',
  },
];

const resolver = {
  getExtractorForUrl(url) {
    return extractors.find((extractor) => url.match(extractor.urlMatcher));
  },
};

const writer = {
  write(paragraphs /* NodeList */) {
    const newPgs = [];
    paragraphs.forEach((pg) => newPgs.push(`<p>${pg.innerHTML}</p>`));

    document.open();
    document.write("<html><body><div style='width:600px'>");
    document.write(newPgs.join('\n\n'));
    document.write('</div></body></html>');
    document.close();
  },
};

function run() {
  chrome.storage.sync.get({ enabled: true }, (items) => {
    if (!items.enabled) { return; }

    const extractor = resolver.getExtractorForUrl(window.location.hostname);
    if (extractor) {
      const pgs = document.querySelectorAll(extractor.querySelector);

      if (pgs.length > 0) {
        writer.write(pgs, document);

        if (extractor.paywallMatcher && document.body.innerText.match(extractor.paywallMatcher)) {
          window.location.reload();
        }
      }
    } else {
      console.warn('No extractor available for this URL.'); // eslint-disable-line no-console
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
