import { samples, courses, courseGroups, splitEnglish, createLesson } from './content.js';
import { generateLesson } from './ai.js';

const $ = selector => document.querySelector(selector); // 页面元素
const icons = {
  book: '<path d="M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-2H4zM20 4h-4a3 3 0 0 0-3 3v14a4 4 0 0 1 4-2h3z"/>',
  settings: '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="currentColor"/><circle cx="15" cy="17" r="3" fill="currentColor"/>',
  sparkles: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5zM20 2v4M18 4h4"/>',
  upload: '<path d="M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6"/>',
  battery: '<rect x="3" y="6" width="16" height="12" rx="2"/><path d="M22 10v4M7 10v4m4-4v4m4-4v4"/>',
  coffee: '<path d="M4 8h13v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zm13 1h2a3 3 0 0 1 0 6h-2M7 2v2m5-2v2M2 22h19"/>',
  briefcase: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12a23 23 0 0 0 18 0m-9 0v4"/>',
  bookmark: '<path d="M6 3h12v19l-6-4-6 4z"/>',
  previous: '<path d="M6 5v14m12-14-8 7 8 7z"/>',
  next: '<path d="M18 5v14M6 5l8 7-8 7z"/>',
  volume: '<path d="m11 3-6 5H2v8h3l6 5zm5 5a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  mic: '<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2m-7 9v3m-4 0h8"/>',
  headphones: '<path d="M3 14v-3a9 9 0 0 1 18 0v3"/><rect x="2" y="12" width="5" height="9" rx="2"/><rect x="17" y="12" width="5" height="9" rx="2"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
}; // 界面图标
const icon = key => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[key]}</svg>`; // 图标模板
const escapeHtml = text => text.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]); // 文本转义
const storageKey = 'daily-speak-lessons'; // 练习存储键
let library = JSON.parse(localStorage.getItem(storageKey) || '[]'); // 本地练习
let settings = JSON.parse(localStorage.getItem('daily-speak-settings') || '{}'); // 接口与朗读偏好
const courseProgress = JSON.parse(localStorage.getItem('daily-speak-course-progress') || '{}'); // 课程进度
let selectedGroup = courseGroups[0].id; // 当前课程分类
let lesson = createCourseLesson(courses[0]); // 当前练习
let activeIndex = 0; // 当前句子
let inputMode = 'chinese'; // 输入方式
const drafts = { chinese: '', english: '', scene: '' }; // 输入草稿
let hideChinese = false; // 中文显示状态
let requestController; // 生成请求
let speechToken = 0; // 朗读任务标记
let speaking = false; // 朗读状态
let repeatTimer; // 循环间隔
let recorder; // 录音器
let recordToken = 0; // 录音任务标记
let recordTimer; // 录音计时
const recordings = new Map(); // 当前会话录音
let toastTimer; // 提示计时

document.querySelectorAll('[data-icon]').forEach(element => { element.innerHTML = icon(element.dataset.icon); });
$('#courseGroups').innerHTML = courseGroups.map(group => `<button type="button" data-group="${group.id}" aria-pressed="${group.id === selectedGroup}">${group.title}</button>`).join('');
$('#courseSummary').textContent = `${courses.length} 课 · ${courses.reduce((total, course) => total + course.sentences.length, 0)} 句 · 全部免费跟练`;

// 载入内置课程进度
function createCourseLesson(course) {
  return { ...createLesson(course, '内置课程'), id: `course-${course.courseId}`, practiced: [...(courseProgress[course.courseId] || [])] };
}

// 渲染课程列表
function renderCourses() {
  $('#groupDescription').textContent = courseGroups.find(group => group.id === selectedGroup).detail;
  document.querySelectorAll('[data-group]').forEach(button => button.setAttribute('aria-pressed', button.dataset.group === selectedGroup));
  $('#courseList').innerHTML = courses.filter(course => course.groupId === selectedGroup).map(course => {
    const practiced = (courseProgress[course.courseId] || []).length;
    const selected = course.courseId === lesson.courseId;
    return `<button class="course-card${selected ? ' selected' : ''}" data-course="${course.courseId}" aria-current="${selected ? 'true' : 'false'}"><span class="course-number">${String(courses.indexOf(course) + 1).padStart(2, '0')}</span><span class="course-info"><strong>${course.title}</strong><span>${course.sentences.length} 句 · ${practiced ? `已练 ${practiced} 句` : '点开就能练'}</span></span>${practiced === course.sentences.length ? `<span class="course-complete" aria-label="已练完">${icon('check')}</span>` : selected ? '<span class="course-current">正在练</span>' : ''}</button>`;
  }).join('');
}

// 打开内置课程
function openCourse(courseId) {
  const course = courses.find(item => item.courseId === courseId);
  selectedGroup = course.groupId;
  openLesson(createCourseLesson(course));
  if (window.innerWidth <= 760) $('.practice').scrollIntoView({ block: 'start', behavior: 'smooth' });
}

// 保存当前句子的练习进度
function markCurrentPracticed() {
  if (!lesson.practiced.includes(activeIndex)) lesson.practiced.push(activeIndex);
  if (lesson.courseId) {
    courseProgress[lesson.courseId] = [...lesson.practiced];
    localStorage.setItem('daily-speak-course-progress', JSON.stringify(courseProgress));
    renderCourses();
  }
  if (library.some(item => item.id === lesson.id)) saveLesson();
  renderLesson();
}

// 显示轻提示
function toast(message) {
  $('#toast').textContent = message;
  $('#toast').hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 3200);
}

// 显示操作错误
function showError(target, message) {
  $(target).textContent = message;
  $(target).hidden = !message;
}

// 保存练习本
function persistLibrary() {
  localStorage.setItem(storageKey, JSON.stringify(library));
  $('#libraryCount').textContent = library.length;
  $('#saveLabel').textContent = library.some(item => item.id === lesson.id) ? '已收藏' : '收藏练习';
}

// 收藏当前练习
function saveLesson() {
  const existing = library.findIndex(item => item.id === lesson.id);
  if (existing === -1) library.unshift(lesson);
  else library[existing] = lesson;
  persistLibrary();
}

// 渲染逐句练习
function renderLesson() {
  $('#lessonTitle').textContent = lesson.title;
  $('#lessonBadge').textContent = lesson.source;
  $('#lessonTip').textContent = lesson.tip || '';
  $('#lessonTip').hidden = !lesson.tip;
  $('#sentenceList').innerHTML = lesson.sentences.map((sentence, index) => `<button type="button" class="sentence-row${index === activeIndex ? ' active' : ''}" data-index="${index}" aria-current="${index === activeIndex ? 'step' : 'false'}"><span class="sentence-number">${String(index + 1).padStart(2, '0')}${sentence.speaker ? `<span class="speaker-label">${escapeHtml(sentence.speaker)}</span>` : ''}</span><span class="sentence-content"><span class="sentence-en" lang="en">${escapeHtml(sentence.en)}</span>${sentence.zh && !hideChinese ? `<span class="sentence-zh">${escapeHtml(sentence.zh)}</span>` : ''}</span>${lesson.practiced.includes(index) ? `<span class="sentence-check" aria-label="已练习">${icon('check')}</span>` : ''}</button>`).join('');
  $('#activeCount').textContent = `第 ${activeIndex + 1} / ${lesson.sentences.length} 句`;
  $('#lessonProgress').textContent = `已练 ${lesson.practiced.length} / ${lesson.sentences.length} 句`;
  $('#previousSentence').disabled = activeIndex === 0;
  $('#nextSentence').disabled = activeIndex === lesson.sentences.length - 1;
  $('#toggleChinese').disabled = !lesson.sentences.some(sentence => sentence.zh);
  $('#saveLabel').textContent = library.some(item => item.id === lesson.id) ? '已收藏' : '收藏练习';
  const courseIndex = courses.findIndex(course => course.courseId === lesson.courseId);
  $('#courseNavigation').hidden = courseIndex === -1;
  $('#previousCourse').disabled = courseIndex <= 0;
  $('#nextCourse').disabled = courseIndex === courses.length - 1;
  $('#coursePosition').textContent = `第 ${courseIndex + 1} / ${courses.length} 课`;
  updateRecording();
}

// 切换当前练习
function openLesson(nextLesson) {
  stopSpeech();
  cancelRecording();
  lesson = nextLesson;
  activeIndex = 0;
  showError('#audioError', '');
  renderLesson();
  $('#sentenceList').scrollTop = 0;
  renderCourses();
}

// 切换句子
function selectSentence(index) {
  stopSpeech();
  cancelRecording();
  activeIndex = index;
  showError('#audioError', '');
  renderLesson();
  $(`.sentence-row[data-index="${index}"]`).scrollIntoView({ block: 'nearest' });
}

// 更新输入方式
function setMode(mode) {
  drafts[inputMode] = $('#draft').value;
  inputMode = mode;
  document.querySelectorAll('[data-mode]').forEach(button => {
    const selected = button.dataset.mode === mode;
    button.setAttribute('aria-selected', selected);
    button.tabIndex = selected ? 0 : -1;
    if (selected) $('#inputPanel').setAttribute('aria-labelledby', button.id);
  });
  const copy = {
    chinese: ['像聊天一样，写几句中文', '比如：这个充电宝挺小巧的，出门带着很方便。可以同时给两台手机充电。你平时出门会带充电宝吗？', '不用组织得很完美，像平时说话就好。', '生成口语英文'],
    english: ['粘贴你想练的英文', "This power bank is pretty compact.\nIt's easy to carry around.\nYou can charge two phones at the same time.", '按句号、问号、感叹号或换行自动分句。', '导入并开始跟练'],
    scene: ['补充一点细节（选填）', '比如：我是做充电宝外贸的，想练习在展会上向客户介绍产品。', 'AI 会根据场景生成一段简短的口语。', '生成场景练习'],
  }[mode];
  $('#draftLabel').textContent = copy[0];
  $('#draft').placeholder = copy[1];
  $('#inputHint').textContent = copy[2];
  $('#generateLabel').textContent = copy[3];
  $('#draft').value = drafts[mode];
  $('#characterCount').textContent = `${$('#draft').value.length} 字`;
  $('#fileLabel').hidden = mode !== 'english';
  $('#translateOption').hidden = mode !== 'english';
  $('#sceneOptions').hidden = mode !== 'scene';
  showError('#composeError', '');
}

// 获取并保存新练习
async function compose(event) {
  event.preventDefault();
  const draft = $('#draft').value.trim();
  if (!draft && inputMode !== 'scene') {
    showError('#composeError', inputMode === 'english' ? '请粘贴英文或导入一个 .txt 文件。' : '先写几句你想说的中文吧。');
    $('#draft').focus();
    return;
  }
  const needsAI = inputMode !== 'english' || $('#translateEnglish').checked;
  if (needsAI && (!settings.apiBase || !settings.apiModel)) {
    openSettings(true);
    toast('先填写 AI 接口和模型，再回来生成。');
    return;
  }
  showError('#composeError', '');
  $('#generateButton').disabled = true;
  $('#generateLabel').textContent = needsAI ? '正在生成…' : '正在导入…';
  $('#cancelGenerate').hidden = !needsAI;
  $('#inputPanel').inert = true;
  $('.tabs').inert = true;
  $('#composeForm').setAttribute('aria-busy', 'true');
  requestController = new AbortController();
  try {
    let content;
    const sentences = inputMode === 'english' ? splitEnglish(draft) : [];
    if (!needsAI) {
      content = { title: draft.slice(0, 36) + (draft.length > 36 ? '…' : ''), sentences };
    } else {
      const input = inputMode === 'english'
        ? { mode: '英文翻译', sentences: sentences.map(sentence => sentence.en) }
        : { mode: inputMode === 'scene' ? '场景生成' : '中文改写', scene: $('#sceneSelect').value, text: draft };
      content = await generateLesson({ ...settings, apiKey: sessionStorage.getItem('daily-speak-api-key') || '' }, input, requestController.signal);
    }
    openLesson(createLesson(content, inputMode === 'english' ? '英文导入' : 'AI 练习'));
    saveLesson();
    $('#customDialog').close();
    toast(`已保存 ${lesson.sentences.length} 句，开始跟练吧。`);
    if (window.innerWidth <= 760) $('.practice').scrollIntoView({ block: 'start', behavior: 'smooth' });
  } catch (error) {
    if (error.name === 'AbortError') toast('已取消生成。');
    else showError('#composeError', error instanceof TypeError ? '无法连接 AI 接口。请检查网络、接口地址，以及服务商是否允许浏览器跨域请求（CORS）。' : error.message);
  } finally {
    requestController = undefined;
    $('#generateButton').disabled = false;
    $('#cancelGenerate').hidden = true;
    $('#inputPanel').inert = false;
    $('.tabs').inert = false;
    $('#composeForm').removeAttribute('aria-busy');
    $('#generateLabel').textContent = { chinese: '生成口语英文', english: '导入并开始跟练', scene: '生成场景练习' }[inputMode];
  }
}

// 停止示范朗读
function stopSpeech() {
  speechToken++;
  clearTimeout(repeatTimer);
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  speaking = false;
  $('#listenLabel').textContent = '听这一句';
  $('#playStatus').textContent = '先听一遍，再跟着说';
}

// 朗读当前句子
function speakSentence() {
  if (speaking) { stopSpeech(); return; }
  if (!('speechSynthesis' in window)) {
    showError('#audioError', '当前浏览器不支持朗读，请使用支持语音合成的浏览器。');
    return;
  }
  cancelRecording();
  $('#recordingAudio').pause();
  showError('#audioError', '');
  const token = ++speechToken;
  speaking = true;
  $('#listenLabel').textContent = '停止朗读';
  const say = () => {
    const utterance = new SpeechSynthesisUtterance(lesson.sentences[activeIndex].en);
    utterance.lang = 'en-US';
    utterance.rate = Number($('#speedSelect').value);
    const voice = speechSynthesis.getVoices().find(item => item.voiceURI === settings.voiceURI);
    if (voice) { utterance.voice = voice; utterance.lang = voice.lang; }
    utterance.onstart = () => { if (token === speechToken) $('#playStatus').textContent = '正在朗读…'; };
    utterance.onend = () => {
      if (token !== speechToken) return;
      if ($('#repeatSentence').checked) {
        $('#playStatus').textContent = '稍停一下，继续这一句';
        repeatTimer = setTimeout(say, 1200);
      } else { stopSpeech(); }
    };
    utterance.onerror = event => {
      if (token !== speechToken) return;
      stopSpeech();
      showError('#audioError', `朗读失败（${event.error}）。请在设置中选择英语声音，或检查设备是否安装了英语语音包。`);
    };
    speechSynthesis.speak(utterance);
  };
  say();
}

// 显示当前句子的录音
function updateRecording() {
  const recording = recordings.get(`${lesson.id}:${activeIndex}`);
  const audio = $('#recordingAudio');
  audio.pause();
  $('#recordingResult').hidden = !recording;
  if (recording) {
    audio.src = recording.url;
    $('#downloadRecording').href = recording.url;
    $('#downloadRecording').download = `daily-speak-${activeIndex + 1}.${recording.extension}`;
  } else { audio.removeAttribute('src'); audio.load(); }
}

// 重置录音按钮
function resetRecordButton() {
  clearInterval(recordTimer);
  $('#recordButton').disabled = false;
  $('#recordButton').classList.remove('recording');
  $('#recordLabel').textContent = '录音跟读';
}

// 取消未完成的录音
function cancelRecording() {
  recordToken++;
  if (recorder && recorder.state !== 'inactive') recorder.stop();
  if (recorder) recorder.stream.getTracks().forEach(track => track.stop());
  recorder = undefined;
  resetRecordButton();
  $('#playStatus').textContent = '先听一遍，再跟着说';
}

// 录制当前句子
async function toggleRecording() {
  if (recorder && recorder.state === 'recording') {
    $('#recordButton').disabled = true;
    recorder.stop();
    return;
  }
  stopSpeech();
  $('#recordingAudio').pause();
  showError('#audioError', '');
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    showError('#audioError', '录音需要支持麦克风的浏览器，并通过 HTTPS 或 localhost 打开网页。');
    return;
  }
  const token = ++recordToken;
  const key = `${lesson.id}:${activeIndex}`;
  $('#recordButton').disabled = true;
  $('#playStatus').textContent = '等待麦克风授权…';
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (token !== recordToken) { stream.getTracks().forEach(track => track.stop()); return; }
    const chunks = [];
    const currentRecorder = new MediaRecorder(stream);
    recorder = currentRecorder;
    currentRecorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
    currentRecorder.onstop = () => {
      stream.getTracks().forEach(track => track.stop());
      if (token !== recordToken) return;
      resetRecordButton();
      recorder = undefined;
      const blob = new Blob(chunks, { type: currentRecorder.mimeType });
      const previous = recordings.get(key);
      if (previous) URL.revokeObjectURL(previous.url);
      const extension = blob.type.includes('mp4') ? 'm4a' : blob.type.includes('ogg') ? 'ogg' : 'webm';
      recordings.set(key, { url: URL.createObjectURL(blob), extension });
      markCurrentPracticed();
      $('#playStatus').textContent = '录好了，听听自己的声音';
    };
    currentRecorder.onerror = () => {
      cancelRecording();
      showError('#audioError', '录音失败，请检查麦克风后重新录制。');
    };
    currentRecorder.start();
    $('#recordButton').disabled = false;
    $('#recordButton').classList.add('recording');
    $('#recordLabel').textContent = '结束录音';
    $('#playStatus').textContent = '录音中 · 0 秒';
    const startedAt = Date.now();
    recordTimer = setInterval(() => { $('#playStatus').textContent = `录音中 · ${Math.floor((Date.now() - startedAt) / 1000)} 秒`; }, 500);
  } catch (error) {
    if (stream) stream.getTracks().forEach(track => track.stop());
    if (token !== recordToken) return;
    cancelRecording();
    showError('#audioError', error.name === 'NotAllowedError' ? '麦克风未获授权。请在浏览器的网站权限中允许麦克风，再试一次。' : `无法录音：${error.message}`);
  }
}

// 更新可选英语声音
function populateVoices() {
  if (!('speechSynthesis' in window)) return;
  const selected = $('#voiceSelect').value || settings.voiceURI || '';
  $('#voiceSelect').replaceChildren(new Option('设备默认英语声音', ''));
  speechSynthesis.getVoices().filter(voice => /^en(?:-|_)/i.test(voice.lang)).forEach(voice => {
    $('#voiceSelect').add(new Option(`${voice.name} · ${voice.lang}`, voice.voiceURI));
  });
  $('#voiceSelect').value = selected;
}

// 打开接口设置
function openSettings(showAI = false) {
  $('#apiBase').value = settings.apiBase || '';
  $('#apiModel').value = settings.apiModel || '';
  $('#apiKey').value = sessionStorage.getItem('daily-speak-api-key') || '';
  $('#aiSettings').open = showAI;
  populateVoices();
  $('#settingsDialog').showModal();
}

// 渲染本地练习本
function renderLibrary() {
  $('#libraryList').innerHTML = library.length ? library.map(item => `<div class="library-entry"><button class="library-open" data-open-lesson="${item.id}"><strong>${escapeHtml(item.title)}</strong><span>${item.sentences.length} 句 · 已练 ${item.practiced.length} 句 · ${new Date(item.createdAt).toLocaleDateString('zh-CN')}</span></button><button class="button icon-button delete" data-delete-lesson="${item.id}" aria-label="删除 ${escapeHtml(item.title)}">${icon('trash')}</button></div>`).join('') : '<p class="empty-library">这里还没有收藏。<br>喜欢的课程可以收藏，也可以导入自己的英文。</p>';
}

$('#courseGroups').addEventListener('click', event => {
  const button = event.target.closest('[data-group]');
  if (button) { selectedGroup = button.dataset.group; renderCourses(); }
});
$('#courseList').addEventListener('click', event => {
  const button = event.target.closest('[data-course]');
  if (button) openCourse(button.dataset.course);
});
$('#previousCourse').addEventListener('click', () => openCourse(courses[courses.findIndex(course => course.courseId === lesson.courseId) - 1].courseId));
$('#nextCourse').addEventListener('click', () => openCourse(courses[courses.findIndex(course => course.courseId === lesson.courseId) + 1].courseId));
$('#customButton').addEventListener('click', () => { stopSpeech(); cancelRecording(); $('#customDialog').showModal(); });
$('#markPracticed').addEventListener('click', () => {
  stopSpeech();
  cancelRecording();
  markCurrentPracticed();
  if (activeIndex < lesson.sentences.length - 1) selectSentence(activeIndex + 1);
  else toast(lesson.practiced.length === lesson.sentences.length ? '这课练完了，继续下一课或再复习一遍吧。' : '这句的进度已保存。');
});

document.querySelectorAll('[data-mode]').forEach(button => {
  button.addEventListener('click', () => setMode(button.dataset.mode));
  button.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const tabs = [...document.querySelectorAll('[data-mode]')];
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (tabs.indexOf(button) + (event.key === 'ArrowRight' ? 1 : 2)) % 3;
    tabs[index].click();
    tabs[index].focus();
  });
});
$('#draft').addEventListener('input', () => { $('#characterCount').textContent = `${$('#draft').value.length} 字`; });
$('#composeForm').addEventListener('submit', compose);
$('#cancelGenerate').addEventListener('click', () => requestController.abort());
$('#fileInput').addEventListener('change', async event => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    $('#draft').value = await file.text();
    drafts.english = $('#draft').value;
    $('#draft').dispatchEvent(new Event('input'));
    toast(`已读取 ${file.name}，点击导入即可跟练。`);
  } catch (error) { showError('#composeError', `文件读取失败：${error.message}`); }
  event.target.value = '';
});
document.querySelectorAll('[data-sample]').forEach(button => button.addEventListener('click', () => {
  openLesson(createLesson(samples[button.dataset.sample], '示例练习'));
  $('#customDialog').close();
  if (window.innerWidth <= 760) $('.practice').scrollIntoView({ block: 'start', behavior: 'smooth' });
}));
$('#sentenceList').addEventListener('click', event => {
  const button = event.target.closest('[data-index]');
  if (button) selectSentence(Number(button.dataset.index));
});
$('#previousSentence').addEventListener('click', () => selectSentence(activeIndex - 1));
$('#nextSentence').addEventListener('click', () => selectSentence(activeIndex + 1));
$('#listenButton').addEventListener('click', speakSentence);
$('#recordButton').addEventListener('click', toggleRecording);
$('#recordingAudio').addEventListener('play', () => { stopSpeech(); cancelRecording(); });
$('#speedSelect').addEventListener('change', () => {
  stopSpeech();
  settings.speed = $('#speedSelect').value;
  localStorage.setItem('daily-speak-settings', JSON.stringify(settings));
});
$('#toggleChinese').addEventListener('click', () => {
  hideChinese = !hideChinese;
  $('#toggleChinese').textContent = hideChinese ? '显示中文' : '隐藏中文';
  $('#toggleChinese').setAttribute('aria-pressed', hideChinese);
  renderLesson();
});
$('#saveLesson').addEventListener('click', () => { saveLesson(); toast('已收藏到练习本。'); });
$('#settingsButton').addEventListener('click', () => openSettings());
$('#settingsForm').addEventListener('submit', event => {
  event.preventDefault();
  settings = { ...settings, apiBase: $('#apiBase').value.trim(), apiModel: $('#apiModel').value.trim(), voiceURI: $('#voiceSelect').value };
  localStorage.setItem('daily-speak-settings', JSON.stringify(settings));
  sessionStorage.setItem('daily-speak-api-key', $('#apiKey').value.trim());
  $('#settingsDialog').close();
  toast('设置已保存。');
});
$('#libraryButton').addEventListener('click', () => { renderLibrary(); $('#libraryDialog').showModal(); });
$('#libraryList').addEventListener('click', event => {
  const openButton = event.target.closest('[data-open-lesson]');
  const deleteButton = event.target.closest('[data-delete-lesson]');
  if (openButton) {
    const savedLesson = library.find(item => item.id === openButton.dataset.openLesson);
    if (savedLesson.courseId) openCourse(savedLesson.courseId);
    else openLesson(savedLesson);
    $('#libraryDialog').close();
  }
  if (deleteButton) {
    library = library.filter(item => item.id !== deleteButton.dataset.deleteLesson);
    persistLibrary();
    renderLibrary();
  }
});
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => $(`#${button.dataset.close}`).close()));
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => { if (event.target === dialog && (event.clientX < dialog.getBoundingClientRect().left || event.clientX > dialog.getBoundingClientRect().right || event.clientY < dialog.getBoundingClientRect().top || event.clientY > dialog.getBoundingClientRect().bottom)) dialog.close(); }));
window.addEventListener('pagehide', () => {
  stopSpeech();
  cancelRecording();
  recordings.forEach(recording => URL.revokeObjectURL(recording.url));
  recordings.clear();
});
document.addEventListener('visibilitychange', () => { if (document.hidden) { stopSpeech(); cancelRecording(); } });
if ('speechSynthesis' in window) speechSynthesis.addEventListener('voiceschanged', populateVoices);
if (settings.speed) $('#speedSelect').value = settings.speed;
populateVoices();
renderCourses();
renderLesson();
$('#libraryCount').textContent = library.length;
