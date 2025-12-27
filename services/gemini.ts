
import { GoogleGenAI, Type } from "@google/genai";
import { SiteConfig } from "../types";

// 統一的 AI 處理入口：根據身分決定是「聊天」還是「設計」
export const processAIRequest = async (
  input: string, 
  currentConfig: SiteConfig, 
  isAdmin: boolean,
  base64Image?: string
): Promise<{ text: string, newConfig?: SiteConfig }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // 如果不是管理員，走一般客服邏輯
  if (!isAdmin) {
    const systemInstruction = `你是 Katty 的專業小助理。引導預約、解釋定金、語氣親切。如果使用者想預約，請包含字串 [TRIGGER_BOOKING] 在回覆中。`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: input,
      config: { systemInstruction },
    });
    return { text: response.text || "正在連線中..." };
  }

  // 如果是管理員，走「上帝模式」設計邏輯
  const adminPrompt = `你現在是 Katty 的全能網站總管。
  
  【目前的配置】:
  ${JSON.stringify(currentConfig, null, 2)}

  【店長的指令】:
  "${input || (base64Image ? "請參考此圖片重塑網站風格" : "優化目前的設計")}"

  【你的任務】:
  1. 如果店長要求修改外觀（顏色、圓角、順序），請產生新的 SiteConfig JSON。
  2. 回覆格式必須包含兩個部分，中間用 "|||" 隔開：
     [對店長說的話] ||| [新的 JSON 配置，若無變動則回傳目前的 JSON]
  
  【JSON 規則】:
  - 只能修改顏色(Hex)、圓角(rem)、字體比例(0.8-1.5)或組件順序(layout)。
  - layout 有效值: ["hero", "about", "pets", "portfolio"]。
  
  範例回覆：
  太棒了！我已經按照您的要求，將背景換成法式奶油色，並把作品集移到最上方了。 ||| {"theme":{...},"layout":["portfolio",...]}
  `;

  const parts: any[] = [{ text: adminPrompt }];
  if (base64Image) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Image.split(',')[1]
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // 使用 Pro 模型處理複雜任務
      contents: { parts },
    });

    const fullResponse = response.text || "";
    const [msg, jsonStr] = fullResponse.split("|||");
    
    if (jsonStr) {
      try {
        const newConfig = JSON.parse(jsonStr.trim());
        return { text: msg.trim(), newConfig };
      } catch (e) {
        return { text: fullResponse };
      }
    }
    return { text: fullResponse };
  } catch (error) {
    console.error("AI Error:", error);
    return { text: "哎呀，設計解析出了一點問題，請再試一次！" };
  }
};

export const generateStory = async (title: string, tags: string[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `你是一位專業的精品美甲藝術導覽員。請為名為「${title}」的美甲作品寫一段優美的描述。`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "這是一段關於美的故事。";
  } catch (error) {
    return "指尖上的藝術，是靈魂的縮影。";
  }
};
