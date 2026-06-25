'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import Link from 'next/link';

type FAQ = {
  question: string;
  answer: string;
  keywords: string[];
  related?: number[]; // indices of related FAQs to suggest after
};

type ChatMessage = {
  id: number;
  role: 'bot' | 'user';
  text?: string;
  type?: 'text' | 'questions' | 'fallback';
  questionIndices?: number[];
};

//FAQ Data 
const faqs: FAQ[] = [
  {
    question: 'What are your store hours?',
    answer: 'We\'re open every day from 9:00 AM to 6:30 PM, including weekends!',
    keywords: ['hours', 'open', 'close', 'time', 'when'],
    related: [5],
  },
  {
    question: 'Where is your store located?',
    answer: 'We\'re located at 186-188, Đ. Lê Thánh Tôn, P, Quận 1, Hồ Chí Minh, Vietnam.',
    keywords: ['where', 'location', 'address', 'find', 'store'],
    related: [0],
  },
  {
    question: 'Do you offer custom orders?',
    answer: 'Yes! We work with you to design one-of-a-kind pieces. Reach out through our Contact page and our artisans will help bring your vision to life.',
    keywords: ['custom', 'design', 'personalize', 'engrave', 'order'],
    related: [3, 6],
  },
  {
    question: 'How do I clean my jewelry?',
    answer: 'For most pieces, a soft cloth and mild soap with warm water works great. Avoid harsh chemicals and store pieces separately to prevent scratching. We also offer professional cleaning — check our Services page!',
    keywords: ['clean', 'care', 'maintain', 'shine', 'polish'],
    related: [2, 4],
  },
  {
    question: 'Can you resize my ring?',
    answer: 'Absolutely — ring and bracelet resizing is one of our core services. Bring your piece into the store or contact us for details.',
    keywords: ['resize', 'size', 'fit', 'ring', 'bracelet'],
    related: [2, 5],
  },
  {
    question: 'How can I contact you?',
    answer: 'You can call us at +84 903 743 132, email quochuyta243@gmail.com, or use our Contact page form — we typically respond within 24 hours.',
    keywords: ['contact', 'call', 'email', 'phone', 'reach'],
    related: [1],
  },
  {
    question: 'Do you repair broken jewelry?',
    answer: 'Yes, we restore broken or damaged jewelry to its original beauty. Visit our Services page or contact us with details about the piece.',
    keywords: ['repair', 'broken', 'fix', 'damaged'],
    related: [3, 4],
  },
  {
    question: 'Is your gold authentic?',
    answer: 'Every piece is crafted from certified, high-quality gold and gemstones — authenticity is guaranteed on everything we sell.',
    keywords: ['authentic', 'real', 'gold', 'certified', 'genuine'],
    related: [2],
  },
];

function findBestMatch(input: string): number | null {
  const lower = input.toLowerCase();
  let bestScore = 0;
  let bestIndex: number | null = null;

  faqs.forEach((faq, i) => {
    let score = 0;
    faq.keywords.forEach((kw) => {
      if (lower.includes(kw)) score += 1;
    });
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  });

  return bestScore > 0 ? bestIndex : null;
}

export default function FaqChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      role: 'bot',
      text: "Hi! I'm here to help with common questions about Kim Thao Trang Jewelry. Pick a question below or type your own!",
      type: 'text',
    },
    {
      id: 1,
      role: 'bot',
      type: 'questions',
      questionIndices: [0, 1, 2, 3],
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(2);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const askQuestion = (index: number) => {
    const faq = faqs[index];
    const userMsg: ChatMessage = { id: idCounter.current++, role: 'user', text: faq.question, type: 'text' };
    const botMsg: ChatMessage = { id: idCounter.current++, role: 'bot', text: faq.answer, type: 'text' };

    setMessages((prev) => [...prev, userMsg, botMsg]);

    if (faq.related && faq.related.length > 0) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: idCounter.current++, role: 'bot', type: 'questions', questionIndices: faq.related },
        ]);
      }, 400);
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = { id: idCounter.current++, role: 'user', text: trimmed, type: 'text' };
    const matchIndex = findBestMatch(trimmed);

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      if (matchIndex !== null) {
        const faq = faqs[matchIndex];
        setMessages((prev) => [
          ...prev,
          { id: idCounter.current++, role: 'bot', text: faq.answer, type: 'text' },
        ]);
        if (faq.related) {
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              { id: idCounter.current++, role: 'bot', type: 'questions', questionIndices: faq.related },
            ]);
          }, 400);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: idCounter.current++,
            role: 'bot',
            type: 'fallback',
            text: "Hmm, I'm not sure about that one. Try one of the common questions, or reach out directly!",
          },
        ]);
      }
    }, 350);
  };

  return (
    <>
      {/* Floating bubble */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-8 right-8 z-50 bg-amber-900 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Pulse ring when closed */}
        {!open && (
          <span className="absolute inset-0 rounded-full border-2 border-amber-500 animate-ping opacity-1000" />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-8 z-50 w-[340px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-amber-100 flex flex-col overflow-hidden"
            style={{ height: '480px' }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          >
            {/* Header */}
            <div className="bg-amber-900 text-white px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="font-serif text-lg leading-none">Kim Thao Trang</p>
                <p className="text-amber-200 text-xs">Ask us anything</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-amber-50/40">
              {messages.map((msg) => {
                if (msg.type === 'questions' && msg.questionIndices) {
                  return (
                    <motion.div
                      key={msg.id}
                      className="flex flex-col gap-2 items-start"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {msg.questionIndices.map((qIndex) => (
                        <button
                          key={qIndex}
                          onClick={() => askQuestion(qIndex)}
                          className="text-xs bg-white border border-amber-200 text-amber-900 px-3 py-2 rounded-full hover:bg-amber-100 transition-colors text-left"
                        >
                          {faqs[qIndex].question}
                        </button>
                      ))}
                    </motion.div>
                  );
                }

                const isFallback = msg.type === 'fallback';
                return (
                  <motion.div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-amber-900 text-white rounded-br-sm'
                          : isFallback
                          ? 'bg-amber-100 text-amber-900 rounded-bl-sm'
                          : 'bg-white text-gray-700 rounded-bl-sm shadow-sm border border-amber-100'
                      }`}
                    >
                      {msg.text}
                      {isFallback && (
                        <Link href="/contact" className="block mt-2 text-amber-700 underline text-xs font-medium">
                          Go to Contact page →
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-amber-100 flex items-center gap-2 bg-white">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                className="flex-1 px-3 py-2 text-sm text-black border border-gray-500 rounded-full outline-none focus:border-amber-900 transition-colors"
              />
              <motion.button
                onClick={handleSend}
                className="bg-amber-900 text-white p-2.5 rounded-full shrink-0"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}