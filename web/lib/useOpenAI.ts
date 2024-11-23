import { useState } from "react";

const API_URL = "https://api.chatanywhere.tech/v1/chat/completions";

export const useOpenAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  // Define the type for personality traits
  type PersonalityTraits = {
    [key: string]: string; // Allow any string key
  };

  const personalityTraits: PersonalityTraits = {
    "朋友": "友好、支持、乐于助人",
    "自我": "反思、内省、诚实",
    "家庭": "关心、温暖、支持",
    "关系": "理解、同情、沟通",
    "职场": "专业、务实、目标导向"
  };

  const sendMessage = async (selectedPrompt: keyof PersonalityTraits, message: string) => {
    setLoading(true);
    setError(null);

    const maxRetries = 3; // 最大重试次数
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const personalityDescription = personalityTraits[selectedPrompt];

        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "user", content: `你是一个${selectedPrompt}的人格，特征是：${personalityDescription}。请根据这个人格回答问题：${message}` }
            ],
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          throw new Error("网络错误或请求失败");
        }

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;

        setHistory((prev) => [...prev, `你: ${message}`, `AI: ${aiMessage}`]);
        return aiMessage; // 返回 AI 消息
      } catch (err) {
        setError((err as Error).message);
        return null; // 处理错误时返回 null
      } finally {
        setLoading(false); // 确保在结束时设置 loading 状态
      }
    }
  };

  return { sendMessage, loading, error, history, setHistory };
}; 