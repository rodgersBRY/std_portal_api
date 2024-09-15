const fs = require("fs");
const path = require("path");
const htmlToPDF = require("html-pdf-node");

async function printReceipt() {
  const html = fs.readFileSync(path.join(__dirname, "receipt.html"), "utf-8");

  let options = { format: "A5" };
  let file = { content: html };

  htmlToPDF
    .generatePdf(file, options)
    .then((pdfBuffer) => {
      return pdfBuffer;
    })
    .catch((err) => {
      console.error(err);
    });
}

module.exports = { printReceipt };
