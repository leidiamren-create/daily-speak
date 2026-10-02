import test from 'node:test';
import assert from 'node:assert/strict';
import { completionUrl, parseLesson, generateLesson } from '../ai.js';

const content = { title: '产品介绍', sentences: [{ en: "It's $19.99.", zh: '价格是 19.99 美元。' }] }; // 模拟练习
const settings = { apiBase: 'https://example.com/v1', apiModel: 'test-model', apiKey: 'test-only-key' }; // 模拟设置

test('支持基础地址、末尾斜杠和完整接口地址', () => {
  assert.equal(completionUrl(' https://example.com/v1/ '), 'https://example.com/v1/chat/completions');
  assert.equal(completionUrl('https://example.com/chat/completions'), 'https://example.com/chat/completions');
});

test('解析 JSON 和代码块，拒绝无法跟练的内容', () => {
  assert.deepEqual(parseLesson('```json\n' + JSON.stringify(content) + '\n```'), content);
  assert.throws(() => parseLesson('{"title":"空","sentences":[]}'), /格式不正确/);
  assert.throws(() => parseLesson('{"title":"错误","sentences":[{"en":12,"zh":"中文"}]}'), /格式不正确/);
});

test('发送模型、用户内容、凭据与取消信号', async context => {
  const controller = new AbortController();
  context.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://example.com/v1/chat/completions');
    assert.equal(options.headers.Authorization, 'Bearer test-only-key');
    assert.equal(options.signal, controller.signal);
    const body = JSON.parse(options.body);
    assert.equal(body.model, 'test-model');
    assert.equal(body.stream, false);
    assert.deepEqual(JSON.parse(body.messages[1].content), { mode: '中文改写', text: '价格是 19.99 美元。' });
    return Response.json({ choices: [{ message: { content: JSON.stringify(content) } }] });
  });
  assert.deepEqual(await generateLesson(settings, { mode: '中文改写', text: '价格是 19.99 美元。' }, controller.signal), content);
});

test('接口错误明确报错，不替换为示例', async context => {
  context.mock.method(globalThis, 'fetch', async () => new Response('', { status: 401 }));
  await assert.rejects(generateLesson(settings, { mode: '场景生成' }), /HTTP 401/);
});

test('英文对照保留原文，拒绝遗漏或改写', async context => {
  context.mock.method(globalThis, 'fetch', async () => Response.json({ choices: [{ message: { content: JSON.stringify(content) } }] }));
  assert.deepEqual(await generateLesson(settings, { mode: '英文翻译', sentences: ["It's $19.99."] }), content);
  await assert.rejects(generateLesson(settings, { mode: '英文翻译', sentences: ['It costs $19.99.'] }), /改动了导入的英文/);
});
