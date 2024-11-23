"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useOpenAI } from "@/lib/useOpenAI";

const prompts = [
  "朋友",
  "自我",
  "家庭",
  "关系",
  "职场",
];

export default function Home() {
  const { sendMessage, loading, error, history, setHistory } = useOpenAI();
  const [input, setInput] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState(prompts[0]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = `你: ${input}`;
      setHistory((prev) => {
        if (prev[prev.length - 1] !== userMessage) {
          return [...prev, userMessage];
        }
        return prev;
      });

      const aiMessage = await sendMessage(selectedPrompt, input);
      setInput("");

      if (aiMessage) {
        const aiResponse = `AI: ${aiMessage}`;
        setHistory((prev) => {
          if (prev[prev.length - 1] !== aiResponse) {
            return [...prev, aiResponse];
          }
          return prev;
        });
      } else {
        console.error("未能获取 AI 消息");
      }
    }
  };

  const handleVoiceInput = () => {
    console.log("语音输入功能待实现");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <h1 className="text-2xl font-bold mb-4">关系in菩萨</h1>
      <div className="w-full max-w-md p-4 border rounded-lg bg-white shadow-md">
        <div className="h-64 overflow-y-auto mb-4 p-2 border rounded-lg bg-gray-100">
          {history.map((msg, index) => (
            <div key={index} className="p-2 border-b last:border-b-0">
              {msg}
            </div>
          ))}
        </div>
        <div className="flex items-center mb-2">
          <select
            value={selectedPrompt}
            onChange={(e) => setSelectedPrompt(e.target.value)}
            className="mr-2 p-2 border rounded-md"
          >
            {prompts.map((prompt) => (
              <option key={prompt} value={prompt}>
                {prompt}
              </option>
            ))}
          </select>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="输入你的消息..."
            className="flex-grow mr-2"
          />
          <button
            onClick={handleVoiceInput}
            className="p-2 bg-green-500 text-white rounded-lg"
          >
            🎤
          </button>
        </div>
        <button
          onClick={handleSend}
          className="w-full p-2 bg-blue-500 text-white rounded-lg"
          disabled={loading}
        >
          {loading ? "发送中..." : "发送"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}
