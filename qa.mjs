import assert from 'node:assert/strict';
import { ROLES, QUESTIONS, scoreAnswers, parseRoute, resultHash, quizHash } from './dist/quiz.mjs';
const coverage = new Map(ROLES.map(r => [r.id, { count: 0, example: null }]));
for (let n = 0; n < 4 ** 7; n++) {
  let v = n; const answers = Array.from({ length: 7 }, () => { const a = v % 4; v = Math.floor(v / 4); return a; });
  const { role, scores } = scoreAnswers(answers);
  assert.equal(scores.reduce((a,b) => a+b), 28);
  assert.equal(Math.max(...scores), scores[ROLES.indexOf(role)]);
  assert.equal(scoreAnswers(answers).role.id, role.id);
  assert.deepEqual(parseRoute(resultHash(answers)).answers, answers);
  const item = coverage.get(role.id); item.count++; item.example ??= answers.join('');
}
for (const [id, item] of coverage) { assert.ok(item.count > 0, id + ' is reachable'); const shared = parseRoute('#r=' + id); assert.equal(shared.shared, true); assert.equal(shared.answers, null); }
for (let index = 0; index < 7; index++) for (let answer = 0; answer < 4; answer++) {
  const chosen = QUESTIONS[index].choices[answer]; const before = Array(8).fill(0); before[chosen[1]] += 3; before[chosen[2]] += 1; assert.equal(before.reduce((a,b) => a+b), 4);
}
for (let count = 0; count < 7; count++) { const answers = Array(count).fill(2); assert.deepEqual(parseRoute(quizHash(answers)).answers, answers); }
for (const bad of ['#q=0000000','#q=9','#q=foo','#r=missing','#r=tea-witch&a=1111111','#r=tea-witch&a=000','#r=tea-witch&x=evil','#r=tea-witch&r=nap-wizard','#%3Cscript%3E']) assert.equal(parseRoute(bad).kind, 'invalid', bad);
assert.throws(() => scoreAnswers([])); assert.throws(() => scoreAnswers(Array(7).fill(9)));
console.log(JSON.stringify({ sequencesChecked:4 ** 7, roles:Object.fromEntries(coverage), routeChecks:'passed', scoring:'passed' }, null, 2));
