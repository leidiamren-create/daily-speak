export const manboEndpoint = 'https://api.milorapart.top/apis/mbAIsc'; // 曼波试用接口
export const voiceLabels = { browser: '设备英语', manbo: '曼波 · AI 配音', compatible: '自定义 TTS · AI 配音', sovits: 'GPT-SoVITS · AI 配音' }; // 声音名称

// 语音接口地址
export function speechUrl(base) {
  const endpoint = base.trim().replace(/\/+$/, '');
  return endpoint.endsWith('/audio/speech') ? endpoint : `${endpoint}/audio/speech`;
}

// 请求合成语音
export async function requestSpeech(config, text, signal) {
  let endpoint;
  let options = { signal };
  if (config.ttsProvider === 'manbo') {
    endpoint = new URL(manboEndpoint);
    endpoint.searchParams.set('text', text);
    endpoint.searchParams.set('format', 'mp3');
  } else if (config.ttsProvider === 'sovits') {
    endpoint = new URL(config.sovitsUrl);
    endpoint.searchParams.set('text', text);
    endpoint.searchParams.set('text_language', 'en');
  } else {
    endpoint = speechUrl(config.ttsBase);
    options = {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(config.ttsKey ? { Authorization: `Bearer ${config.ttsKey}` } : {}) },
      body: JSON.stringify({ model: config.ttsModel, voice: config.ttsVoice, input: text, response_format: 'mp3' }),
    };
  }
  const response = await fetch(endpoint, options);
  if (!response.ok) throw new Error(`语音服务请求失败（HTTP ${response.status}），请检查接口设置或服务额度。`);
  if (config.ttsProvider === 'manbo') {
    const result = await response.json();
    if (result.code !== 200) throw new Error(`曼波语音：${result.msg}`);
    if (!result.url) throw new Error('曼波服务没有返回音频地址，请稍后再试。');
    return result.url;
  }
  return response.blob();
}
