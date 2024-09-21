async function createReceipt(doc, receiptData) {
  // Company Information and Logo
  // doc.image("../assets/logo.png", 30, 30, { width: 60 }).moveDown();

  doc
    .fontSize(16)
    .fillColor("#331616")
    .text("Jowam Training Center", 100, 30)
    .moveDown()
    .fontSize(9)
    .text(
      "Physical Address: Pension Towers, 4th Floor. Loita Street, Nairobi",
      100,
      50
    )
    .text("Phone: +123 456 7890", 100, 65)
    .text("Email: info@jowamtrainingcentre.co.ke", 100, 80)
    .moveDown();

  // Receipt Title
  doc.fontSize(16).fillColor("#331616").text("Payment Receipt").moveDown();

  // Receipt Information
  doc
    .fontSize(12)
    .fillColor("#331616")
    .text(`Date: ${new Date().toLocaleDateString()}`)
    .moveDown();

  doc
    .fontSize(11)
    .fillColor("#331616")
    .text(`Student Name: ${receiptData.name}`)
    .moveDown()
    .text(`Student ID: ${receiptData.code}`)
    .moveDown()
    .text(`Amount Paid: KES ${receiptData.amount}`)
    .moveDown()
    .text(`Payment Method: ${receiptData.method}`)
    .moveDown();

  // Footer with Contact Information
  doc
    .fontSize(10)
    .fillColor("#331616")
    .text("Thank you for your payment!", 30, doc.page.height - 80, {
      align: "center",
      lineBreak: true,
    })
    .text(
      "For any queries, contact us at info@jowamtrainingcentre.co.ke or call +123 456 7890",
      { align: "center" }
    )
    .text("Visit our website: www.jowamtrainingcentre.co.ke", {
      align: "center",
    })
    .moveDown();
}

module.exports = { createReceipt };
