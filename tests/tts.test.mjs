import test from 'node:test';
import assert from 'node:assert/strict';
import { requestSpeech, speechUrl, manboEndpoint } from '../tts.js';

test('兼容语音基础地址和完整地址', () => {
  assert.equal(speechUrl(' https://example.com/v1/ '), 'https://example.com/v1/audio/speech');
  assert.equal(speechUrl('https://example.com/v1/audio/speech'), 'https://example.com/v1/audio/speech');
});

test('曼波使用公开试用接口，不发送自定义语音密钥', async context => {
  context.mock.method(globalThis, 'fetch', async (endpoint, options) => {
    const url = new URL(endpoint);
    assert.equal(url.origin + url.pathname, manboEndpoint);
    assert.equal(url.searchParams.get('text'), "It's $19.99 & easy to use.");
    assert.equal(url.searchParams.get('format'), 'mp3');
    assert.equal(url.searchParams.has('key'), false);
    assert.equal(options.headers, undefined);
    return Response.json({ code: 200, url: 'https://audio.example/voice.mp3' });
  });
  assert.equal(await requestSpeech({ ttsProvider: 'manbo', ttsKey: 'private-test-key' }, "It's $19.99 & easy to use."), 'https://audio.example/voice.mp3');
});

test('曼波额度错误直接报告', async context => {
  context.mock.method(globalThis, 'fetch', async () => Response.json({ code: 429, msg: '今日免费次数已用完' }));
  await assert.rejects(requestSpeech({ ttsProvider: 'manbo' }, 'Hello.'), /今日免费次数已用完/);
});

test('兼容接口发送语音模型、音色及独立密钥', async context => {
  const controller = new AbortController();
  context.mock.method(globalThis, 'fetch', async (endpoint, options) => {
    assert.equal(endpoint, 'https://example.com/v1/audio/speech');
    assert.equal(options.headers.Authorization, 'Bearer voice-test-key');
    assert.equal(options.signal, controller.signal);
    assert.deepEqual(JSON.parse(options.body), { model: 'voice-model', voice: 'soft-voice', input: 'Good morning.', response_format: 'mp3' });
    return new Response(new Uint8Array([1, 2, 3]), { headers: { 'Content-Type': 'audio/mpeg' } });
  });
  const audio = await requestSpeech({ ttsProvider: 'compatible', ttsBase: 'https://example.com/v1', ttsModel: 'voice-model', ttsVoice: 'soft-voice', ttsKey: 'voice-test-key' }, 'Good morning.', controller.signal);
  assert.equal(audio.type, 'audio/mpeg');
  assert.equal(audio.size, 3);
});

test('GPT-SoVITS 使用服务默认模型和英语参数', async context => {
  context.mock.method(globalThis, 'fetch', async (endpoint, options) => {
    const url = new URL(endpoint);
    assert.equal(url.origin, 'http://127.0.0.1:9880');
    assert.equal(url.searchParams.get('text_language'), 'en');
    assert.equal(url.searchParams.get('text'), 'Hello.');
    assert.equal(options.headers, undefined);
    return new Response(new Uint8Array([1]), { headers: { 'Content-Type': 'audio/wav' } });
  });
  assert.equal((await requestSpeech({ ttsProvider: 'sovits', sovitsUrl: 'http://127.0.0.1:9880', ttsKey: 'unrelated-key' }, 'Hello.')).type, 'audio/wav');
});

test('语音接口错误和取消请求可传递到播放器', async context => {
  context.mock.method(globalThis, 'fetch', async () => new Response('', { status: 401 }));
  await assert.rejects(requestSpeech({ ttsProvider: 'manbo' }, 'Hello.'), /HTTP 401/);
  context.mock.method(globalThis, 'fetch', async (_, options) => { options.signal.throwIfAborted(); });
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(requestSpeech({ ttsProvider: 'manbo' }, 'Hello.', controller.signal), { name: 'AbortError' });
});
