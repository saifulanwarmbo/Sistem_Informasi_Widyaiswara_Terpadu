const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds
  const html = await page.content();
  console.log("HTML length:", html.length);
  console.log(html.includes("Dashboard Statistik"));
  
  await browser.close();
  process.exit(0);
})();
