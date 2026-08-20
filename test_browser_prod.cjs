const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

    console.log("Navigating...");
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log("Navigation complete.");
    
    const content = await page.content();
    console.log("Body contents length:", content.length);
    if (content.includes("CRASH DETECTED") || content.includes("PROMISE REJECTION")) {
      console.log("Crash detected in HTML!");
    } else {
      console.log("No crash banner found in HTML.");
    }
    
    await browser.close();
  } catch (e) {
    console.error("Puppeteer error:", e);
  }
})();
