const Writer = {
  write(paragraphs, document) {
    const newPgs = paragraphs.map((pg) => `<p>${pg.innerHTML}</p>`);

    document.open();
    document.write("<html><body><div style='width:600px'>");
    document.write(newPgs.join('\n\n'));
    document.write('</div></body></html>');
    document.close();
  },
};

module.exports = Writer;
