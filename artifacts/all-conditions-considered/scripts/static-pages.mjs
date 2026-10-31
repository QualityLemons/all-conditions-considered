import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const output = fileURLToPath(new URL('../dist/public/', import.meta.url));
const source = await readFile(path.join(output, 'index.html'), 'utf8');
const siteUrl = process.env.SITE_URL?.replace(/\/$/, '');
const escape = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const pages = [
  { route: 'suggest-a-show/', title: 'Suggest a show | All Conditions Considered', description: 'Help shape a fun, knowledgeable and welcoming radio programme. Share an idea with All Conditions Considered; only your name and email are required.' },
  { route: '', title: 'All Conditions Considered | Patient-led radio on WCR-FM', description: 'Patient voice and choice on 101.8 WCR-FM, Wolverhampton. Conversations about medical conditions, lived experience, health, social care and wellness.' },
  { route: 'advertising/', title: 'Advertise | All Conditions Considered on WCR-FM', description: 'Advertise with All Conditions Considered on 101.8 WCR-FM, Wolverhampton. Rates start at £1,000 per month exclusive of VAT. Explore our approach.' },
];
for (const page of pages) {
  const canonical = siteUrl ? `${siteUrl}/${page.route}` : undefined;
  let html = source
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\b[^>]*(?:name=["'](?:description|twitter:title|twitter:description)["']|property=["'](?:og:title|og:description|og:url)["'])[^>]*>/gi, '')
    .replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi, '');
  const metadata = `<title>${escape(page.title)}</title>
<meta name="description" content="${escape(page.description)}">
<meta property="og:title" content="${escape(page.title)}">
<meta property="og:description" content="${escape(page.description)}">
<meta name="twitter:title" content="${escape(page.title)}">
<meta name="twitter:description" content="${escape(page.description)}">
${canonical ? `<link rel="canonical" href="${escape(canonical)}"><meta property="og:url" content="${escape(canonical)}">` : ''}
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'RadioSeries', name: 'All Conditions Considered', description: page.description, ...(canonical ? { url: canonical } : {}) })}</script>`;
  html = html.replace('</head>', `${metadata}\n</head>`);
  const dir = path.join(output, page.route);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), html);
}
await writeFile(path.join(output, '.nojekyll'), '');
await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\n${siteUrl ? `Sitemap: ${siteUrl}/sitemap.xml\n` : ''}`);
if (siteUrl) {
  await writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p => `<url><loc>${escape(`${siteUrl}/${p.route}`)}</loc></url>`).join('')}</urlset>`);
}
