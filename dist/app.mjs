import { ROLES, QUESTIONS, parseRoute, quizHash, resultHash } from './quiz.mjs';
import { createCard } from './card.mjs';

const game = document.getElementById('game');
let route; let lastChoice = -Infinity; let lastHash = null; let objectUrl = null; let recovery = false;
const letters = ['A', 'B', 'C', 'D'];
function cleanupImage() { if (objectUrl) { URL.revokeObjectURL(objectUrl); objectUrl = null; } }
function navigate(hash, replace = false) {
  const url = location.pathname + location.search + hash;
  history[replace ? 'replaceState' : 'pushState'](null, '', url);
  render(true);
}
function focusHeading() { const heading = game.querySelector('[data-heading]'); heading?.focus({ preventScroll: true }); game.scrollIntoView({ block: 'start', behavior: 'instant' }); }
function render(focus = false) {
  cleanupImage(); lastHash = location.hash; route = parseRoute(location.hash);
  if (route.kind === 'invalid') { recovery = true; history.replaceState(null, '', location.pathname + location.search); route = parseRoute(''); lastHash = ''; }
  if (route.kind === 'quiz') renderQuiz(); else renderResult();
  if (focus) focusHeading();
}
function renderQuiz() {
  const index = route.answers.length; const question = QUESTIONS[index];
  document.title = 'Side Quest Me — What kind of NPC are you?';
  game.innerHTML = `${recovery ? '<p class="recovery-note" role="status">That scroll got scrambled. A fresh adventure starts here.</p>' : ''}
    <div class="quiz-layout">
      <aside class="intro"><p class="eyebrow">Village NPC recruitment</p><h1>You’re not the hero.<br> You’re <em>the side quest.</em></h1><p class="intro-copy">Seven tiny choices. One deeply unnecessary fantasy job.</p><div class="town-portrait" aria-hidden="true"><div class="portrait-art"></div></div><span class="hiring-tag" aria-hidden="true">NO HERO EXPERIENCE REQUIRED</span></aside>
      <section class="quiz-panel" aria-label="NPC quiz">
        <div class="progress-row"><span class="progress-label">QUESTION ${index + 1} / ${QUESTIONS.length}</span><span class="tiny-badge">~ 1 MINUTE</span></div>
        <div class="progress-track" role="progressbar" aria-label="Questions answered" aria-valuemin="0" aria-valuemax="7" aria-valuenow="${index}">${QUESTIONS.map((_, i) => `<span class="${i < index ? 'done' : i === index ? 'current' : ''}"></span>`).join('')}</div>
        <p class="question-place">${question.place}</p><h2 class="question-title" data-heading tabindex="-1">${question.title}</h2>
        <div class="answers">${question.choices.map((choice, i) => `<button type="button" class="answer" data-answer="${i}"><span class="answer-key" aria-hidden="true">${letters[i]}</span><span>${choice[0]}</span></button>`).join('')}</div>
        <div class="quiz-bottom">${index ? '<button type="button" class="text-button" id="previous">Previous question</button>' : '<span class="small-note">Pick what feels like you.</span>'}<span class="small-note">No wrong answers.<br>Only village problems.</span></div>
      </section>
    </div>`;
  game.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => chooseAnswer(Number(button.dataset.answer), index)));
  game.querySelector('#previous')?.addEventListener('click', () => { lastChoice = performance.now(); recovery = false; navigate(quizHash(route.answers.slice(0, -1))); });
}
function chooseAnswer(answer, expectedIndex, fromTool = false) {
  if (route.kind !== 'quiz' || expectedIndex !== route.answers.length || !Number.isInteger(answer) || answer < 0 || answer > 3) throw new Error('This answer does not match the current question.');
  if (!fromTool && performance.now() - lastChoice < 300) return false;
  lastChoice = performance.now(); recovery = false;
  game.querySelectorAll('[data-answer]').forEach(button => { button.disabled = true; });
  const answers = [...route.answers, answer];
  navigate(answers.length === QUESTIONS.length ? resultHash(answers) : quizHash(answers));
  return true;
}
function shareUrl(role = route.role) { const url = new URL(location.href); url.hash = '#r=' + role.id; url.search = ''; return url.href; }
function renderResult() {
  const role = route.role; document.title = role.title + ' — Side Quest Me';
  game.innerHTML = `<div class="result-layout">
    <article class="character-card" style="--role-color:${role.color}" aria-label="${role.title} character card">
      <div class="card-top"><span class="eyebrow">Side Quest Me / Village roster</span><span class="card-level">LV. 01 NPC</span></div>
      <h1 class="card-title" data-heading tabindex="-1">${role.title}</h1><p class="card-job">${role.job}</p>
      <div class="result-portrait" role="img" aria-label="Original pixel art portrait of the ${role.title}"><div class="portrait-art" style="--pos-x:${(role.art % 4) * 100 / 3}%;--pos-y:${Math.floor(role.art / 4) * 100}%"></div></div>
      <p class="role-badge">${role.badge}</p><p class="card-line">${role.line}</p><div class="talents">${role.talents.map(t => `<span>${t}</span>`).join('')}</div>
      <section class="quest-box"><h2 class="eyebrow">Your tiny quest</h2><p>${role.quest}</p></section><p class="card-quote">${role.quote}</p><p class="card-footer">FANTASY ROLEPLAY • JUST FOR FUN</p>
    </article>
    <section class="result-actions" aria-label="Result actions"><p class="eyebrow">${route.shared ? 'A villager sent you this card' : 'Your village self, revealed'}</p><h2>${route.shared ? 'What’s your<br>village job?' : 'Every hero needs<br>someone like you.'}</h2><p class="result-reason">${route.shared ? 'Seven tiny choices find your own NPC. The village has room for one more.' : role.reason}</p>
      <div class="action-stack">${route.shared ? '<button type="button" class="primary-button" id="start-own">Find my NPC</button>' : '<button type="button" class="primary-button" id="share">Share my result</button>'}
      <button type="button" class="secondary-button" id="save">Save card as PNG</button><button type="button" class="secondary-button" id="copy">Copy result link</button></div>
      ${route.shared ? '' : '<button type="button" class="text-button play-again" id="restart">Try another life</button>'}
      <p class="status" role="status" aria-live="polite" id="status"></p>
      <div class="link-fallback" id="link-fallback" hidden><label for="result-link">Your result link</label><input id="result-link" readonly aria-label="Result link to copy"><p>Select the link and copy it, then send it wherever you like.</p></div>
      <div class="image-fallback" id="image-fallback" hidden></div>
      <p class="result-explainer">A made-up role from your choices, not a personality diagnosis. Share if it makes you smile.</p>
    </section></div>`;
  game.querySelector('#restart')?.addEventListener('click', restart);
  game.querySelector('#start-own')?.addEventListener('click', restart);
  game.querySelector('#copy').addEventListener('click', copyLink);
  game.querySelector('#share')?.addEventListener('click', nativeShare);
  game.querySelector('#save').addEventListener('click', saveImage);
}
function restart() { lastChoice = performance.now(); recovery = false; navigate(''); }
function status(message) { const node = game.querySelector('#status'); if (node) node.textContent = message; }
function revealLink(message) { const container = game.querySelector('#link-fallback'); if (!container) return; container.hidden = false; const input = game.querySelector('#result-link'); input.value = shareUrl(); input.focus(); input.select(); status(message); }
async function copyLink() {
  const expectedRole = route.role.id;
  try { if (!navigator.clipboard?.writeText) throw new Error('No clipboard'); await navigator.clipboard.writeText(shareUrl()); if (route.kind === 'result' && route.role.id === expectedRole) status('Result link copied. Your friend can find their NPC too.'); }
  catch { if (route.kind === 'result' && route.role.id === expectedRole) revealLink('Copy isn’t available here. Your link is ready below.'); }
}
async function nativeShare() {
  if (!navigator.share) { await copyLink(); return; }
  const expectedRole = route.role.id;
  try { await navigator.share({ title: `I’m the ${route.role.title} — Side Quest Me`, text: 'My fantasy village job has been assigned. Find your NPC:', url: shareUrl() }); }
  catch (error) { if (route.kind === 'result' && route.role.id === expectedRole) revealLink(error.name === 'AbortError' ? 'Share closed. You can still copy your result link.' : 'Sharing isn’t available here. Your link is ready below.'); }
}
async function saveImage() {
  const button = game.querySelector('#save'); if (button.disabled) return;
  const role = route.role; const capturedHash = location.hash; button.disabled = true; button.textContent = 'Making your card…'; status('');
  try {
    const { blob } = await createCard(role, location.origin);
    if (location.hash !== capturedHash) return;
    cleanupImage(); objectUrl = URL.createObjectURL(blob);
    const fileName = 'side-quest-me-' + role.id + '.png';
    const anchor = document.createElement('a'); anchor.href = objectUrl; anchor.download = fileName; anchor.click();
    const fallback = game.querySelector('#image-fallback'); fallback.hidden = false;
    fallback.innerHTML = '<p>Your card is ready. If the download didn’t start, open the image and save it.</p>';
    const link = document.createElement('a'); link.href = objectUrl; link.target = '_blank'; link.rel = 'noopener'; link.textContent = 'Open card image'; fallback.append(link);
    const img = document.createElement('img'); img.src = objectUrl; img.alt = role.title + ' downloadable character card'; fallback.append(img);
    status('PNG card ready.');
  } catch (error) { if (location.hash === capturedHash) status(error.message || 'Could not save the card. Try again, or copy your result link.'); }
  finally { if (button.isConnected) { button.disabled = false; button.textContent = 'Save card as PNG'; } }
}
function onHistoryChange() { if (location.hash !== lastHash) render(true); }
window.addEventListener('popstate', onHistoryChange); window.addEventListener('hashchange', onHistoryChange);
render();

// The optional browser agent interface uses the exact same actions as the UI.
const context = document.modelContext;
if (context?.registerTool) {
  const lifecycle = new AbortController();
  const currentState = () => route.kind === 'quiz' ? { kind: 'quiz', questionIndex: route.answers.length, question: QUESTIONS[route.answers.length].title, choices: QUESTIONS[route.answers.length].choices.map(c => c[0]) } : { kind: 'result', role: route.role.id, title: route.role.title, link: shareUrl() };
  const tools = [
    { name: 'read_npc_quiz', description: 'Read the current question and answer choices, or the completed NPC result.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: input => { if (!input || typeof input !== 'object' || Object.keys(input).length) throw new Error('Expected an empty object.'); return currentState(); } },
    { name: 'answer_npc_question', description: 'Choose an answer to the current NPC question and advance the visible quiz. questionIndex is zero-based and must match the displayed question.', inputSchema: { type: 'object', properties: { questionIndex: { type: 'integer', minimum: 0, maximum: 6 }, answerIndex: { type: 'integer', minimum: 0, maximum: 3 } }, required: ['questionIndex', 'answerIndex'], additionalProperties: false }, annotations: { readOnlyHint: false }, execute: input => { if (!input || typeof input !== 'object' || Object.keys(input).length !== 2 || !Number.isInteger(input.questionIndex)) throw new Error('Provide questionIndex and answerIndex.'); chooseAnswer(input.answerIndex, input.questionIndex, true); return currentState(); } },
    { name: 'restart_npc_quiz', description: 'Start a fresh NPC quiz, replacing the currently displayed quiz or result.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: false }, execute: input => { if (!input || typeof input !== 'object' || Object.keys(input).length) throw new Error('Expected an empty object.'); restart(); return currentState(); } },
  ];
  tools.forEach(tool => { try { Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}); } catch {} });
  window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
}
