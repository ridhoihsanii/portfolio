const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');

test('mobile hero remains centered and constrained to the viewport', () => {
  const mobileRules = css.slice(css.indexOf('@media (max-width: 768px)'));

  assert.match(mobileRules, /\.hero-container\s*\{[^}]*min-width:\s*0/s);
  assert.match(mobileRules, /\.hero-text\s*\{[^}]*min-width:\s*0/s);
  assert.match(mobileRules, /\.hero-desc\s*\{[^}]*text-align:\s*center/s);
});

test('mobile navigation actions align to the right when the menu leaves the flex layout', () => {
  const mobileRules = css.slice(css.indexOf('@media (max-width: 768px)'));
  assert.match(mobileRules, /\.nav-actions\s*\{[^}]*margin-left:\s*auto\s*;/s);
});

test('stylesheet and CV links bypass stale cached assets', () => {
  const stylesheet = html.match(/<link[^>]+href="([^"]*style\.css[^"]*)"/);
  const cvLinks = [...html.matchAll(/href="([^"]*assets\/cv\.html[^"]*)"/g)];

  assert.ok(stylesheet, 'the portfolio stylesheet should be linked');
  assert.match(stylesheet[1], /\?v=\d{8}/);
  assert.ok(cvLinks.length > 0, 'the portfolio should link to the CV');
  for (const [, href] of cvLinks) {
    assert.match(href, /\?v=\d{8}/);
  }
});
