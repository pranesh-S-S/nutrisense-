# NutriSense — Clinical Nutrition & Gastronomy Intelligence Platform

NutriSense is an evidence-based clinical nutrition, gastronomy science, and dietary intelligence platform. It bridges biochemical nutrient density, culinary preparation retention (USDA Release 6), and human bioavailability kinetics with localized, cost-effective pantry staples.

---

## 🌟 Key Features

- **Personalized RDA Engine**: Computes individualized energy balance and nutrient targets via the Mifflin-St Jeor equation modulated by Physical Activity Level (PAL 1.2–1.9), pregnancy/lactation trimesters, and manual macro/calorie overrides.
- **Gastronomy Retention Lab**: Simulates nutrient preservation vs. destruction across cooking methods (steaming, boiling, pressure cooking, stir-frying, fermentation, sprouting) according to USDA Table of Nutrient Retention Factors (Release 6).
- **Bioavailability Simulator**: Models nutrient absorption mechanisms, accounting for biochemical enhancers (ascorbic acid, culinary lipids, piperine) and anti-nutritional inhibitors (phytic acid, oxalates, polyphenols/tannins).
- **Clinical Medical Safeguards**: Proactively monitors and flags dietary conflicts for kidney stones/hyperoxaluria, type 2 diabetes, iron deficiency anemia, hypertension, osteoporosis, and hypothyroidism.
- **Regional & Economic Optimization**: Recommends superior local pantry alternatives (e.g. Ceylon Cinnamon and Amla over expensive imported berries) based on ORAC antioxidant scores and cost per gram.
- **Multi-Meal Logger**: Tracks breakfast, lunch, dinner, and snacks with portion scalers and preparation method tracking.
- **Interactive Knowledge Graph**: Graph explorer connecting foods, bioactive compounds, physiological pathways, and medical conditions.
- **AI Clinical Nutrition Assistant**: Context-aware clinical guidance powered by Groq (`openai/gpt-oss-120b`) with Google Gemini 2.5 Flash and verified local clinical fallbacks.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Motion
- **Backend / API**: Express.js server, Node.js, Vercel Serverless Functions (`api/index.ts`)
- **AI / LLM**: Groq API (GPT-OSS 120B), Google GenAI SDK (`@google/genai` Gemini 2.5 Flash)
- **Deployment**: Vercel ready via `vercel.json`

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/pranesh-S-S/nutrisense-.git
   cd nutrisense-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional for AI keys):
   ```bash
   cp .env.example .env
   ```
   Add your keys in `.env`:
   - `GROQ_API_KEY`: Groq API key for GPT-OSS 120B
   - `GEMINI_API_KEY`: Google Gemini API key

4. Start development server:
   ```bash
   npm run dev
   ```
   The application will be live at `http://localhost:3000`.

5. Build for production:
   ```bash
   npm run build
   npm start
   ```

---

## ☁️ Deployment to Vercel

This repository is pre-configured with `vercel.json` for one-click deployment:

1. Import the repository in [Vercel](https://vercel.com/new).
2. Framework Preset: **Vite**
3. Build Command: `vite build`
4. Output Directory: `dist`
5. Environment Variables:
   - `GROQ_API_KEY` (Optional)
   - `GEMINI_API_KEY` (Optional)
6. Click **Deploy**!

---

## 📄 License

MIT License.