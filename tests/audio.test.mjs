import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { courses, samples } from '../content.js';
import { bundledAudio } from '../audio.js';

test('全部内置课程和示例均有对应原句的有效音频', async () => {
  const sentences = [...courses, ...Object.values(samples)].flatMap(lesson => lesson.sentences);
  for (const { en } of sentences) {
    const file = bundledAudio[en];
    assert.ok(file, `缺少音频：${en}`);
    const hash = createHash('sha256').update(en).digest('hex').slice(0, 16);
    assert.equal(file, `audio/manbo/${hash}.wav`);
    const audio = await readFile(new URL(`../${file}`, import.meta.url));
    assert.equal(audio.toString('ascii', 0, 4), 'RIFF', en);
    assert.equal(audio.toString('ascii', 8, 12), 'WAVE', en);
    assert.equal(audio.readUInt16LE(20), 1, en);
    assert.equal(audio.readUInt16LE(22), 1, en);
    assert.equal(audio.readUInt32LE(24), 16000, en);
    assert.equal(audio.readUInt32LE(40), audio.length - 44, en);
    const duration = (audio.length - 44) / audio.readUInt32LE(28);
    assert.ok(duration > 0.25 && duration < 20, `音频长度异常：${en}`);
    let peak = 0;
    for (let offset = 44; offset < audio.length; offset += 2) peak = Math.max(peak, Math.abs(audio.readInt16LE(offset)));
    assert.ok(peak > 500, `音频没有有效声音：${en}`);
  }
});
