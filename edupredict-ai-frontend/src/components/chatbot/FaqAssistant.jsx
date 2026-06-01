import { useEffect, useState, useRef } from 'react';
import { askFaq } from '../../services/predictApi';
import SuggestionChips from './SuggestionChips';

export default function FaqAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! I am your EduPredict assistant. 🌟 I can help you forecast grades, run what-if scenarios, or answer FAQs.\n\nWhat would you like to do today?",
      suggestions: ["Predict My Grade", "Improve My Score", "What-if Scenario", "Model FAQ"]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const canSend = input.trim().length > 0 && !loading;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, open]);

  const submitQuestion = async (question) => {
    const prompt = question.trim();
    if (!prompt) return;

    setMessages((current) => [...current, { role: 'user', text: prompt }]);
    setInput('');
    setLoading(true);
    setTyping(true);
    setTimeout(scrollToBottom, 50);

    // Retrieve active student values from localStorage if available
    let features = {};
    try {
      const stored = localStorage.getItem('edupredict_current_features');
      if (stored) {
        features = JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to parse current features", e);
    }

    try {
      const result = await askFaq(prompt, features);
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: result.answer,
          suggestions: result.suggestions
        }
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: error instanceof Error ? error.message : 'I could not reach the FAQ service.',
          suggestions: ["Model FAQ", "Improve My Score", "What-if Scenario"]
        }
      ]);
    } finally {
      setLoading(false);
      setTyping(false);
    }
  };

  const lastMessage = messages[messages.length - 1];
  const activeSuggestions = lastMessage && lastMessage.role === 'assistant' ? lastMessage.suggestions || [] : [];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <div className={`${open ? 'block animate-in fade-in slide-in-from-bottom-4 duration-300' : 'hidden'} w-80 glass-card rounded-2xl shadow-2xl mb-4 flex flex-col overflow-hidden border-2 border-primary/20`}>
        <div className="bg-primary p-4 flex items-center justify-between text-on-primary">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            <span className="font-bold">EduPredict Assistant</span>
          </div>
          <button className="hover:bg-white/20 p-1 rounded-full transition-colors" type="button" onClick={() => setOpen(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="h-72 p-4 overflow-y-auto space-y-3 bg-surface-container-low/50">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-sm whitespace-pre-wrap leading-relaxed ${
                  message.role === 'user'
                    ? 'bg-primary-container text-on-primary-container rounded-tr-none'
                    : 'bg-white dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface rounded-tl-none border border-outline-variant/10'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {typing ? (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-tl-none bg-white dark:bg-inverse-surface p-3 text-xs shadow-sm text-on-surface dark:text-inverse-on-surface flex items-center gap-2 border border-outline-variant/10">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Thinking...
              </div>
            </div>
          ) : null}
          <div ref={messagesEndRef} />
        </div>

        <SuggestionChips
          suggestions={activeSuggestions}
          onSend={(item) => submitQuestion(item)}
          onInsert={(item) => {
            setInput(item);
            setTimeout(() => {
              inputRef.current?.focus();
            }, 50);
          }}
          disabled={loading}
        />

        <div className="p-3 border-t border-outline-variant/30 flex gap-2">
          <input
            ref={inputRef}
            className="flex-1 bg-surface-container border-none rounded-xl text-xs px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
            placeholder="Ask assistant or test what-if..."
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && canSend) {
                submitQuestion(input);
              }
            }}
          />
          <button
            type="button"
            className="bg-primary text-white p-2 rounded-xl disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
            disabled={!canSend}
            onClick={() => submitQuestion(input)}
          >
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </div>
      </div>

      <button
        type="button"
        className="w-14 h-14 bg-primary text-on-primary rounded-full shadow-[0_0_20px_rgba(53,37,205,0.5)] flex items-center justify-center hover:scale-110 transition-transform active:scale-95 relative"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full border-2 border-white" />
      </button>
    </div>
  );
}
