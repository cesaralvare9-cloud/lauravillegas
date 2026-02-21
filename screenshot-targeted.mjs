import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, 'temporary screenshots');

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')));

// Stats bar — right after hero (~900px)
await page.evaluate(() => window.scrollTo(0, 820));
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: path.join(dir, 'target-stats.png') });

// Podcast card — midway through podcast section
await page.evaluate(() => window.scrollTo(0, 2200));
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: path.join(dir, 'target-podcast.png') });

await browser.close();
console.log('Done');
