import {
  probabilityQuestions,
  pythonQuestions,
  cQuestions,
  sqlQuestions,
  SQL_SCHEMA,
  generateMentalMath
} from './questions.js';
import {
  CATAN_BOARDS,
  renderCatanBoard,
  gradeCatanPlacement
} from './catan.js';

const PLAN_KEY = 'marginal-plan';
const STATS_KEY = 'marginal-question-stats-v1';
const SEEN_KEY = 'marginal-seen-v1';
const choices = [5, 10, 15, 20, 30];
const drills = [
  { id:'catan', icon:'🏝️', name:'Catan', desc:'Placement & opening puzzles', subject:'catan' },
  { id:'probability', icon:'◌', name:'Probability', desc:'Problems & intuition', subject:'probability' },
  { id:'python', icon:'⌘', name:'Python', desc:'Syntax & small challenges', subject:'python' },
  { id:'c', icon:'⚙️', name:'C', desc:'Core concepts & drills', subject:'c' },
  { id:'sql', icon:'▤', name:'SQL', desc:'Queries & data thinking', subject:'sql' },
  { id:'zeta', icon:'⚡', name:'Mental math', desc:'Zeta Mac-style reps', subject:'mentalmath' },
  { id:'other', icon:'＋', name:'Other coding', desc:'Any language or concept', subject:'other' }
];
const questionBanks = {
  probability: probabilityQuestions,
  python: pythonQuestions,
  c: cQuestions,
  sql: sqlQuestions
};
const otherPrompts = [
  'Write the smallest useful function for the concept you are learning. What should it return for one test input?',
  'Predict the output of a short snippet in the language you are studying, then run it to verify.',
  'Name one edge case for your current topic and write the expected result.',
  'Explain one concept in two sentences, then give a concrete example.',
  'Refactor five lines of code for clarity. Describe the behavior that must stay unchanged.',
  'Write one failing test first, then write the smallest change that makes it pass.',
  'Recreate a standard-library helper from memory and test it on one input.',
  'Find one bug in a tiny program you worked on recently and state the corrected output.'
];

const planState = readJSON(PLAN_KEY, {});
const grid = document.querySelector('#drillGrid');
const dialog = document.querySelector('#timerDialog');
const timerElement = document.querySelector('#timer');
const timerTopic = document.querySelector('#timerTopic');
const timerTitle = document.querySelector('#timerTitle');
const blockStatus = document.querySelector('#blockStatus');
const questionView = document.querySelector('#questionView');
const questionMeta = document.querySelector('#questionMeta');
const promptElement = document.querySelector('#timerPrompt');
const answerArea = document.querySelector('#answerArea');
const schemaPanel = document.querySelector('#schemaPanel');
const sqlSchema = document.querySelector('#sqlSchema');
const catanView = document.querySelector('#catanView');
const catanMeta = document.querySelector('#catanMeta');
const catanBoard = document.querySelector('#catanBoard');
const catanSelectionStatus = document.querySelector('#catanSelectionStatus');
const feedbackPanel = document.querySelector('#feedbackPanel');
const feedbackTitle = document.querySelector('#feedbackTitle');
const feedbackText = document.querySelector('#feedbackText');
const skipButton = document.querySelector('#skipButton');
const submitButton = document.querySelector('#submitButton');

let runtime = createEmptyRuntime();
let storageWarningShown = false;

function readJSON(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value && typeof value === 'object' ? value : fallback;
  } catch {
    return fallback;
  }
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    if (!storageWarningShown && dialog?.open) {
      storageWarningShown = true;
      blockStatus.textContent = 'This session works, but progress could not be saved on this device.';
      blockStatus.hidden = false;
    }
    return false;
  }
}

function createEmptyRuntime() {
  return {
    mode:'idle',
    plan:[],
    blockIndex:0,
    block:null,
    currentQuestion:null,
    questionStartedAt:0,
    questionNumber:0,
    answerValue:'',
    catanSelections:[],
    feedbackTimeout:null,
    feedbackDueAt:0,
    feedbackRemainingMs:0,
    transitionTimeout:null,
    ticker:null,
    sessionAttempts:[],
    sessionSeen:new Set()
  };
}

function savePlan() {
  writeJSON(PLAN_KEY, planState);
}

function selectedDrills() {
  return drills.filter(drill => planState[drill.id]);
}

function renderBuilder() {
  grid.innerHTML = drills.map(drill => `
    <article class="drill-card ${planState[drill.id] ? 'selected' : ''}">
      <button class="drill-summary" type="button" tabindex="-1" aria-label="${drill.name}">
        <span class="drill-icon" aria-hidden="true">${drill.icon}</span>
        <span class="drill-name">${drill.name}</span>
        <span class="drill-desc">${drill.desc}</span>
      </button>
      <div class="minutes" aria-label="Minutes for ${drill.name}">
        ${choices.map(minutes => `<button type="button" data-set="${drill.id}" data-minutes="${minutes}" class="${planState[drill.id] === minutes ? 'active' : ''}" aria-pressed="${planState[drill.id] === minutes}">${minutes}m</button>`).join('')}
      </div>
    </article>`).join('');

  const selected = selectedDrills();
  const total = selected.reduce((sum, drill) => sum + planState[drill.id], 0);
  document.querySelector('#totalMinutes').textContent = total;
  const startButton = document.querySelector('#startButton');
  startButton.disabled = !total;
  startButton.textContent = total ? `Start ${total}-minute session` : 'Choose a drill to begin';
  document.querySelector('#planCard').hidden = !total;
  document.querySelector('#planLabel').textContent = total ? `${selected.length} drill${selected.length === 1 ? '' : 's'}` : '';
  document.querySelector('#planItems').innerHTML = selected.map(drill => `<div class="plan-item"><span>${drill.icon} ${drill.name}</span><span>${planState[drill.id]} min</span></div>`).join('');
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

function getSeenStore() {
  const store = readJSON(SEEN_KEY, {});
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const cutoffKey = localDateKey(cutoff);
  Object.keys(store).forEach(key => {
    if (key < cutoffKey) delete store[key];
  });
  return store;
}

function seenIdsFor(subject) {
  const store = getSeenStore();
  const seen = new Set(store[localDateKey()]?.[subject] || []);
  runtime?.sessionSeen?.forEach(key => {
    const [seenSubject, ...idParts] = key.split(':');
    if (seenSubject === subject) seen.add(idParts.join(':'));
  });
  return seen;
}

function markSeen(subject, questionId) {
  runtime?.sessionSeen?.add(`${subject}:${questionId}`);
  const store = getSeenStore();
  const today = localDateKey();
  store[today] ||= {};
  store[today][subject] ||= [];
  if (!store[today][subject].includes(questionId)) store[today][subject].push(questionId);
  writeJSON(SEEN_KEY, store);
}

function startSession() {
  stopRuntimeTimers();
  runtime = createEmptyRuntime();
  runtime.mode = 'drill';
  runtime.plan = selectedDrills().map(drill => ({ ...drill, minutes:planState[drill.id] }));
  runtime.blockIndex = 0;
  if (!dialog.open) dialog.showModal();
  startBlock();
}

function startBlock() {
  clearTimeout(runtime.feedbackTimeout);
  const drill = runtime.plan[runtime.blockIndex];
  if (!drill) {
    showSessionSummary();
    return;
  }

  const seen = seenIdsFor(drill.subject);
  const queue = questionBanks[drill.subject]
    ? shuffle(questionBanks[drill.subject].filter(question => !seen.has(question.id)))
    : drill.subject === 'catan'
      ? shuffle(CATAN_BOARDS.filter(board => !seen.has(board.id)))
      : [];

  runtime.block = {
    drill,
    deadline:Date.now() + drill.minutes * 60_000,
    expired:false,
    queue,
    answered:0,
    correct:0
  };
  runtime.questionNumber = 0;
  runtime.currentQuestion = null;
  runtime.mode = 'drill';
  timerTopic.textContent = drill.name.toUpperCase();
  timerTitle.textContent = `${drill.minutes} minutes of ${drill.name}`;
  blockStatus.hidden = true;
  feedbackPanel.hidden = true;
  skipButton.hidden = false;
  skipButton.disabled = false;
  submitButton.hidden = false;
  submitButton.textContent = 'Submit answer';
  runtime.ticker = window.setInterval(updateTimer, 250);
  updateTimer();
  loadNextQuestion();
}

function updateTimer() {
  if (!runtime.block || runtime.mode === 'summary') return;
  const seconds = Math.max(0, Math.ceil((runtime.block.deadline - Date.now()) / 1000));
  timerElement.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  if (seconds === 0 && !runtime.block.expired) {
    runtime.block.expired = true;
    clearInterval(runtime.ticker);
    runtime.ticker = null;
    blockStatus.textContent = 'Time is up — finish this rep, then the next block will begin.';
    blockStatus.hidden = false;
  }
}

function nextQuestionForBlock() {
  const { subject } = runtime.block.drill;
  if (subject === 'catan') {
    const seen = seenIdsFor(subject);
    while (runtime.block.queue.length) {
      const board = runtime.block.queue.shift();
      if (!seen.has(board.id)) return { id:board.id, difficulty:board.difficulty || 2, board };
    }
    return null;
  }
  if (subject === 'mentalmath') {
    const seen = seenIdsFor(subject);
    const difficulty = Math.min(3, 1 + Math.floor(runtime.block.answered / 5));
    for (let attempt = 0; attempt < 300; attempt += 1) {
      const question = generateMentalMath(difficulty);
      if (!seen.has(question.id)) return question;
    }
    return null;
  }
  if (subject === 'other') {
    const seen = seenIdsFor(subject);
    const available = otherPrompts.map((prompt, index) => ({
      id:`other-${index + 1}`,
      prompt,
      answer:'Any focused response',
      explanation:'Rep completed. Keep the result small and concrete.',
      difficulty:1,
      acceptsAny:true
    })).filter(question => !seen.has(question.id));
    return shuffle(available)[0] || null;
  }
  const seen = seenIdsFor(subject);
  while (runtime.block.queue.length) {
    const question = runtime.block.queue.shift();
    if (!seen.has(question.id)) return question;
  }
  return null;
}

function loadNextQuestion() {
  clearTimeout(runtime.feedbackTimeout);
  feedbackPanel.hidden = true;
  feedbackPanel.className = 'feedback';
  skipButton.disabled = false;
  submitButton.disabled = true;
  submitButton.textContent = runtime.block?.drill.subject === 'catan' ? 'Grade placement' : 'Submit answer';
  runtime.answerValue = '';
  runtime.catanSelections = [];

  if (runtime.block && Date.now() >= runtime.block.deadline) updateTimer();

  if (runtime.block.expired) {
    finishBlock();
    return;
  }

  const question = nextQuestionForBlock();
  if (!question) {
    blockStatus.textContent = 'You have completed every available new rep for this subject today.';
    blockStatus.hidden = false;
    runtime.transitionTimeout = window.setTimeout(finishBlock, 900);
    return;
  }

  runtime.currentQuestion = question;
  runtime.questionNumber += 1;
  runtime.questionStartedAt = Date.now();
  markSeen(runtime.block.drill.subject, question.id);
  if (runtime.block.drill.subject === 'catan') renderCatanQuestion();
  else renderTextQuestion();
}

function renderTextQuestion() {
  const question = runtime.currentQuestion;
  questionView.hidden = false;
  catanView.hidden = true;
  schemaPanel.hidden = true;
  questionMeta.textContent = `Question ${runtime.questionNumber} · Difficulty ${question.difficulty}/3`;
  promptElement.textContent = question.prompt;
  schemaPanel.hidden = runtime.block.drill.subject !== 'sql';
  schemaPanel.open = false;
  sqlSchema.textContent = SQL_SCHEMA;
  answerArea.replaceChildren();

  if (Array.isArray(question.choices) && question.choices.length) {
    question.choices.forEach((choice, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'choice';
      button.dataset.choiceIndex = String(index);
      const letter = document.createElement('span');
      letter.className = 'choice-letter';
      letter.textContent = String.fromCharCode(65 + index);
      const label = document.createElement('span');
      label.textContent = choice;
      button.append(letter, label);
      answerArea.append(button);
    });
  } else {
    const input = document.createElement(question.prompt.length > 130 || runtime.block.drill.subject === 'sql' ? 'textarea' : 'input');
    input.className = 'answer-input';
    input.id = 'questionAnswer';
    input.autocomplete = 'off';
    input.autocapitalize = 'off';
    input.spellcheck = false;
    input.placeholder = runtime.block.drill.subject === 'other' ? 'Write a short result or note…' : 'Type your answer…';
    if (input.tagName === 'TEXTAREA') input.rows = 3;
    answerArea.append(input);
    window.setTimeout(() => input.focus(), 0);
  }
}

function renderCatanQuestion(revealTopIds = []) {
  questionView.hidden = true;
  schemaPanel.hidden = true;
  catanView.hidden = false;
  catanMeta.textContent = `Board ${runtime.questionNumber} · Tap two vertices`;
  catanBoard.innerHTML = renderCatanBoard(runtime.currentQuestion.board, runtime.catanSelections, revealTopIds);
  catanSelectionStatus.textContent = `${runtime.catanSelections.length} of 2 spots selected`;
  submitButton.disabled = runtime.catanSelections.length !== 2;
}

function chooseAnswer(button) {
  if (runtime.mode !== 'drill' || !runtime.currentQuestion) return;
  const index = Number(button.dataset.choiceIndex);
  runtime.answerValue = runtime.currentQuestion.choices[index];
  answerArea.querySelectorAll('.choice').forEach(choice => choice.classList.toggle('selected', choice === button));
  submitButton.disabled = false;
}

function chooseCatanVertex(vertexId) {
  if (runtime.mode !== 'drill' || feedbackPanel.hidden === false) return;
  const selections = runtime.catanSelections;
  if (selections.includes(vertexId)) {
    runtime.catanSelections = selections.filter(id => id !== vertexId);
  } else if (selections.length < 2) {
    const firstVertex = runtime.currentQuestion.board.vertices.find(vertex => vertex.id === selections[0]);
    if (firstVertex?.neighborVertexIds?.includes(vertexId)) {
      blockStatus.textContent = 'Those two spots are adjacent. Catan’s distance rule requires one open vertex between them.';
      blockStatus.hidden = false;
      return;
    }
    blockStatus.hidden = !runtime.block.expired;
    runtime.catanSelections = [...selections, vertexId];
  } else {
    const keptVertex = runtime.currentQuestion.board.vertices.find(vertex => vertex.id === selections[1]);
    if (keptVertex?.neighborVertexIds?.includes(vertexId)) {
      blockStatus.textContent = 'Those two spots are adjacent. Catan’s distance rule requires one open vertex between them.';
      blockStatus.hidden = false;
      return;
    }
    blockStatus.hidden = !runtime.block.expired;
    runtime.catanSelections = [selections[1], vertexId];
  }
  renderCatanQuestion();
}

function cleanOuterText(value) {
  return String(value ?? '')
    .trim()
    .replace(/^```(?:\w+)?\s*/i, '')
    .replace(/```$/i, '')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();
}

function normalizeAnswer(value) {
  return cleanOuterText(value).replace(/\s+/g, ' ');
}

function normalizeCodeOutput(value) {
  return cleanOuterText(value)
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map(line => line.replace(/[ \t]+$/g, ''))
    .join('\n');
}

function normalizeCodeFill(value) {
  return cleanOuterText(value).replace(/;\s*$/, '').replace(/\s+/g, '');
}

function normalizeSql(value) {
  const clean = cleanOuterText(value).replace(/;\s*$/, '');
  return clean.split(/('(?:''|[^'])*')/g).map((part, index) => {
    if (index % 2 === 1) return part;
    return part
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/\s*([(),=<>])\s*/g, '$1');
  }).join('').trim();
}

function parseNumericAnswer(value, expected) {
  const clean = cleanOuterText(value).replace(/,/g, '');
  const fraction = clean.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);
  if (fraction && Number(fraction[2]) !== 0) return Number(fraction[1]) / Number(fraction[2]);
  const percent = clean.match(/^(-?\d+(?:\.\d+)?)\s*%$/);
  if (percent) return Number(percent[1]) / 100;
  const number = Number(clean.replace(/^\$/, ''));
  if (!Number.isFinite(number)) return NaN;
  if (String(expected).includes('%') && Math.abs(number) > 1) return number / 100;
  return number;
}

function questionKind(question) {
  if (question.kind) return question.kind;
  if (Array.isArray(question.choices)) return 'choice';
  const subject = runtime.block?.drill.subject;
  if (subject === 'sql') return 'sql';
  if (subject === 'probability' || subject === 'mentalmath') return 'number';
  if ((subject === 'python' || subject === 'c') && /predict|output/i.test(question.prompt)) return 'code-output';
  if (subject === 'python' || subject === 'c') return 'code-fill';
  return 'short-text';
}

function answerIsCorrect(question, userAnswer) {
  if (question.acceptsAny) return normalizeAnswer(userAnswer).length > 0;
  const expectedAnswers = [
    ...(Array.isArray(question.answer) ? question.answer : [question.answer]),
    ...(question.acceptedAnswers || [])
  ];
  const kind = questionKind(question);
  if (kind === 'choice') return expectedAnswers.some(expected => String(userAnswer) === String(expected));
  if (kind === 'number') {
    return expectedAnswers.some(expected => {
      const userNumber = parseNumericAnswer(userAnswer, expected);
      const expectedNumber = parseNumericAnswer(expected, expected);
      const tolerance = question.tolerance ?? 1e-9;
      return Number.isFinite(userNumber) && Number.isFinite(expectedNumber) && Math.abs(userNumber - expectedNumber) <= tolerance;
    });
  }
  if (kind === 'code-output') return expectedAnswers.some(expected => normalizeCodeOutput(userAnswer) === normalizeCodeOutput(expected));
  if (kind === 'code-fill') return expectedAnswers.some(expected => normalizeCodeFill(userAnswer) === normalizeCodeFill(expected));
  if (kind === 'sql') return expectedAnswers.some(expected => normalizeSql(userAnswer) === normalizeSql(expected));
  return expectedAnswers.some(expected => cleanOuterText(userAnswer) === cleanOuterText(expected));
}

function formatExpectedAnswer(answer) {
  return Array.isArray(answer) ? answer[0] : String(answer);
}

function submitCurrentAnswer() {
  if (runtime.mode === 'summary') {
    closeRuntime();
    return;
  }
  if (runtime.mode === 'feedback') {
    advanceAfterFeedback();
    return;
  }
  if (!runtime.currentQuestion) return;

  const subject = runtime.block.drill.subject;
  if (subject === 'catan') submitCatanPlacement();
  else submitTextAnswer();
}

function submitTextAnswer() {
  const question = runtime.currentQuestion;
  const correct = answerIsCorrect(question, runtime.answerValue);
  const elapsedMs = Date.now() - runtime.questionStartedAt;
  runtime.block.answered += 1;
  if (correct) runtime.block.correct += 1;
  recordAttempt({
    subject:runtime.block.drill.subject,
    questionId:question.id,
    difficulty:question.difficulty,
    correct,
    elapsedMs
  });
  const explanation = correct
    ? question.explanation
    : `Answer: ${formatExpectedAnswer(question.answer)}\n${question.explanation}`;
  showFeedback(correct ? 'Correct' : 'Not quite', explanation, correct);
}

function submitCatanPlacement() {
  if (runtime.catanSelections.length !== 2) return;
  const result = gradeCatanPlacement(runtime.currentQuestion.board, runtime.catanSelections);
  const elapsedMs = Date.now() - runtime.questionStartedAt;
  const topNHitCount = result.selected.filter(item => result.topVertexIds.includes(item.id)).length;
  const correct = topNHitCount === 2;
  runtime.block.answered += 1;
  if (correct) runtime.block.correct += 1;
  recordAttempt({
    subject:'catan',
    questionId:runtime.currentQuestion.id,
    difficulty:runtime.currentQuestion.difficulty,
    correct,
    elapsedMs,
    rating:result.percentile,
    selectedVertexIds:[...runtime.catanSelections],
    topNHitCount,
    pairRank:result.pairRank
  });
  renderCatanQuestion(result.topVertexIds || []);
  const selectedDetail = result.selected.map(item => `${item.id}: ${item.pips} pips, ${item.diversity} resources`).join(' · ');
  const explanation = `${result.rating} — ${Math.round(result.percentile)}th percentile. ${selectedDetail}. ${result.explanation}`;
  showFeedback(`${Math.round(result.percentile)}th percentile`, explanation, result.percentile >= 75);
}

function showFeedback(title, text, correct) {
  runtime.mode = 'feedback';
  feedbackPanel.hidden = false;
  feedbackPanel.className = `feedback ${correct ? 'correct' : 'incorrect'}`;
  feedbackTitle.textContent = title;
  feedbackText.textContent = text;
  answerArea.querySelectorAll('button,input,textarea').forEach(control => { control.disabled = true; });
  skipButton.disabled = true;
  submitButton.disabled = false;
  submitButton.textContent = runtime.block.expired ? 'Next block' : 'Next question';
  scheduleFeedbackAdvance(5000);
}

function scheduleFeedbackAdvance(delayMs) {
  clearTimeout(runtime.feedbackTimeout);
  runtime.feedbackRemainingMs = Math.max(800, delayMs);
  runtime.feedbackDueAt = Date.now() + runtime.feedbackRemainingMs;
  if (document.hidden) return;
  runtime.feedbackTimeout = window.setTimeout(() => {
    if (document.hidden) {
      runtime.feedbackTimeout = null;
      runtime.feedbackRemainingMs = 1200;
      return;
    }
    advanceAfterFeedback();
  }, runtime.feedbackRemainingMs);
}

function skipCurrentQuestion() {
  if (runtime.mode !== 'drill' || !runtime.currentQuestion) return;
  const question = runtime.currentQuestion;
  runtime.block.answered += 1;
  recordAttempt({
    subject:runtime.block.drill.subject,
    questionId:question.id,
    difficulty:question.difficulty || 1,
    correct:false,
    elapsedMs:Date.now() - runtime.questionStartedAt,
    skipped:true
  });
  const answer = runtime.block.drill.subject === 'catan'
    ? 'The board will return only on a future day.'
    : `Answer: ${formatExpectedAnswer(question.answer)}\n${question.explanation}`;
  showFeedback('Skipped', answer, false);
}

function advanceAfterFeedback() {
  if (runtime.mode !== 'feedback') return;
  clearTimeout(runtime.feedbackTimeout);
  runtime.feedbackDueAt = 0;
  runtime.feedbackRemainingMs = 0;
  runtime.currentQuestion = null;
  runtime.mode = 'drill';
  if (runtime.block.expired) finishBlock();
  else loadNextQuestion();
}

function finishBlock() {
  clearInterval(runtime.ticker);
  runtime.ticker = null;
  clearTimeout(runtime.feedbackTimeout);
  const finished = runtime.block;
  runtime.currentQuestion = null;
  runtime.mode = 'transition';
  questionView.hidden = false;
  catanView.hidden = true;
  schemaPanel.hidden = true;
  feedbackPanel.hidden = true;
  answerArea.replaceChildren();
  questionMeta.textContent = '';
  promptElement.textContent = finished.answered
    ? `${finished.correct} of ${finished.answered} correct. Loading your next block…`
    : 'No unseen reps remain for this subject today. Loading your next block…';
  timerTitle.textContent = `${finished.drill.name} complete`;
  timerElement.textContent = '00:00';
  skipButton.hidden = true;
  submitButton.hidden = true;
  runtime.blockIndex += 1;
  runtime.transitionTimeout = window.setTimeout(startBlock, 1100);
}

function recordAttempt(attempt) {
  const stats = readJSON(STATS_KEY, { version:1, questions:{}, daily:{} });
  stats.version = 1;
  stats.questions ||= {};
  stats.questions[attempt.subject] ||= {};
  const questionStats = stats.questions[attempt.subject][attempt.questionId] || {
    attempts:0,
    correct:0,
    incorrect:0,
    skipped:0,
    totalTimeMs:0,
    difficulty:attempt.difficulty
  };
  questionStats.attempts += 1;
  questionStats.correct += attempt.correct ? 1 : 0;
  questionStats.incorrect += attempt.correct ? 0 : 1;
  questionStats.skipped += attempt.skipped ? 1 : 0;
  questionStats.totalTimeMs += attempt.elapsedMs;
  questionStats.lastAnswered = new Date().toISOString();
  questionStats.lastResult = attempt.skipped ? 'skipped' : attempt.correct ? 'correct' : 'incorrect';
  questionStats.difficulty = attempt.difficulty;
  if (attempt.correct) {
    questionStats.bestCorrectTimeMs = Math.min(questionStats.bestCorrectTimeMs ?? Infinity, attempt.elapsedMs);
  }
  questionStats.recent ||= [];
  questionStats.recent.push({
    at:questionStats.lastAnswered,
    result:questionStats.lastResult,
    timeMs:attempt.elapsedMs,
    ...(Number.isFinite(attempt.rating) ? { rating:attempt.rating } : {}),
    ...(attempt.selectedVertexIds ? {
      selectedVertexIds:attempt.selectedVertexIds,
      topNHitCount:attempt.topNHitCount,
      pairRank:attempt.pairRank
    } : {})
  });
  questionStats.recent = questionStats.recent.slice(-10);
  if (Number.isFinite(attempt.rating)) {
    questionStats.ratingTotal = (questionStats.ratingTotal || 0) + attempt.rating;
  }
  stats.questions[attempt.subject][attempt.questionId] = questionStats;

  const today = localDateKey();
  stats.daily ||= {};
  stats.daily[today] ||= { attempts:0, correct:0, totalTimeMs:0, bySubject:{} };
  const daily = stats.daily[today];
  daily.attempts += 1;
  daily.correct += attempt.correct ? 1 : 0;
  daily.totalTimeMs += attempt.elapsedMs;
  daily.bySubject[attempt.subject] ||= { attempts:0, correct:0, totalTimeMs:0 };
  daily.bySubject[attempt.subject].attempts += 1;
  daily.bySubject[attempt.subject].correct += attempt.correct ? 1 : 0;
  daily.bySubject[attempt.subject].totalTimeMs += attempt.elapsedMs;
  writeJSON(STATS_KEY, stats);
  runtime.sessionAttempts.push(attempt);
}

function showSessionSummary() {
  stopRuntimeTimers();
  runtime.mode = 'summary';
  runtime.block = null;
  timerTopic.textContent = 'SESSION COMPLETE';
  timerTitle.textContent = 'Lunch-break reps finished';
  timerElement.textContent = '✓';
  blockStatus.hidden = true;
  feedbackPanel.hidden = true;
  catanView.hidden = true;
  questionView.hidden = false;
  schemaPanel.hidden = true;
  questionMeta.textContent = '';
  const attempts = runtime.sessionAttempts;
  const correct = attempts.filter(attempt => attempt.correct).length;
  const minutes = Math.max(1, Math.round(attempts.reduce((sum, attempt) => sum + attempt.elapsedMs, 0) / 60_000));
  promptElement.innerHTML = `<div class="session-summary"><div class="summary-stat"><strong>${attempts.length}</strong><span>reps</span></div><div class="summary-stat"><strong>${attempts.length ? Math.round(correct / attempts.length * 100) : 0}%</strong><span>accuracy</span></div><div class="summary-stat"><strong>${minutes}</strong><span>active min</span></div></div><p>Good work. Your question history is saved for future Progress insights.</p>`;
  answerArea.replaceChildren();
  skipButton.hidden = true;
  submitButton.hidden = false;
  submitButton.disabled = false;
  submitButton.textContent = 'Done';
}

function stopRuntimeTimers() {
  clearInterval(runtime.ticker);
  clearTimeout(runtime.feedbackTimeout);
  clearTimeout(runtime.transitionTimeout);
  runtime.ticker = null;
  runtime.feedbackTimeout = null;
  runtime.feedbackDueAt = 0;
  runtime.feedbackRemainingMs = 0;
  runtime.transitionTimeout = null;
}

function closeRuntime() {
  stopRuntimeTimers();
  runtime = createEmptyRuntime();
  if (dialog.open) dialog.close();
}

grid.addEventListener('click', event => {
  const button = event.target.closest('[data-set]');
  if (!button) return;
  const id = button.dataset.set;
  const minutes = Number(button.dataset.minutes);
  planState[id] = planState[id] === minutes ? 0 : minutes;
  if (!planState[id]) delete planState[id];
  savePlan();
  renderBuilder();
});

answerArea.addEventListener('click', event => {
  const choice = event.target.closest('[data-choice-index]');
  if (choice) chooseAnswer(choice);
});

answerArea.addEventListener('input', event => {
  if (!event.target.matches('.answer-input')) return;
  runtime.answerValue = event.target.value;
  submitButton.disabled = normalizeAnswer(runtime.answerValue).length === 0;
});

answerArea.addEventListener('keydown', event => {
  if (event.key === 'Enter' && event.ctrlKey && !submitButton.disabled) submitCurrentAnswer();
});

catanBoard.addEventListener('click', event => {
  const vertex = event.target.closest('[data-vertex-id]');
  if (vertex) chooseCatanVertex(vertex.dataset.vertexId);
});
catanBoard.addEventListener('keydown', event => {
  const vertex = event.target.closest('[data-vertex-id]');
  if (vertex && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    chooseCatanVertex(vertex.dataset.vertexId);
  }
});

document.querySelector('#clearButton').addEventListener('click', () => {
  Object.keys(planState).forEach(key => delete planState[key]);
  savePlan();
  renderBuilder();
});
document.querySelector('#startButton').addEventListener('click', startSession);
document.querySelector('#closeTimer').addEventListener('click', closeRuntime);
skipButton.addEventListener('click', skipCurrentQuestion);
submitButton.addEventListener('click', submitCurrentAnswer);
dialog.addEventListener('cancel', event => {
  event.preventDefault();
  closeRuntime();
});
document.addEventListener('visibilitychange', () => {
  if (runtime.mode !== 'feedback') return;
  if (document.hidden) {
    runtime.feedbackRemainingMs = Math.max(800, runtime.feedbackDueAt - Date.now());
    clearTimeout(runtime.feedbackTimeout);
    runtime.feedbackTimeout = null;
  } else {
    scheduleFeedbackAdvance(runtime.feedbackRemainingMs || 1200);
  }
});

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
renderBuilder();
