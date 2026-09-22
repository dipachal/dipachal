import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Bus, 
  PhoneCall, 
  Calendar, 
  HelpCircle 
} from 'lucide-react';
import { Language } from '../types';

interface SupportChatbotProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export const SupportChatbot: React.FC<SupportChatbotProps> = ({
  lang,
  isOpen,
  onClose,
}) => {
  const isBn = lang === 'bn';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: isBn
        ? 'আসসালামু আলাইকুম! আমি দ্বীপাচল এন্টারপ্রাইজের ভার্চুয়াল এআই অ্যাসিস্ট্যান্ট। বাস সিট বুকিং, ট্র্যাকিং কোড বা ভাড়া সংক্রান্ত যে কোনো প্রশ্ন করতে পারেন।'
        : 'Hello! I am Dwipachal Enterprise’s AI Assistant. How can I assist you with bus bookings, fares, or tracking today?',
      time: 'এখন'
    }
  ]);

  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Instant smart response based on keywords
    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('কক্সবাজার') || lower.includes('ভাড়া') || lower.includes('fare') || lower.includes('price')) {
        reply = isBn 
          ? 'ঢাকা থেকে কক্সবাজার আমাদের প্রিমিয়াম এসি বাসের ভাড়া ১,৪০০-১,৮০০ টাকা এবং রয়্যাল স্লিপার কোচের ভাড়া ২,২০০-২,৫০০ টাকা। সরাসরি বুকিং করতে কল করুন: 01619320400।'
          : 'Dhaka to Cox’s Bazar AC bus tickets are BDT 1,400-1,800 and Royal Sleeper Coach is BDT 2,200-2,500. Call 01619320400 for direct reservation.';
      } else if (lower.includes('ট্র্যাক') || lower.includes('track') || lower.includes('কোথায়')) {
        reply = isBn
          ? 'বাসের লাইভ অবস্থান জানতে আপনার টিকিটের ট্র্যাকিং কোডটি (যেমন: DWP-8842) উপরে "ট্র্যাক করুন" অপশনে প্রদান করুন।'
          : 'To view real-time location, enter your booking code (e.g. DWP-8842) in the live tracking tool.';
      } else if (lower.includes('হটলাইন') || lower.includes('ফোন') || lower.includes('contact') || lower.includes('number')) {
        reply = isBn
          ? 'আমাদের ২৪/৭ সেন্ট্রাল হটলাইন নম্বর: 01619-320400 এবং 01819-223344।'
          : 'Our 24/7 central contact numbers are: 01619-320400 and 01819-223344.';
      } else {
        reply = isBn
          ? 'ধন্যবাদ আপনার বার্তার জন্য! আমাদের একজন ট্রাভেল কনসালটেন্ট দ্রুত উত্তর দিতে প্রস্তুত। জরুরি যে কোনো তথ্যের জন্য আমাদের হটলাইনে (01619320400) কল করতে পারেন।'
          : 'Thank you for your message! Our reservation officer is reviewing your query. You may also ring our 24/7 helpline at 01619320400.';
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
      {/* Chatbot Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-xs font-bold flex items-center gap-1.5">
              <span>{isBn ? 'দ্বীপাচল এআই সাপোর্ট' : 'Dwipachal AI Support'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            </h4>
            <span className="text-[10px] text-emerald-100 block">
              {isBn ? 'অনলাইন • তৎক্ষণাৎ উত্তর' : 'Online • Instant Assistance'}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="p-4 h-80 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950/50 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-xs'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
            </div>
            <span className="text-[9px] text-slate-400 mt-1 px-1">{m.time}</span>
          </div>
        ))}
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-2 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {[
          isBn ? 'কক্সবাজার ভাড়া কত?' : 'Cox’s Bazar fare?',
          isBn ? 'বাস ট্র্যাকিং কোড?' : 'How to track bus?',
          isBn ? 'হটলাইন নম্বর?' : 'Helpline number?'
        ].map((prompt, i) => (
          <button
            key={i}
            onClick={() => setInput(prompt)}
            className="text-[10px] px-2 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isBn ? 'একটি বার্তা লিখুন...' : 'Type a query...'}
          className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-emerald-500"
        />
        <button
          type="submit"
          className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
