#!/usr/bin/env node
/**
 * ad-space-crawler.js
 * Crawls a website and finds all elements with class "ad__space"
 * that also have an inline style of display:none
 *
 * Usage:
 *   node ad-space-crawler.js <rootUrl> [maxPages] [outputFile] [pathPrefix]
 *
 * Examples:
 *   node ad-space-crawler.js https://example.com
 *   node ad-space-crawler.js https://example.com 20
 *   node ad-space-crawler.js https://example.com 20 results.json
 *   node ad-space-crawler.js https://example.com 20 results.json /blog
 *
 * pathPrefix limits crawling to URLs whose path starts with that prefix.
 * Use "-" as a placeholder if you want to set pathPrefix without an outputFile:
 *   node ad-space-crawler.js https://example.com 20 - /blog
 *
 * Install deps first:
 *   npm install puppeteer
 */
 
const puppeteer = require("puppeteer");
const fs = require("fs");
const { URL } = require("url");
 
const ROOT_URL = process.argv[2];
const MAX_PAGES = parseInt(process.argv[3] || "10", 10);
const OUTPUT_FILE = (process.argv[4] && process.argv[4] !== "-") ? process.argv[4] : null;
const PATH_PREFIX = process.argv[5] || null;
 
if (!ROOT_URL) {
  console.error("Usage: node ad-space-crawler.js <rootUrl> [maxPages] [outputFile]");
  process.exit(1);
}
 
let rootOrigin;
try {
  rootOrigin = new URL(ROOT_URL).origin;
} catch {
  console.error("Invalid URL:", ROOT_URL);
  process.exit(1);
}
 
function normalizeUrl(href, base) {
  try {
    const u = new URL(href, base);
    u.hash = "";
    return u.href;
  } catch {
    return null;
  }
}
 
function isSameOrigin(href) {
  try {
    return new URL(href).origin === rootOrigin;
  } catch {
    return false;
  }
}
 
function matchesPrefix(href) {
  if (!PATH_PREFIX) return true;
  try {
    return new URL(href).pathname.startsWith(PATH_PREFIX);
  } catch {
    return false;
  }
}
 
async function scanPage(page, url) {
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 20000 });
    await new Promise(r => setTimeout(r, 3000));
  } catch (err) {
    return { url, error: `Navigation failed: ${err.message}`, matches: [] };
  }
 
  const { matches, links } = await page.evaluate(() => {
    // Find all .ad__space elements where inline style contains display:none
    const candidates = document.querySelectorAll(".ad__space");
    const matches = [];
    for (const el of candidates) {
      const style = el.getAttribute("style") || "";
      if (/display\s*:\s*none/i.test(style)) {
        matches.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          classes: el.className,
          style: style,
          outerHTML: el.outerHTML.slice(0, 400),
        });
      }
    }
 
    // Collect internal links for further crawling
    const links = Array.from(document.querySelectorAll("a[href]"))
      .map(a => a.href)
      .filter(h => h && !h.startsWith("mailto:") && !h.startsWith("tel:"));
 
    return { matches, links };
  });
 
  return { url, error: null, matches, links };
}
 
(async () => {
  console.log(`\nStarting crawler`);
  console.log(`Root URL : ${ROOT_URL}`);
  console.log(`Max pages: ${MAX_PAGES}`);
  if (PATH_PREFIX) console.log(`Path prefix: ${PATH_PREFIX}`);
  console.log(`─`.repeat(60));
 
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
 
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (compatible; AdSpaceCrawler/1.0)"
  );
 
  const visited = new Set();
  const queue = [ROOT_URL];
  const results = [];
 
  while (queue.length > 0 && visited.size < MAX_PAGES) {
    const url = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);
 
    const pageNum = visited.size;
    process.stdout.write(`[${pageNum}/${MAX_PAGES}] Scanning ${url} ... `);
 
    const result = await scanPage(page, url);
    results.push({ url: result.url, error: result.error, matches: result.matches });
 
    if (result.error) {
      console.log(`ERROR: ${result.error}`);
    } else if (result.matches.length > 0) {
      console.log(`FOUND ${result.matches.length} match(es)`);
    } else {
      console.log(`none`);
    }
 
    // Enqueue new same-origin links
    if (result.links) {
      for (const href of result.links) {
        const normalized = normalizeUrl(href, url);
        if (normalized && isSameOrigin(normalized) && matchesPrefix(normalized) && !visited.has(normalized) && !queue.includes(normalized)) {
          queue.push(normalized);
        }
      }
    }
  }
 
  await browser.close();
 
  // Summary
  console.log(`\n${"─".repeat(60)}`);
  console.log(`Crawl complete`);
  console.log(`Pages scanned : ${results.length}`);
 
  const withMatches = results.filter(r => r.matches.length > 0);
  const totalMatches = results.reduce((s, r) => s + r.matches.length, 0);
  const errors = results.filter(r => r.error);
 
  console.log(`Pages with matches: ${withMatches.length}`);
  console.log(`Total elements found: ${totalMatches}`);
  console.log(`Errors: ${errors.length}`);
 
  if (withMatches.length > 0) {
    console.log(`\nMatches found on:`);
    for (const r of withMatches) {
      console.log(`\n  ${r.url} (${r.matches.length} match${r.matches.length > 1 ? "es" : ""})`);
      for (const m of r.matches) {
        console.log(`    <${m.tag}${m.id ? ` id="${m.id}"` : ""} class="${m.classes}" style="${m.style}">`);
      }
    }
  }
 
  if (OUTPUT_FILE) {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
    console.log(`\nFull results saved to: ${OUTPUT_FILE}`);
  }
})();
 