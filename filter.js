var replacerFuncs = [
  [
    /www\.cnn\.com/, function() {
      var pgs = document.getElementsByClassName("zn-body__paragraph");
      writeParagraphs(pgs);
    },
  ],
  [
    /washingtonpost\.com/, function() {
      var pgs = document.querySelectorAll(".article-body>article>p");
      writeParagraphs(pgs);

      if (document.body.innerText.match("Subscribe to read the full article")) {
        window.location.reload();
      }
    }
  ],
  [
    /latimes\.com/, function() {
      var pgs = document.querySelectorAll(".RichTextArticleBody-body>p");
      writeParagraphs(pgs);

      if (document.body.innerText.match("You've reached your monthly free article limit.")) {
        window.location.reload();
      }
    }
  ],
  [
    /nytimes\.com/, function() {
      var pgs = document.querySelectorAll("section[name=articleBody]>div>div>p");
      writeParagraphs(pgs);

      if (document.body.innerText.match("Keep reading The Times by creating a free account or logging in.")) {
        window.location.reload();
      }
    }
  ]
];

function makeReader() {
  chrome.storage.sync.get({enabled: true}, function(items) {
    if (items.enabled) {
      for (var i=0; i < replacerFuncs.length; i++) {
        var func = replacerFuncs[i];
        if (window.location.hostname.match(func[0])) {
          func[1].call();
          break;
        }
      }
    }
  })
}

function writeParagraphs(paragraphs) {
  var newPgs = [];

  for (var i=0; i < paragraphs.length; i++) {
    var pg = paragraphs[i];
    newPgs.push("<p>" + pg.innerHTML + "</p>");
  }

  document.open();
  document.write("<html><body><div style='width:600px'>");
  document.write(newPgs.join("\n\n"));
  document.write("</div></body></html>")
  document.close();
}

makeReader();
