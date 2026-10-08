export const ROLES = [
  { id: 'tea-witch', title: 'Mushroom Tea Witch', job: 'Keeper of suspiciously good tea', line: 'You fix a bad day with a warm mug and one deeply questionable herb.', quest: 'Find a mushroom that looks like it has a secret. Invite it to tea.', quote: '“The curse is probably just dehydration.”', badge: 'Gentle mischief', color: '#f7cf54', art: 0, talents: ['Comfort +9', 'Odd wisdom +7'], reason: 'Your choices made room for kindness and a little mystery.' },
  { id: 'pocket-goblin', title: 'Pocket Goblin', job: 'Dealer in objects of unclear value', line: 'You saw a shiny thing. You have a business plan. Neither is anyone’s problem yet.', quest: 'Trade one very ordinary button for something dramatically less useful.', quote: '“It’s only cursed if you read the label.”', badge: 'Certified little menace', color: '#ed83ae', art: 1, talents: ['Improvisation +9', 'Shiny things +7'], reason: 'You kept choosing curiosity with a side of harmless trouble.' },
  { id: 'goose-guard', title: 'Goose Guard', job: 'Protector of the village. Mostly from geese.', line: 'You take tiny responsibilities extremely seriously. The goose respects this. Allegedly.', quest: 'Escort a furious goose across the square without apologizing to it.', quote: '“Everyone stay calm. I have a clipboard.”', badge: 'Small stakes. Big duty.', color: '#9fcaee', art: 2, talents: ['Reliability +9', 'Goose diplomacy +2'], reason: 'You chose practical help and keeping the village in one piece.' },
  { id: 'tavern-bard', title: 'Tavern Bard', job: 'Local news, but with a chorus', line: 'You turn a minor inconvenience into a story everyone has to hear twice.', quest: 'Write a heroic ballad about someone successfully finding their keys.', quote: '“Wait. This needs a dramatic pause.”', badge: 'Main character volume', color: '#ed83ae', art: 3, talents: ['Stage presence +9', 'Subtlety +1'], reason: 'Your choices found the story, the audience, and the dramatic entrance.' },
  { id: 'overdue-courier', title: 'Overdue Courier', job: 'Delivering hope. And yesterday’s post.', line: 'You are going somewhere, helping someone, and carrying a parcel that might be a frog.', quest: 'Deliver a letter to a house you have walked past six times today.', quote: '“Good news! I’m only slightly lost.”', badge: 'Helpful at high speed', color: '#f7cf54', art: 4, talents: ['Momentum +9', 'Directions +3'], reason: 'You picked action, useful errands, and bringing people together.' },
  { id: 'nap-wizard', title: 'Nap Wizard', job: 'Master of the five-more-minutes spell', line: 'Your magic is immense. Your availability is a separate conversation.', quest: 'Locate the quietest bench in the village. Defend it by doing nothing.', quote: '“I’ll save the realm after this little rest.”', badge: 'Power-saving mode', color: '#b3a3ea', art: 5, talents: ['Inner peace +9', 'Urgency +0'], reason: 'You protected your peace and let the world be a little strange.' },
  { id: 'lore-librarian', title: 'Lore Librarian', job: 'Knows why the well is like that', line: 'You have the answer, three footnotes, and a troubling amount of backstory.', quest: 'Discover why every village map includes a pond that does not exist.', quote: '“Actually, there’s a fascinating reason.”', badge: 'Keeper of unnecessary lore', color: '#9fcaee', art: 6, talents: ['Curiosity +9', 'Footnotes +12'], reason: 'You wanted the explanation, the evidence, and the secret behind the secret.' },
  { id: 'soup-oracle', title: 'Soup Oracle', job: 'Predicting lunch since this morning', line: 'You can see the future. It needs a blanket and a second helping.', quest: 'Make soup for someone who insists they are absolutely fine.', quote: '“The broth says you should sit down.”', badge: 'Warm bowl energy', color: '#f7cf54', art: 7, talents: ['Care +9', 'Soup accuracy +8'], reason: 'You chose comfort, patient care, and making small things better.' },
];

// Every choice has a primary affinity (+3) and a secondary affinity (+1).
// Ties are resolved by the earliest primary choice among the tied roles.
export const QUESTIONS = [
  { place: 'THE VILLAGE GATE', title: 'A goose is blocking the road. What’s your move?', choices: [
    ['Negotiate. I respect a strong personality.', 2, 7],
    ['Distract it with a song nobody asked for.', 3, 4],
    ['Ask what ancient grudge it is carrying.', 6, 0],
    ['Take the scenic route. Possibly a nap.', 5, 1],
  ]},
  { place: 'THE NOTICEBOARD', title: 'Which job posting catches your eye?', choices: [
    ['“Soup tester wanted. Bring a spoon.”', 7, 0],
    ['“Deliver this parcel. Do not shake it.”', 4, 2],
    ['“Identify this possibly haunted button.”', 1, 6],
    ['“Tea witch’s assistant. Vibes required.”', 0, 5],
  ]},
  { place: 'MARKET DAY', title: 'You find a mysterious coin. You…', choices: [
    ['Read every inscription. Even the tiny one.', 6, 2],
    ['Trade it for a smaller, weirder coin.', 1, 3],
    ['Buy a warm drink for someone having a day.', 0, 7],
    ['Return it before the owner notices.', 2, 4],
  ]},
  { place: 'THE TAVERN', title: 'The hero arrives. Your opening line?', choices: [
    ['“You look hungry. Sit. I made too much.”', 7, 2],
    ['“Finally! My next verse needs a hero.”', 3, 1],
    ['“Can you take this parcel on your way?”', 4, 0],
    ['“Please lower your epic destiny voice.”', 5, 6],
  ]},
  { place: 'A MINOR EMERGENCY', title: 'The village bell won’t stop ringing.', choices: [
    ['Make a checklist. Find a ladder.', 2, 6],
    ['Race over. I am already on the ladder.', 4, 3],
    ['Tell everyone it is a surprise festival.', 3, 1],
    ['Brew a calming tea. We can think after.', 0, 7],
  ]},
  { place: 'YOUR INVENTORY', title: 'One item. Unlimited pocket space. Pick.', choices: [
    ['A book titled “That’s Odd.”', 6, 0],
    ['A jar marked “probably treasure.”', 1, 4],
    ['A blanket with excellent nap reviews.', 5, 7],
    ['A spoon that feels like home.', 7, 2],
  ]},
  { place: 'AFTER HOURS', title: 'Your perfect village evening?', choices: [
    ['A weird little experiment and good tea.', 0, 1],
    ['A crowd, a story, an unnecessary encore.', 3, 4],
    ['A meal with everyone who needed one.', 7, 2],
    ['A quiet nook. A book. No urgent destiny.', 5, 6],
  ]},
];

export function validAnswers(value) { return Array.isArray(value) && value.length <= QUESTIONS.length && value.every(n => Number.isInteger(n) && n >= 0 && n < 4); }
export function scoreAnswers(answers) {
  if (!validAnswers(answers) || answers.length !== QUESTIONS.length) throw new Error('Choose one answer to each of the seven questions.');
  const scores = Array(ROLES.length).fill(0);
  answers.forEach((answer, i) => { const choice = QUESTIONS[i].choices[answer]; scores[choice[1]] += 3; scores[choice[2]] += 1; });
  const max = Math.max(...scores);
  const tied = scores.map((score, i) => score === max ? i : -1).filter(i => i >= 0);
  const winner = answers.map((answer, i) => QUESTIONS[i].choices[answer][1]).find(i => tied.includes(i)) ?? tied[0];
  return { role: ROLES[winner], scores };
}
export function quizHash(answers = []) { if (!validAnswers(answers) || answers.length === 7) throw new Error('Invalid quiz progress.'); return answers.length ? '#q=' + answers.join('') : ''; }
export function resultHash(answers) { const {role} = scoreAnswers(answers); return '#r=' + role.id + '&a=' + answers.join(''); }
export function parseRoute(hash) {
  if (!hash || hash === '#') return { kind: 'quiz', answers: [] };
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  if (params.size === 1 && params.has('q') && /^[0-3]{1,6}$/.test(params.get('q'))) return { kind: 'quiz', answers: [...params.get('q')].map(Number) };
  if (params.has('r') && [...params.keys()].every(k => ['r', 'a'].includes(k)) && [...new Set(params.keys())].length === params.size) {
    const role = ROLES.find(r => r.id === params.get('r'));
    if (role && !params.has('a')) return { kind: 'result', role, answers: null, shared: true };
    if (role && /^[0-3]{7}$/.test(params.get('a') ?? '')) {
      const answers = [...params.get('a')].map(Number);
      if (scoreAnswers(answers).role.id === role.id) return { kind: 'result', role, answers, shared: false };
    }
  }
  return { kind: 'invalid', answers: [] };
}
