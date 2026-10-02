import test from 'node:test';
import assert from 'node:assert/strict';
import { splitEnglish, createLesson, samples } from '../content.js';

test('按英文标点和换行分句，保留缩写与小数', () => {
  const sentences = splitEnglish("Dr. Smith is here. It's $19.99!\r\nCan I help you?\nEasy to carry");
  assert.deepEqual(sentences.map(item => item.en), ['Dr. Smith is here.', "It's $19.99!", 'Can I help you?', 'Easy to carry']);
  assert.ok(sentences.every(item => item.zh === ''));
});

test('保留引号、空行之间的英文及原始大小写', () => {
  assert.deepEqual(splitEnglish('  “Hello!”\n\nThis is USB-C.  ').map(item => item.en), ['“Hello!”', 'This is USB-C.']);
});

test('新练习使用独立标识与独立进度', () => {
  const first = createLesson(samples.daily, '示例练习');
  const second = createLesson(samples.daily, '示例练习');
  first.practiced.push(0);
  assert.notEqual(first.id, second.id);
  assert.deepEqual(second.practiced, []);
});
