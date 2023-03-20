import { NextApiRequest, NextApiResponse } from "next";

// OpenAI APIキーを環境変数から取得する
const openaiApiKey = process.env.OPENAI_API_KEY;

// OpenAI APIを呼び出す関数
async function callOpenaiApi(prompt) {
  const response = await fetch(
    "https://api.openai.com/v1/engines/davinci-codex/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 50,
        n: 1,
        stop: ["\n"],
      }),
    }
  );

  const result = await response.json();
  return result.choices[0].text.trim();
}

// APIエンドポイントの処理を定義する関数
export default async function chatHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // POSTリクエストの場合のみ処理を行う
  if (req.method === "POST") {
    try {
      const userInput = req.body.input;
      const botResponse = await generateBotResponse(userInput);

      // ボットの回答を返す
      res.status(200).json({ response: botResponse });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // POSTリクエスト以外はエラーを返す
    res.status(400).json({ error: "Bad request" });
  }
}

// ユーザーからの質問に対するボットの回答を生成する関数
async function generateBotResponse(userInput) {
  const prompt = `Q: ${userInput}\nA:`;
  const botResponse = await callOpenaiApi(prompt);
  return botResponse;
}
