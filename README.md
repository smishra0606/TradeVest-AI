# Investment Research Agent

## 1. Overview
[The **Investment Research Agent** is an AI-powered web application designed to help you make informed investment decisions. Provide a company name, and the agent will dynamically search for recent news, financial performance, and stock data. It strictly evaluates the pros and cons to output a definitive **"Invest"** or **"Pass"** verdict, accompanied by detailed, data-driven reasoning.]

## 2. How to run it

### Prerequisites
- Node.js (v18+)
- API Keys for Exa, OpenAI, and Google Gemini.
- Basic understandingskills

### Setup Steps
1. **Clone/Navigate to the project directory:**
   Ensure you are in the root directory: `investment-research-agent`.

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory and add your API keys:
   ```env
   PORT=5000
   EXA_API_KEY=your_exa_api_key
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_API_KEY=your_google_api_key
   ```
   Start the backend server:
   ```bash
   node index.js
   ```

3. **Frontend Setup:**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. **Access the App:**
   Open your browser and navigate to `http://localhost:5173` (or the port Vite provides).

## 3. How it works
- **Frontend (React + Vite):** A minimalistic, premium glassmorphic dashboard built with Vanilla CSS. It takes the user's target company and preferred LLM provider, displaying an interactive loading state while waiting for the complex backend resolution.
- **Backend (Express.js):** Exposes an `/api/research` POST endpoint. 
- **Agent Architecture (LangChain):** The backend leverages LangChain to dynamically initialize either OpenAI (`gpt-4o`) or Google Gemini (`gemini-2.5-pro`) based on the user's preference. The agent uses the **Exa Search API** as its primary Tool to fetch real-time financial context, feeds it into a strict system prompt, and forcefully returns a structured JSON response containing the `"decision"` and `"reasoning"`.

## 4. Key decisions & trade-offs
- **Standard JavaScript vs. TypeScript:** Standard JS (with React/Node) was intentionally chosen over TypeScript to optimize for rapid prototyping and iteration speed. This reduced boilerplate, setup friction, and compilation overhead, allowing the core focus to remain on getting the LangChain agent and Exa API integration perfectly tuned.
- **Exa Search API:** Traditional keyword-based search APIs (like Bing or Google Custom Search) often return scattered SEO pages. Exa Search (a neural search engine) was selected because it deeply understands context, extracting highly relevant financial data, earnings reports, and recent market news perfectly formatted for LLM consumption.

## 5. Example runs

### Example 1: High-Growth Tech
**Input:** `Company Name: NVIDIA` | `Model: OpenAI (GPT-4o)`
**Output:**
- **Decision:** `Invest`
- **Reasoning:** "NVIDIA continues to demonstrate unparalleled dominance in the AI hardware sector. Recent earnings show a 200%+ YoY revenue growth driven by insatiable data center demand for H100 GPUs. While the P/E ratio is historically high, their impenetrable moat in CUDA software and lack of immediate competitor parity justifies the premium. The company’s robust forward guidance heavily mitigates short-term volatility risks."

### Example 2: Struggling Legacy Retail
**Input:** `Company Name: Blockbuster` | `Model: Google Gemini (2.5 Pro)`
**Output:**
- **Decision:** `Pass`
- **Reasoning:** "Search results yield no active financial data indicating a viable, operational publicly-traded entity. The company historically failed to adapt to the digital streaming era and filed for bankruptcy. There are no fundamental metrics, forward guidance, or viable turnaround plans to justify any allocation of capital. Avoid."

## 6. What I would improve with more time
- **Streaming Responses:** Implement Server-Sent Events (SSE) so the user can watch the agent's "thought process" and see the reasoning stream in real-time.
- **Data Visualization:** Integrate a charting library (like Recharts) to pull historical stock price data and display it alongside the agent's verdict.
- **Conversation Memory:** Upgrade the agent to maintain conversation history, allowing the user to ask follow-up questions like *"What about their debt-to-equity ratio?"*.
- **TypeScript Migration:** As the prototype scales, migrating to TypeScript would provide better safety around the LangChain tool schemas and API payloads.
- **Automated Testing:** Implement Jest or Vitest for the core agent logic to ensure it strictly respects the JSON schema constraints across different edge-case companies.
