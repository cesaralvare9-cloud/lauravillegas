import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));

// Force all reveals visible
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
});

const sections = ['hero','stats','sobre-mi','podcast','cursos','redes','contacto','footer'];
const ids      = [null, null, 'sobre-mi', 'podcast', 'cursos', 'redes', 'contacto', null];
const scrollYs = [0, 950, 1500, 2800, 4100, 5400, 6700, 8000];

for (let i = 0; i < sections.length; i++) {
  await page.evaluate(y => window.scrollTo(0, y), scrollYs[i]);
  await new Promise(r => setTimeout(r, 600));
  const file = path.join(dir, `section-${i+1}-${sections[i]}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`Saved: ${file}`);
}

await browser.close();
