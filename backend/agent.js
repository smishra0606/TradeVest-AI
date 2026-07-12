import { ChatOpenAI } from "@langchain/openai";
import { TavilySearch } from "@langchain/tavily";

export async function runResearchAgent(companyName) {
  try {
    // Initialize the shared model instance
    const model = new ChatOpenAI({
      model: "nvidia/nemotron-3-super-120b-a12b:free",
      temperature: 0.2,
      maxTokens: 2000,
      apiKey: process.env.OPENROUTER_API_KEY,
      configuration: { baseURL: "https://openrouter.ai/api/v1" }
    });

    // Step 1: Query Normalization (Fix Spelling)
    const normPrompt = `You are an expert financial registry system. The user typed: '${companyName}'. Correct any spelling mistakes, typos, or incomplete names and return ONLY the official public trade name of the company (e.g., if they type 'Ttaa Mtoors', output 'Tata Motors'; if 'Appel', output 'Apple'). Do not include markdown or extra text, just the corrected name.`;
    
    const normMessage = await model.invoke(normPrompt);
    const cleanCompanyName = normMessage.content.trim();

    // Step 2: Advanced Market-Aware Search
    const searchTool = new TavilySearch({ maxResults: 3 });
    const searchContext = await searchTool.invoke({ 
      query: `${cleanCompanyName} stock financial performance NSE BSE quarterly results market sentiment pros cons` 
    });

    const searchContextString = typeof searchContext === 'string' ? searchContext : JSON.stringify(searchContext);

    // Step 3: Upgraded Structural JSON Prompt
    const analysisPrompt = `You are an expert AI Investment Research Assistant. Review the following live web data regarding ${cleanCompanyName}:
---
${searchContextString}
---
Based strictly on this data, make a definitive decision to either 'Invest' or 'Pass'. Your response must be an absolute pure JSON object with exactly the following keys and structure:
- "company": (string: the corrected name '${cleanCompanyName}')
- "decision": (string: "Invest" or "Pass")
- "confidence": (number between 1 and 100 representing certainty based on data availability)
- "companyDetails": (string: 2-3 sentences summarizing the company's core business and current market context)
- "pros": (array of 3 strings detailing financial strengths)
- "cons": (array of 3 strings detailing potential risk vectors)

Do not wrap the JSON in markdown blocks or output any other text. Output ONLY valid JSON.`;

    const aiMessage = await model.invoke(analysisPrompt);
    const outputText = aiMessage.content;

    // JSON Parsing
    let parsedOutput;
    try {
      parsedOutput = JSON.parse(outputText);
    } catch (parseError) {
      // Fallback regex parsing just in case it still wraps in markdown
      const jsonMatch = outputText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedOutput = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error(`Agent failed to return valid JSON. Output was: ${outputText}`);
      }
    }

    return parsedOutput;
  } catch (error) {
    console.error("Agent Execution Error:", error);
    throw error;
  }
}
