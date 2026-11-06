/**
 * NutriSense - AI Nutrition Intelligence Assistant (Chapter 18 & RAG Engine)
 * Powered by Groq GPT-OSS 120B with Grounded Food Science & Regional Nutrition
 */

import React, { useState } from 'react';
import { UserProfile } from '../types/nutrition';
import {
  MessageSquareText,
  Send,
  Sparkles,
  Bot,
  User,
  BookOpen,
  HelpCircle,
  ShieldAlert,
  Loader2,
  Globe,
  Stethoscope,
  Cpu,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  source?: string;
  timestamp: string;
}

interface AskNutriSenseViewProps {
  profile: UserProfile;
}

const SAMPLE_QUESTIONS = [
  'What are the best antioxidant-rich foods for my region instead of expensive blueberries?',
  'I have kidney stones / hyperoxaluria: which greens are safe to replace spinach?',
  'How does cinnamon increase insulin sensitivity in Type 2 Diabetes, and how to prepare it?',
  'Why should I avoid drinking tea or coffee with iron-rich meals if I have anemia?',
  'How does sprouting moong dal eliminate phytic acid and multiply bioavailable minerals?',
  'Steaming vs boiling broccoli: what happens to sulforaphane, folates, and Vitamin C?',
];

export const AskNutriSenseView: React.FC<AskNutriSenseViewProps> = ({ profile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello ${profile.name}! I am your **NutriSense AI Nutrition & Clinical Intelligence Assistant**, powered by **Groq GPT-OSS 120B** and grounded in the USDA Table of Nutrient Retention Factors (Release 6), ICMR-NIN Indian Food Composition Tables, and peer-reviewed bioavailability science.\n\nI actively tailor guidance to your region (**${profile.region || 'South Asia / India'}**) and your medical safeguards (**${profile.medical_conditions?.join(', ') || 'General Wellness'}**).\n\nAsk me anything about native pantry superfoods, cost-effective antioxidant alternatives (e.g. cinnamon vs. blueberries), clinical contraindications (e.g. oxalates in kidney stones), or cooking chemistry.`,
      source: 'Groq GPT-OSS 120B · Regional & Clinical Knowledge Engine',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (questionToSend?: string) => {
    const text = (questionToSend || inputQuestion).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          userProfileContext: {
            name: profile.name,
            age: profile.age,
            sex: profile.sex,
            activity_level: profile.activity_level,
            dietary_preference: profile.dietary_preference,
            is_pregnant: profile.is_pregnant,
            medical_conditions: profile.medical_conditions || [],
            region: profile.region || 'South Asia / India',
          },
        }),
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'No response available.',
        source: data.source || 'Groq GPT-OSS 120B Evidence Engine',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: 'An error occurred while querying the Nutrition Intelligence Engine. Please verify network connectivity.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>Groq GPT-OSS 120B Reasoning</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-medium">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Region: {profile.region || 'South Asia / India'}</span>
            </span>
            {profile.medical_conditions && profile.medical_conditions.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium">
                <Stethoscope className="w-3.5 h-3.5 text-amber-600" />
                <span>{profile.medical_conditions.join(', ')}</span>
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Ask NutriSense: Clinical & Regional Nutrition Intelligence
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Grounded in USDA Release 6, ICMR-NIN composition databases, and clinical medical contraindications.
          </p>
        </div>
      </div>

      {/* Suggested Questions Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="font-semibold text-slate-700 shrink-0 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Quick Inquiries:</span>
        </span>
        {SAMPLE_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-700 text-xs whitespace-nowrap transition-all shrink-0 font-medium cursor-pointer shadow-xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-emerald-600 text-white shadow-sm'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-50 border border-slate-200 text-slate-800'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {msg.source && (
                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-700">
                    <span className="flex items-center gap-1 italic">
                      <BookOpen className="w-3 h-3" />
                      <span>{msg.source}</span>
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-700 italic">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
              </div>
              <span>Consulting Groq GPT-OSS 120B with regional and clinical grounding...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about regional foods, cinnamon vs blueberries, kidney stones, cooking chemistry..."
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            onClick={() => handleSend()}
            disabled={loading || !inputQuestion.trim()}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Medical Safety Notice */}
      <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 flex items-start gap-2 text-[11px] text-amber-900">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          <strong>Medical Decision-Support Safeguard:</strong> Information provided by the NutriSense Assistant is
          for educational and nutritional decision-support purposes based on peer-reviewed literature. It is not intended
          as individual medical advice or diagnosis. Always consult a qualified physician or registered dietitian for medical questions.
        </p>
      </div>
    </div>
  );
};
