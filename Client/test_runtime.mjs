import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText || '');
  });
  page.on('response', response => {
    if (!response.ok()) {
      console.log('RESPONSE FAILED:', response.url(), response.status());
    }
  });

  await page.evaluateOnNewDocument(() => {
    window.addEventListener('error', (e) => {
      console.log('WINDOW_ERROR:', e.message, e.filename, e.lineno);
    });
    window.addEventListener('unhandledrejection', (e) => {
      console.log('UNHANDLED_REJECTION:', e.reason);
    });
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  console.log("Page loaded.");
  await browser.close();
})();
