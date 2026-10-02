export const samples = {
  powerbank: {
    title: '介绍你的充电宝',
    sentences: [
      { en: 'This power bank is pretty compact.', zh: '这个充电宝挺小巧的。' },
      { en: "It's easy to carry around.", zh: '随身带着很方便。' },
      { en: 'You can charge two phones at the same time.', zh: '可以同时给两台手机充电。' },
      { en: 'Would you like to give it a try?', zh: '你想试一下吗？' },
    ],
  },
  daily: {
    title: '聊聊今天的生活',
    sentences: [
      { en: 'I got stuck in traffic this morning.', zh: '今天早上我堵在路上了。' },
      { en: 'I was a little frustrated, to be honest.', zh: '说实话，当时有点烦。' },
      { en: 'So I put on some music and tried to relax.', zh: '所以我放了点音乐，试着放松一下。' },
      { en: 'How was your morning?', zh: '你今天早上过得怎么样？' },
    ],
  },
  trade: {
    title: '第一次接待客户',
    sentences: [
      { en: "Hi, it's great to meet you in person.", zh: '你好，很高兴能当面见到你。' },
      { en: 'Let me show you a few of our products.', zh: '我给你介绍几款我们的产品。' },
      { en: 'What kind of products are you looking for?', zh: '你想找什么样的产品？' },
      { en: 'I can send you the details after our chat.', zh: '聊完之后，我可以把详细资料发给你。' },
    ],
  },
};

// 英文分句
export function splitEnglish(text) {
  const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
  return text.trim().split(/\r?\n+/).flatMap(line => {
    const parts = [];
    for (const item of segmenter.segment(line.trim())) {
      const sentence = item.segment.trim();
      if (!sentence) continue;
      if (parts.length && /\b(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|vs|e\.g|i\.e)\.$/i.test(parts.at(-1))) {
        parts[parts.length - 1] += ` ${sentence}`;
      } else {
        parts.push(sentence);
      }
    }
    return parts;
  }).map(en => ({ en, zh: '' }));
}

// 新建练习
export function createLesson(content, source) {
  return { ...content, id: crypto.randomUUID(), source, createdAt: new Date().toISOString(), practiced: [] };
}
