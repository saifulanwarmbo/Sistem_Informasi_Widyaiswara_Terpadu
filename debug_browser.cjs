const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 5000));
    const content = await page.content();
    console.log("HTML length:", content.length);
    console.log("Includes App Rendered:", content.includes("Dashboard Statistik"));
  } catch(e) {
    console.log("Goto error:", e.message);
  }
  
  await browser.close();
  process.exit(0);
})();
