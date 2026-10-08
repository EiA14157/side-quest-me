// Test-only DOM and native canvas harness. This is not a real-browser layout test.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { createCanvas, Image as NativeImage } from '@napi-rs/canvas';
import { ROLES } from './dist/quiz.mjs';
import { createCard } from './dist/card.mjs';
const html = readFileSync(new URL('./dist/index.html', import.meta.url), 'utf8');
const tools = new Map(); let clock = 10000; let session = 0; let downloads = 0;
class LocalImage extends NativeImage {
  set src(value) { super.src = typeof value === 'string' && value.startsWith('file:') ? fileURLToPath(value) : value; }
  get src() { return super.src; }
}
globalThis.Image = LocalImage;
function mount(hash = '') {
  const dom = new JSDOM(html, { url: 'https://side-quest-me.knightatha.chatgpt.site/' + hash, pretendToBeVisual: true });
  const { window } = dom;
  window.HTMLElement.prototype.scrollIntoView = function() {};
  window.HTMLAnchorElement.prototype.click = function() { downloads++; };
  const createElement = window.document.createElement.bind(window.document);
  window.document.createElement = (name, ...args) => {
    if (name === 'canvas') {
      const canvas = createCanvas(1, 1); canvas.toBlob = callback => callback(new Blob([canvas.toBuffer('image/png')], { type: 'image/png' })); return canvas;
    }
    return createElement(name, ...args);
  };
  window.document.modelContext = { registerTool: (tool, options) => { tools.set(tool.name, {tool, options}); } };
  Object.assign(globalThis, { window, document: window.document, history: window.history, location: window.location });
  Object.defineProperty(globalThis, 'performance', { value: { now: () => clock }, configurable: true });
  Object.defineProperty(globalThis, 'navigator', { value: {}, configurable: true });
  return dom;
}
async function start(hash = '') { const dom = mount(hash); await import('./dist/app.mjs?session=' + session++); return dom; }
const state = () => tools.get('read_npc_quiz').tool.execute({});
function click(selector) { const button = document.querySelector(selector); assert.ok(button, selector); clock += 400; button.click(); }
async function until(check) { for(let n = 0; n < 30; n++) { if (check()) return; await new Promise(resolve => setTimeout(resolve, 20)); } throw new Error('Async UI did not finish'); }

const dom = await start();
assert.equal(tools.size, 3); assert.equal(state().questionIndex, 0);
assert.equal(document.querySelectorAll('[data-answer]').length, 4);
click('[data-answer="0"]'); assert.equal(state().questionIndex, 1); assert.equal(location.hash, '#q=0');
document.querySelector('[data-answer="0"]').click(); assert.equal(state().questionIndex, 1, 'rapid duplicate is ignored');
assert.equal(document.activeElement.tagName, 'H2', 'question heading receives focus');
click('[data-answer="1"]'); assert.equal(state().questionIndex, 2);
dom.window.history.back(); await until(() => state().questionIndex === 1);
dom.window.history.forward(); await until(() => state().questionIndex === 2);
const persistedHash = location.hash; await start(persistedHash); assert.equal(state().questionIndex, 2, 'reload restores URL progress');
click('#previous'); assert.equal(state().questionIndex, 1);
for(let i = 1; i < 7; i++) click('[data-answer="0"]');
assert.equal(state().kind, 'result'); assert.equal(state().role, 'goose-guard');
const completedHash = location.hash; await start(completedHash); assert.equal(state().kind, 'result', 'reload restores result');
let copied = '';
navigator.clipboard = { writeText: async text => { copied = text; } };
click('#copy'); await until(() => document.querySelector('#status').textContent.includes('copied'));
assert.ok(copied.endsWith('#r=goose-guard')); assert.ok(!copied.includes('&a='), 'share excludes answer history');
navigator.clipboard = { writeText: async () => { throw new Error('Denied'); } };
click('#copy'); await until(() => !document.querySelector('#link-fallback').hidden);
assert.equal(document.activeElement.id, 'result-link'); assert.ok(document.querySelector('#result-link').value.endsWith('#r=goose-guard'));
navigator.share = async () => { throw new DOMException('Closed', 'AbortError'); };
click('#share'); await until(() => document.querySelector('#status').textContent.includes('Share closed'));
delete navigator.share; click('#share'); await until(() => document.querySelector('#status').textContent.includes('Copy isn’t available'));
click('#save'); document.querySelector('#save').click(); await until(() => document.querySelector('#status').textContent === 'PNG card ready.'); assert.equal(downloads, 1, 'save double click produces one PNG');
assert.equal(document.querySelector('#image-fallback').hidden, false); assert.ok(document.querySelector('#image-fallback img').src.startsWith('blob:'));
click('#restart'); assert.equal(state().questionIndex, 0); assert.equal(location.hash, '');
await start('#r=pocket-goblin'); assert.ok(document.querySelector('#start-own')); click('#start-own'); assert.equal(state().questionIndex, 0, 'fresh shared result visitor starts own quiz');
await start('#r=missing&a=evil'); assert.equal(state().questionIndex, 0); assert.equal(location.hash, ''); assert.ok(document.querySelector('.recovery-note'));

// Optional WebMCP registration and representative action validation in a test registry.
assert.equal(tools.get('answer_npc_question').tool.annotations.readOnlyHint, false);
const answerTool = tools.get('answer_npc_question').tool;
assert.throws(() => answerTool.execute({questionIndex: 5, answerIndex:0})); assert.equal(state().questionIndex, 0);
assert.throws(() => answerTool.execute({questionIndex: 0, answerIndex:9})); assert.equal(state().questionIndex, 0);
const next = answerTool.execute({questionIndex: 0, answerIndex:2}); assert.equal(next.questionIndex, 1);
tools.get('restart_npc_quiz').tool.execute({}); assert.equal(state().questionIndex, 0);
assert.throws(() => tools.get('restart_npc_quiz').tool.execute({unexpected:true}));

mkdirSync(new URL('./qa-output/', import.meta.url), { recursive:true });
const cards = [];
for (const role of ROLES) {
  await start('#r=' + role.id);
  assert.equal(document.querySelector('h1').textContent, role.title); assert.equal(document.querySelector('.result-portrait').getAttribute('role'), 'img');
  const {blob, canvas} = await createCard(role, 'https://side-quest-me.knightatha.chatgpt.site');
  assert.equal(canvas.width, 1080); assert.equal(canvas.height, 1350); assert.equal(blob.type, 'image/png');
  const pixels = canvas.getContext('2d').getImageData(400, 370, 200, 200).data;
  const colors = new Set(); for(let i=0; i<pixels.length; i+=4) colors.add(pixels[i]+','+pixels[i+1]+','+pixels[i+2]);
  assert.ok(colors.size > 30, 'character art has loaded into actual PNG');
  const bytes = Buffer.from(await blob.arrayBuffer()); assert.equal(bytes.subarray(1,4).toString(), 'PNG');
  writeFileSync(new URL('./qa-output/' + role.id + '.png', import.meta.url), bytes);
  cards.push({role:role.id, pngBytes:bytes.length, size:'1080x1350'});
}
const report={scoringAndRoutes:'see qa.mjs',domFlows:'passed',focus:'passed',historyAndReload:'passed',duplicateClicks:'passed',sharedResultToFreshQuiz:'passed',clipboardDeniedAndUnsupported:'passed',shareAbortAndUnsupported:'passed',pngExports:cards,webmcp:'three tools validated in test registry; real supported browser unavailable',realMobileLayout:'unavailable: CUA reported no browsers or apps'};
writeFileSync(new URL('./qa-output/report.json', import.meta.url), JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
