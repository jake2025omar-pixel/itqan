import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Volume2, Sparkles, MessageCircle, HelpCircle } from 'lucide-react';
import { CatCompanion } from './CatCompanion';
import { catEngine, CatResponse } from '../../services/catEngine';
import { speechService } from '../../services/speech';
import { Language } from '../../types';

interface Message {
  id: string;
  sender: 'user' | 'cat';
  text: string;
  audioPlayWord?: string;
  examples?: string[];
  timestamp: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const CatChatModal: React.FC<Props> = ({ isOpen, onClose, lang }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'cat',
      text: lang === 'ar'
        ? 'مرحباً يا بطل! أنا رفيقك القط الرمادي الذكي في منصة إتقان. اسألني عن معاني الكلمات الإنجليزية، القواعد النحوية (مثل Was و Were أو الأزمنة)، تصاريف الأفعال الشاذة، أو طريقة كتابة الكلمات الصعبة!'
        : 'Hello! I am your Gray AI Cat companion in ITQAN. Ask me about English vocabulary meanings, grammar rules (like Was vs Were or verb tenses), irregular verbs, or how to spell difficult words!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [catMood, setCatMood] = useState<'idle' | 'happy' | 'thinking'>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = catEngine.getDefaultQuestions(lang);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setCatMood('thinking');

    // Rule-based retrieval
    setTimeout(() => {
      const response: CatResponse = catEngine.query(textToSend, lang);
      const catMsg: Message = {
        id: `cat_${Date.now()}`,
        sender: 'cat',
        text: response.text,
        audioPlayWord: response.audioPlayWord,
        examples: response.examples,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, catMsg]);
      setCatMood('happy');
      setTimeout(() => setCatMood('idle'), 2000);
    }, 250);
  };

  const handleSpeak = (text: string) => {
    speechService.speak(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 bg-black/30 backdrop-blur-xs">
      <div className="bg-white w-full sm:max-w-md h-[85vh] sm:h-[650px] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col border border-[#E6DFD5] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#F5F0E8] border-b border-[#E6DFD5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CatCompanion size={44} mood={catMood} interactive={false} />
            <div>
              <h3 className="text-sm font-bold text-[#1C1917] flex items-center gap-1.5">
                {lang === 'ar' ? 'الرفيق الذكي إتقان' : 'ITQAN AI Companion'}
                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-white border border-[#E6DFD5] text-stone-600">
                  {lang === 'ar' ? 'قاعدة بيانات تعليمية' : 'Verified Knowledge'}
                </span>
              </h3>
              <p className="text-[11px] text-stone-500">
                {lang === 'ar' ? 'يجيب على أسئلة المفردات والقواعد فورياً' : 'Instant grammar, vocabulary & spelling answers'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-[#EEE7DC] transition-colors"
            title={lang === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAFAF8]">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#EEE7DC] text-[#1C1917] rounded-br-xs'
                    : 'bg-white text-stone-800 border border-[#E6DFD5] shadow-xs rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Pronunciation Playback button if word is detected */}
                {msg.audioPlayWord && (
                  <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center gap-2">
                    <button
                      onClick={() => handleSpeak(msg.audioPlayWord!)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F5F0E8] text-[#1C1917] text-xs font-semibold hover:bg-[#EEE7DC] transition"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-stone-700" />
                      <span>{lang === 'ar' ? 'استمع للنطق' : 'Listen'} ({msg.audioPlayWord})</span>
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-stone-400 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-2.5 bg-white border-t border-[#E6DFD5] overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-stone-400 px-1 shrink-0">
            {lang === 'ar' ? 'أسئلة مقترحة:' : 'Suggestions:'}
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-xs px-2.5 py-1 rounded-full bg-[#F5F0E8] text-[#1C1917] hover:bg-[#EEE7DC] transition border border-[#E6DFD5] shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-[#F5F0E8] border-t border-[#E6DFD5] flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={
              lang === 'ar'
                ? 'اسأل القط: معنى كلمة، قاعدة، تصريف فعل...'
                : 'Ask the cat: word meaning, grammar rule, verb tense...'
            }
            className="flex-1 bg-white border border-[#E6DFD5] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1C1917] placeholder-stone-400 focus:outline-none focus:border-stone-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 bg-[#EEE7DC] text-[#1C1917] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E5DFD5] rounded-xl transition shadow-xs"
            title={lang === 'ar' ? 'إرسال' : 'Send'}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
