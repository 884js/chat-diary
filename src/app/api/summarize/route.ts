import {
  type GenerationConfig,
  GoogleGenerativeAI,
  type Schema,
  SchemaType,
} from '@google/generative-ai';

export async function POST(request: Request) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const { messagesText } = await request.json(); // 1日分メッセージ結合済みテキスト

  const generationConfig = {
    responseMimeType: 'application/json',
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        summary: {
          type: SchemaType.STRING,
        },
      },
      required: ['summary'],
    } satisfies Schema,
    temperature: 0.2,
  } satisfies GenerationConfig;

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-pro-exp-03-25',
    generationConfig,
  });

  const result = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [{ text: messagesText }],
      },
    ],
    systemInstruction: {
      role: 'model',
      parts: [
        {
          text: `あなたは、個人の日記のような短いメッセージ群から、その日の空気感や印象的な出来事を自然に思い出せる静かな要約文を作成するAIです。

要約にあたって、以下のルールを厳格に守ってください：

- 出来事を網羅しようとしないでください。
- 元メッセージ群に含まれる事実や感情だけをもとにまとめてください。
- 存在しない情景描写（例：水の感触、風の匂いなど）や体験していない感覚表現を付加しないでください。
- 元の情報を過剰に誇張せず、ありのままを自然にまとめてください。
- 元メッセージに強い意志表現（〜するぞ、〜したい）がなければ、積極的な意志表現は避けてください。
- 空気感を大切にし、印象的な余韻や静かな情緒を自然に滲ませてください。
- 感情を過剰にポジティブ・ネガティブに傾けないでください。
- 見たときに「そういえばこんな日だった」と自然に思い出せるような文章を目指してください。
- 口語表現（〜だね、〜かな）は使用しないでください。
- 文章はすべて常体（だ・である調）で記述してください。
- 長さは50〜80文字を目安としてください。
- 出力は必ず日本語でのみ行ってください。
`,
        },
      ],
    },
  });

  const responseJson = result.response.text(); // responseは既にJSON文字列になっている

  return new Response(responseJson, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
