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

export const courseGroups = [
  { id: 'start', title: '开口第一步', detail: '从问候、介绍自己和身边的小东西开始。' },
  { id: 'daily', title: '聊聊日常', detail: '把每天熟悉的生活，说成简单的英文。' },
  { id: 'out', title: '出门用得上', detail: '练习点餐、购物、问路和旅行中的小对话。' },
  { id: 'trade', title: '外贸入门', detail: '先学会接待、介绍和询问，再练报价与跟进。' },
]; // 课程分类

export const courses = [
  {
    courseId: 'hello', groupId: 'start', title: '见面打个招呼', tip: '先听一句，再模仿着说；A、B 是对话中的两个人，两边都可以练。',
    sentences: [
      { en: "Hi, I'm Leo.", zh: '你好，我叫 Leo。', speaker: 'A' },
      { en: "Hello, Leo. I'm Mia.", zh: '你好，Leo。我叫 Mia。', speaker: 'B' },
      { en: 'How are you today?', zh: '你今天怎么样？', speaker: 'A' },
      { en: "I'm good, thanks.", zh: '我挺好的，谢谢。', speaker: 'B' },
      { en: 'Good to see you.', zh: '很高兴见到你。', speaker: 'A' },
      { en: 'You too!', zh: '我也是！', speaker: 'B' },
    ],
  },
  {
    courseId: 'introduce', groupId: 'start', title: '简单介绍自己', tip: '先跟读这段自我介绍，熟悉后可以把名字和城市换成自己的。',
    sentences: [
      { en: 'My name is Lin.', zh: '我叫 Lin。' },
      { en: "I'm from China.", zh: '我来自中国。' },
      { en: 'I live in Shenzhen.', zh: '我住在深圳。' },
      { en: 'I work in a small shop.', zh: '我在一家小店工作。' },
      { en: 'I like music and movies.', zh: '我喜欢音乐和电影。' },
      { en: "I'm learning English.", zh: '我正在学英语。' },
    ],
  },
  {
    courseId: 'repeat', groupId: 'start', title: '没听懂也能接着聊', tip: '记住请对方重复或说慢一点的表达，听不懂时也能开口。',
    sentences: [
      { en: 'Sorry, I missed that.', zh: '抱歉，我刚才没听清。', speaker: 'A' },
      { en: 'I said, "See you on Monday."', zh: '我说：“周一见。”', speaker: 'B' },
      { en: 'Could you say it more slowly?', zh: '你能说慢一点吗？', speaker: 'A' },
      { en: 'Sure. See you on Monday.', zh: '当然。周一见。', speaker: 'B' },
      { en: 'Monday. Got it!', zh: '周一。明白了！', speaker: 'A' },
      { en: 'Yes, Monday morning.', zh: '对，周一早上。', speaker: 'B' },
    ],
  },
  {
    courseId: 'polite', groupId: 'start', title: '请、谢谢和不好意思', tip: '说 please 和 thank you 时放松一点，语气自然就好。',
    sentences: [
      { en: 'Can I sit here, please?', zh: '请问我可以坐这里吗？', speaker: 'A' },
      { en: 'Of course. Go ahead.', zh: '当然可以，请坐。', speaker: 'B' },
      { en: 'Thanks for your help.', zh: '谢谢你的帮助。', speaker: 'A' },
      { en: "You're welcome.", zh: '不客气。', speaker: 'B' },
      { en: "Sorry, that's my bag.", zh: '不好意思，那是我的包。', speaker: 'A' },
      { en: "That's okay.", zh: '没关系。', speaker: 'B' },
    ],
  },
  {
    courseId: 'numbers', groupId: 'start', title: '说数量，问时间', tip: '数字先用完整的英文单词练，听清 two、three 和 ten。',
    sentences: [
      { en: 'How many cups do we need?', zh: '我们需要几个杯子？', speaker: 'A' },
      { en: 'We need three cups.', zh: '我们需要三个杯子。', speaker: 'B' },
      { en: 'Do we need two chairs?', zh: '我们需要两把椅子吗？', speaker: 'A' },
      { en: 'Yes, two chairs, please.', zh: '是的，请拿两把椅子。', speaker: 'B' },
      { en: 'What time do we start?', zh: '我们几点开始？', speaker: 'A' },
      { en: 'We start at ten.', zh: '我们十点开始。', speaker: 'B' },
    ],
  },
  {
    courseId: 'objects', groupId: 'start', title: '介绍身边的小东西', tip: '用 This is… 介绍东西，用 my 表示“我的”。',
    sentences: [
      { en: 'This is my phone.', zh: '这是我的手机。' },
      { en: 'That is my bag.', zh: '那是我的包。' },
      { en: 'My keys are on the table.', zh: '我的钥匙在桌上。' },
      { en: 'This cup is blue.', zh: '这个杯子是蓝色的。' },
      { en: 'I use this pen every day.', zh: '我每天都用这支笔。' },
      { en: 'Where is my charger?', zh: '我的充电器在哪里？' },
    ],
  },
  {
    courseId: 'morning', groupId: 'daily', title: '说说我的早晨', tip: '像讲生活流水账一样，按顺序把这六句说出来。',
    sentences: [
      { en: 'I get up at seven.', zh: '我七点起床。' },
      { en: 'I drink a glass of water.', zh: '我喝一杯水。' },
      { en: 'I have eggs for breakfast.', zh: '我早餐吃鸡蛋。' },
      { en: 'I leave home at eight.', zh: '我八点出门。' },
      { en: 'I take the bus to work.', zh: '我坐公交车去上班。' },
      { en: 'I start work at nine.', zh: '我九点开始工作。' },
    ],
  },
  {
    courseId: 'family', groupId: 'daily', title: '聊聊家人', tip: '跟读例子，熟悉介绍家人时常用的说法。',
    sentences: [
      { en: 'This is a photo of my family.', zh: '这是一张我家人的照片。' },
      { en: 'The woman on the left is my mother.', zh: '左边的女士是我妈妈。' },
      { en: 'My father is next to her.', zh: '我爸爸在她旁边。' },
      { en: 'I have a younger brother.', zh: '我有一个弟弟。' },
      { en: 'He is a student.', zh: '他是一名学生。' },
      { en: 'We have dinner together on Sundays.', zh: '我们周日会一起吃晚饭。' },
    ],
  },
  {
    courseId: 'likes', groupId: 'daily', title: '喜欢什么，不喜欢什么', tip: '留意 I like、I love 和 I prefer 的不同表达。',
    sentences: [
      { en: 'Do you like coffee?', zh: '你喜欢咖啡吗？', speaker: 'A' },
      { en: 'I prefer tea.', zh: '我更喜欢茶。', speaker: 'B' },
      { en: 'What do you like to eat?', zh: '你喜欢吃什么？', speaker: 'A' },
      { en: 'I love noodles.', zh: '我很喜欢吃面条。', speaker: 'B' },
      { en: 'Do you like spicy food?', zh: '你喜欢辣的食物吗？', speaker: 'A' },
      { en: 'Yes, but not too spicy.', zh: '喜欢，不过别太辣。', speaker: 'B' },
    ],
  },
  {
    courseId: 'weather', groupId: 'daily', title: '用天气打开话题', tip: '天气是轻松聊天的开头，试着把问句读得自然一点。',
    sentences: [
      { en: "It's a lovely day today.", zh: '今天天气真好。', speaker: 'A' },
      { en: 'Yes, the sun is out.', zh: '是啊，太阳出来了。', speaker: 'B' },
      { en: 'Is it cold outside?', zh: '外面冷吗？', speaker: 'A' },
      { en: 'Just a little.', zh: '有一点。', speaker: 'B' },
      { en: "I'll take a jacket.", zh: '那我带件外套。', speaker: 'A' },
      { en: "Good idea. It's windy.", zh: '好主意，外面有风。', speaker: 'B' },
    ],
  },
  {
    courseId: 'feelings', groupId: 'daily', title: '说说今天的心情', tip: '先练简单的感受，再补一句原因。',
    sentences: [
      { en: "I'm a bit tired today.", zh: '我今天有点累。' },
      { en: "I didn't sleep well last night.", zh: '我昨晚没睡好。' },
      { en: 'Work is busy this week.', zh: '这周工作很忙。' },
      { en: 'I need a short break.', zh: '我需要休息一小会儿。' },
      { en: 'A walk usually helps.', zh: '散散步通常会好一点。' },
      { en: 'I feel better now.', zh: '我现在感觉好多了。' },
    ],
  },
  {
    courseId: 'weekend', groupId: 'daily', title: '聊聊周末的安排', tip: '练习约朋友见面，听清时间和地点。',
    sentences: [
      { en: 'Are you free on Saturday?', zh: '你周六有空吗？', speaker: 'A' },
      { en: 'Yes, in the afternoon.', zh: '有，下午有空。', speaker: 'B' },
      { en: 'Would you like to go for a walk?', zh: '你想一起去散步吗？', speaker: 'A' },
      { en: 'Sure, that sounds nice.', zh: '好呀，听起来不错。', speaker: 'B' },
      { en: "Let's meet at the park.", zh: '我们在公园见吧。', speaker: 'A' },
      { en: 'See you there at three.', zh: '那三点在那里见。', speaker: 'B' },
    ],
  },
  {
    courseId: 'cafe', groupId: 'out', title: '买一杯喝的', tip: 'A 是顾客，B 是店员；先练顾客的三句话。',
    sentences: [
      { en: "I'd like a small tea, please.", zh: '我想要一小杯茶，谢谢。', speaker: 'A' },
      { en: 'Hot or iced?', zh: '要热的还是冰的？', speaker: 'B' },
      { en: 'Hot, please.', zh: '请给我热的。', speaker: 'A' },
      { en: 'Would you like any milk?', zh: '需要加牛奶吗？', speaker: 'B' },
      { en: 'No milk, thank you.', zh: '不用加牛奶，谢谢。', speaker: 'A' },
      { en: 'Anything else?', zh: '还要别的吗？', speaker: 'B' },
    ],
  },
  {
    courseId: 'restaurant', groupId: 'out', title: '餐厅里点餐', tip: '练会入座、看菜单和点餐的基本表达。',
    sentences: [
      { en: 'A table for two, please.', zh: '请给我们一张两人桌。', speaker: 'A' },
      { en: 'Please sit here.', zh: '请坐这里。', speaker: 'B' },
      { en: 'Could we see the menu?', zh: '可以让我们看一下菜单吗？', speaker: 'A' },
      { en: 'Of course. Here you are.', zh: '当然，给您。', speaker: 'B' },
      { en: "I'll have the chicken and rice.", zh: '我要鸡肉配米饭。', speaker: 'A' },
      { en: 'And what would you like to drink?', zh: '那您想喝点什么？', speaker: 'B' },
    ],
  },
  {
    courseId: 'shopping', groupId: 'out', title: '买东西，问价格', tip: '这是一段买包的小对话，价格是练习用的例子。',
    sentences: [
      { en: 'How much is this bag?', zh: '这个包多少钱？', speaker: 'A' },
      { en: "It's twenty dollars.", zh: '二十美元。', speaker: 'B' },
      { en: 'Do you have it in black?', zh: '有黑色的吗？', speaker: 'A' },
      { en: "Yes, here's a black one.", zh: '有，这个是黑色的。', speaker: 'B' },
      { en: 'Can I pay by card?', zh: '我可以刷卡吗？', speaker: 'A' },
      { en: 'Yes, you can.', zh: '可以。', speaker: 'B' },
    ],
  },
  {
    courseId: 'directions', groupId: 'out', title: '问路与指路', tip: '听清 straight、left 和 right，再想象路线。',
    sentences: [
      { en: 'Excuse me, where is the station?', zh: '打扰一下，车站在哪里？', speaker: 'A' },
      { en: 'Go straight and turn left.', zh: '直走，然后左转。', speaker: 'B' },
      { en: 'Is it far from here?', zh: '离这里远吗？', speaker: 'A' },
      { en: "No, it's a five-minute walk.", zh: '不远，走路五分钟。', speaker: 'B' },
      { en: 'Is it on the right?', zh: '是在右边吗？', speaker: 'A' },
      { en: 'Yes, next to the bank.', zh: '对，在银行旁边。', speaker: 'B' },
    ],
  },
  {
    courseId: 'hotel', groupId: 'out', title: '在酒店办理入住', tip: 'A 是旅客，B 是前台；预订姓名用 Lin 作示例。',
    sentences: [
      { en: 'Hello, I have a reservation.', zh: '你好，我有预订。', speaker: 'A' },
      { en: 'What name is it under?', zh: '预订用的是什么名字？', speaker: 'B' },
      { en: "It's under Lin.", zh: '用的是 Lin 这个名字。', speaker: 'A' },
      { en: 'May I see your passport?', zh: '可以看一下您的护照吗？', speaker: 'B' },
      { en: 'Sure. What time is breakfast?', zh: '可以。早餐几点开始？', speaker: 'A' },
      { en: 'Breakfast starts at seven.', zh: '早餐七点开始。', speaker: 'B' },
    ],
  },
  {
    courseId: 'taxi', groupId: 'out', title: '打车去目的地', tip: '练习告诉司机目的地、询问时间和下车。',
    sentences: [
      { en: 'To the airport, please.', zh: '麻烦去机场。', speaker: 'A' },
      { en: 'Sure. Do you have any bags?', zh: '好的，您有行李吗？', speaker: 'B' },
      { en: 'Just this one.', zh: '只有这一个。', speaker: 'A' },
      { en: 'The trip takes about thirty minutes.', zh: '路程大概三十分钟。', speaker: 'B' },
      { en: 'Could you stop here, please?', zh: '可以在这里停一下吗？', speaker: 'A' },
      { en: 'Of course. Here we are.', zh: '当然，我们到了。', speaker: 'B' },
    ],
  },
  {
    courseId: 'welcome-customer', groupId: 'trade', title: '在展位接待客户', tip: '语速慢一点，说得亲切。先练迎接客户的六句常用语。',
    sentences: [
      { en: 'Hi, welcome to our booth.', zh: '你好，欢迎来到我们的展位。' },
      { en: "I'm Lin from the sales team.", zh: '我是销售团队的 Lin。' },
      { en: 'Please take a look around.', zh: '请随便看看。' },
      { en: 'Are you looking for anything in particular?', zh: '你有想特别了解的产品吗？' },
      { en: 'I can show you a few options.', zh: '我可以给你介绍几种选择。' },
      { en: 'Would you like our catalog?', zh: '你想要一份我们的产品目录吗？' },
    ],
  },
  {
    courseId: 'product', groupId: 'trade', title: '介绍一款充电宝', tip: '用充电宝练习介绍产品；实际介绍时按自己的产品核对描述。',
    sentences: [
      { en: 'Let me show you this power bank.', zh: '我给你介绍一下这个充电宝。' },
      { en: "It's small and easy to carry.", zh: '它小巧，随身携带很方便。' },
      { en: 'It fits in a small bag.', zh: '它可以放进小包里。' },
      { en: 'This is the charging port.', zh: '这是充电接口。' },
      { en: 'Let me show you how it works.', zh: '我来演示一下怎么用。' },
      { en: 'Would you like to try it?', zh: '你想试一下吗？' },
    ],
  },
  {
    courseId: 'customer-needs', groupId: 'trade', title: '先问清客户的需求', tip: 'A 是卖方，B 是客户；先把问题说清楚，再听对方的回答。',
    sentences: [
      { en: 'What kind of product do you need?', zh: '你需要什么样的产品？', speaker: 'A' },
      { en: 'Something small and light.', zh: '体积小、重量轻的。', speaker: 'B' },
      { en: 'Which color do you prefer?', zh: '你更喜欢哪个颜色？', speaker: 'A' },
      { en: 'Black would be great.', zh: '黑色就很好。', speaker: 'B' },
      { en: 'How many would you like to order?', zh: '你想订购多少个？', speaker: 'A' },
      { en: "We're thinking about a hundred.", zh: '我们在考虑订一百个。', speaker: 'B' },
    ],
  },
  {
    courseId: 'quote', groupId: 'trade', title: '问价格，发报价', tip: '先练询价与确认信息，不急着承诺价格。',
    sentences: [
      { en: "What's the price per unit?", zh: '单价是多少？', speaker: 'A' },
      { en: 'It depends on the quantity.', zh: '这取决于订购数量。', speaker: 'B' },
      { en: 'Could you send me a quote?', zh: '你能给我发一份报价吗？', speaker: 'A' },
      { en: 'Sure. What is your email address?', zh: '可以。你的电子邮箱是什么？', speaker: 'B' },
      { en: "I'll write it down for you.", zh: '我写下来给你。', speaker: 'A' },
      { en: "Thanks. I'll check the details.", zh: '谢谢，我会核对详细信息。', speaker: 'B' },
    ],
  },
  {
    courseId: 'sample-shipping', groupId: 'trade', title: '沟通样品和运费', tip: '遇到还没确认的信息，可以先说“我查一下”。',
    sentences: [
      { en: 'Can I get a sample first?', zh: '我能先拿一个样品吗？', speaker: 'A' },
      { en: 'Let me check if we have one available.', zh: '我查一下有没有可提供的样品。', speaker: 'B' },
      { en: 'How much is shipping?', zh: '运费是多少？', speaker: 'A' },
      { en: 'Could you send me your address?', zh: '你可以把地址发给我吗？', speaker: 'B' },
      { en: 'Sure, I can send it now.', zh: '可以，我现在就发。', speaker: 'A' },
      { en: "I'll check the shipping cost for you.", zh: '我会帮你查询运费。', speaker: 'B' },
    ],
  },
  {
    courseId: 'follow-up', groupId: 'trade', title: '轻松跟进客户', tip: '先听完再读，语气像友好地问候，不用着急催促。',
    sentences: [
      { en: 'Hi, I hope your week is going well.', zh: '你好，希望你这周过得顺利。' },
      { en: 'Did you get the catalog I sent?', zh: '你收到我发的产品目录了吗？' },
      { en: 'Do you have any questions?', zh: '你有什么问题吗？' },
      { en: 'I can send you more photos.', zh: '我可以给你发更多照片。' },
      { en: 'Let me know what you think.', zh: '有想法的话，告诉我就好。' },
      { en: 'Thanks for your time.', zh: '谢谢你抽出时间。' },
    ],
  },
]; // 内置跟练课程

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
