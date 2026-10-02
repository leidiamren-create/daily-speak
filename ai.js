const systemPrompt = `你是一位帮助中国成年人练英语口语的教练，尤其熟悉日常聊天和外贸沟通。
返回 JSON 对象：{"title":"简短中文标题","sentences":[{"en":"一句自然英文","zh":"这一句的中文意思"}]}。
只返回 JSON，不要 Markdown、解释或其他字段。
中文改写：忠实保留用户的意思，改成亲切、自然、简短的英语口语，一项意思一句，适合 A2-B1 学习者；可以使用缩写，避免书面腔、夸张营销和生僻词。不能漏掉原文的内容。
场景生成：根据用户提供的场景和补充信息，生成 5 到 8 句连贯的第一人称口语。没有产品参数时，只描述通用场景或提出询问。
不得虚构产品规格、价格、认证、交货时间或任何承诺。忠实保留用户提供的数字、单位和产品事实。
英文翻译：逐项翻译用户提供的英文句子，完整保留每一句英文的原文和顺序，一一对应，只补充 zh。`;

// 对话接口地址
export function completionUrl(apiBase) {
  const base = apiBase.trim().replace(/\/+$/, '');
  return base.endsWith('/chat/completions') ? base : `${base}/chat/completions`;
}

// 解析口语练习
export function parseLesson(raw) {
  const content = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const lesson = JSON.parse(content);
  if (typeof lesson.title !== 'string' || !Array.isArray(lesson.sentences) || !lesson.sentences.length ||
    lesson.sentences.some(sentence => typeof sentence.en !== 'string' || !sentence.en.trim() || typeof sentence.zh !== 'string')) {
    throw new Error('AI 返回的内容格式不正确，请重新生成。');
  }
  return { title: lesson.title, sentences: lesson.sentences.map(({ en, zh }) => ({ en, zh })) };
}

// 生成口语与中文对照
export async function generateLesson(settings, input, signal) {
  const response = await fetch(completionUrl(settings.apiBase), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(settings.apiKey ? { Authorization: `Bearer ${settings.apiKey}` } : {}) },
    body: JSON.stringify({
      model: settings.apiModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(input) },
      ],
      temperature: 0.5,
      stream: false,
    }),
    signal,
  });
  if (!response.ok) throw new Error(`AI 请求失败（HTTP ${response.status}），请检查接口地址、模型、密钥和账户额度。`);
  const data = await response.json();
  const lesson = parseLesson(data.choices[0].message.content);
  if (input.mode === '英文翻译') {
    if (lesson.sentences.length !== input.sentences.length || lesson.sentences.some((sentence, index) => sentence.en !== input.sentences[index])) {
      throw new Error('AI 改动了导入的英文，请重试，或取消中文对照后直接导入。');
    }
  }
  return lesson;
}
