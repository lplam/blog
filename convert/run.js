import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // render trang UI của bạn
  await page.goto("http://localhost:4001/portfolio", { waitUntil: "networkidle0" });

  // tạo PDF
  await page.pdf({
    path: "My_CV.pdf",
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  console.log("✅ Exported CV to My_CV.pdf");
})();