import { useState, useRef, useEffect } from 'react';
import {
  Home as HomeIcon,
  LayoutGrid,
  Compass,
  Clock,
  Wallet,
  MoreHorizontal,
  ChevronDown,
  Paperclip,
  Globe,
  Mic,
  Send,
  Users,
  Menu,
  X,
} from 'lucide-react';
import { useLocation } from 'wouter';
import ParticleBackground from '../components/ParticleBackground';
import AethericLogo from '../components/AethericLogo';

// --- Holographic Sphere Component ---
const HolographicSphere = () => {
  return (
    <div className="relative">
      {/* Outer white blinking glow */}
      <div className="absolute inset-0 rounded-full animate-sphere-glow"
        style={{
          boxShadow: '0 0 40px rgba(255,255,255,0.3), 0 0 80px rgba(255,255,255,0.15)',
        }}
      />
      <div className="absolute inset-0 rounded-full blur-3xl opacity-60 scale-110"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
        }}
      />
      <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border border-white/20 animate-sphere-border"
        style={{
          boxShadow: '0 0 60px rgba(255,255,255,0.3), inset 0 0 40px rgba(255,255,255,0.2)',
        }}
      >
        <div className="absolute inset-0"
          style={{
            background: 'linear-gradient(160deg, #e8f4ff 0%, #ffe8f0 30%, #f0e8ff 60%, #e0f8ff 100%)',
          }}
        />
        <div className="absolute inset-0 opacity-90">
          <div className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2 animate-flow-slow"
            style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(255,150,220,0.8) 0%, rgba(200,150,255,0.5) 25%, transparent 50%)', filter: 'blur(20px)' }}
          />
          <div className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2 animate-flow-medium"
            style={{ background: 'radial-gradient(ellipse at 70% 60%, rgba(100,220,255,0.7) 0%, rgba(150,200,255,0.4) 30%, transparent 55%)', filter: 'blur(25px)' }}
          />
          <div className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2 animate-flow-fast"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.9) 0%, rgba(240,250,255,0.5) 20%, transparent 45%)', filter: 'blur(15px)' }}
          />
        </div>
        <div className="absolute top-[15%] left-[20%] w-[30%] h-[20%] rounded-full"
          style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 40%, transparent 70%)', filter: 'blur(8px)' }}
        />
      </div>
      <style>{`
        @keyframes flow-slow { 0%, 100% { transform: translate(-10%, -5%) rotate(0deg) scale(1); } 50% { transform: translate(10%, 5%) rotate(5deg) scale(1.05); } }
        @keyframes flow-medium { 0%, 100% { transform: translate(5%, 5%) rotate(0deg) scale(1); } 50% { transform: translate(-10%, -5%) rotate(-8deg) scale(1.08); } }
        @keyframes flow-fast { 0%, 100% { transform: translate(0%, 0%) rotate(0deg) scale(1); } 50% { transform: translate(-15%, 5%) rotate(10deg) scale(1.1); } }
        .animate-flow-slow { animation: flow-slow 8s ease-in-out infinite; }
        .animate-flow-medium { animation: flow-medium 6s ease-in-out infinite; }
        .animate-flow-fast { animation: flow-fast 4s ease-in-out infinite; }

        @keyframes sphere-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.03); }
        }
        .animate-sphere-glow { animation: sphere-glow 2.5s ease-in-out infinite; }

        @keyframes sphere-border {
          0%, 100% { border-color: rgba(255,255,255,0.15); box-shadow: 0 0 30px rgba(255,255,255,0.15), inset 0 0 30px rgba(255,255,255,0.1); }
          50% { border-color: rgba(255,255,255,0.5); box-shadow: 0 0 60px rgba(255,255,255,0.4), inset 0 0 40px rgba(255,255,255,0.2); }
        }
        .animate-sphere-border { animation: sphere-border 2.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

// --- Main Dashboard Component ---
const AethericDashboard = () => {
  const [, setLocation] = useLocation();
  const [activeNav, setActiveNav] = useState('Home');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // --- Voice Input (Web Speech API) ---
  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Voice input not supported in this browser. Use Chrome or Edge.'); return; }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Hindi + English mixed
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join('');
      setMessageInput(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text?: string) => {
    const userMsg = (text || messageInput).trim();
    if (!userMsg || isLoading) return;
    setMessageInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, sessionId })
      });
      const data = await res.json();
      if (data.sessionId) setSessionId(data.sessionId);
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't connect to my AI core. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Direct Web Search (bypasses Mistral) ---
  const handleWebSearch = async (query: string) => {
    if (!query || isLoading) return;
    setMessageInput('');
    setMessages(prev => [...prev, { role: 'user', content: `🔍 Web Search: ${query}` }]);
    setIsLoading(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      if (data.success && data.results && data.results.length > 0) {
        const formatted = data.results.map((r: any) =>
          `**${r.title || ''}**\n${r.snippet || r.text || ''}${r.url ? `\n🔗 ${r.url}` : ''}`
        ).join('\n\n---\n\n');
        setMessages(prev => [...prev, { role: 'assistant', content: `🔍 Search results for "${query}":\n\n${formatted}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `"${query}" ke liye koi results nahi mile bhai. Kuch aur try kar! 🔍` }]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Search failed bhai, connection issue lag raha hai. Try again!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const navItems = [
    { name: 'Home', icon: HomeIcon },
    { name: 'Templates', icon: LayoutGrid },
    { name: 'Explore', icon: Compass },
    { name: 'History', icon: Clock },
    { name: 'Wallet', icon: Wallet },
  ];

  const recentChats = {
    'Today': ["Find me a plumber near...", "Order butter chicken from..."],
    'Yesterday': ["Book a ride to airport...", "Show nearby restaurants..."]
  };

  const featureCards = [
    { title: '🍕 Order Food', description: 'Search restaurants & order meals', prompt: 'I want to order food. Show me nearby restaurants.' },
    { title: '🚕 Book Rides', description: 'Get cabs, autos & bikes instantly', prompt: 'I need a ride. Show me available ride options.' },
    { title: '👷 Hire Workers', description: 'Find plumbers, electricians & more', prompt: 'I need to hire a worker. Show me available professionals.' },
    { title: '🌤️ Weather', description: 'Live weather for any city', prompt: 'Delhi ka aaj ka mausam bata do' },
    { title: '🔍 Web Search', description: 'Search anything on the internet', prompt: 'Search the web for latest AI news' },
    { title: '📚 Wikipedia', description: 'Look up facts, people & places', prompt: 'Tell me about Elon Musk from Wikipedia' },
  ];

  // --- Sidebar Content (reused for both desktop & mobile) ---
  const SidebarContent = () => (
    <>
      <div className="px-5 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AethericLogo className="w-9 h-9" />
          <span className="text-xl font-semibold tracking-tight">Aetherix</span>
        </div>
        {/* Close button on mobile */}
        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="px-3 mb-4">
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => { setActiveNav(item.name); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeNav === item.name ? 'bg-[#1a1a1a] text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-[#151515]'
                  }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Become a Worker Button */}
      <div className="px-3 mb-4">
        <button
          onClick={() => { setLocation('/become-worker'); setSidebarOpen(false); }}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 border border-white/15 text-sm font-medium text-white/70 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all"
        >
          <Users className="w-4 h-4" />
          <span>Become a Worker</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2">
        {Object.entries(recentChats).map(([date, chats]) => (
          <div key={date} className="mb-5">
            <h4 className="text-xs font-medium text-gray-500 mb-2">{date}</h4>
            <ul className="space-y-0.5">
              {chats.map((chat, i) => (
                <li key={i} className="text-sm text-gray-400 hover:text-gray-200 cursor-pointer truncate py-1 px-1">{chat}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-xs font-bold text-white border border-white/20">AI</div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Aetherix User</span>
            <span className="text-xs text-gray-500">Free Plan</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-white font-sans overflow-hidden">
      {/* Custom Scrollbar Styles */}
      <style>{`
        .chat-scroll::-webkit-scrollbar { width: 8px; }
        .chat-scroll::-webkit-scrollbar-track { background: #0a0a0a; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
        .chat-scroll::-webkit-scrollbar-thumb:hover { background: #3a3a3a; }
        * { scrollbar-width: thin; scrollbar-color: #2a2a2a #0a0a0a; }

        /* ✨ AI Reply Glow Effect — remove this block to disable */
        @keyframes ai-glow {
          0%, 100% { box-shadow: 0 0 4px rgba(255,255,255,0.15), 0 0 10px rgba(255,255,255,0.05); border-color: #2a2a2a; }
          50% { box-shadow: 0 0 12px rgba(255,255,255,0.4), 0 0 25px rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.3); }
        }
        .ai-reply-glow {
          animation: ai-glow 2.5s ease-in-out infinite;
        }

        /* ✨ Subtle border breathing for chat elements */
        @keyframes border-breathe {
          0%, 100% { border-color: #2a2a2a; }
          50% { border-color: rgba(255,255,255,0.2); }
        }
        .border-breathe {
          animation: border-breathe 3s ease-in-out infinite;
        }
      `}</style>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar — Desktop: always visible, Mobile: slide-in overlay */}
      <aside className={`
        fixed md:static z-50 h-full w-64 bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col flex-shrink-0
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <ParticleBackground />
        <header className="flex items-center justify-between px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 hover:text-white hover:border-white/20 transition-all">
              <Menu className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm font-medium text-gray-300">
              <AethericLogo className="w-5 h-5 flex-shrink-0" />
              <span>Aetherix AI</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <button className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:text-white transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 pb-6 overflow-y-auto chat-scroll">
          {messages.length === 0 ? (
            <>
              <div className="mb-12">
                <HolographicSphere />
              </div>
              <div className="text-center mb-10">
                <h1 className="text-3xl font-medium text-white mb-2">Welcome to Aetherix AI</h1>
                <p className="text-xl font-normal text-gray-400">How can I help you today?</p>
              </div>
            </>
          ) : (
            <div className="w-full max-w-3xl flex-1 overflow-y-auto mb-4 space-y-4 pt-4 flex flex-col chat-scroll">
              {messages.map((m, i) => (
                <div key={i} className={`p-4 rounded-2xl max-w-[85%] whitespace-pre-wrap ${m.role === 'user' ? 'bg-[#2a2a2a] text-white self-end border border-[#3a3a3a] border-breathe' : 'bg-transparent border border-[#2a2a2a] text-gray-300 self-start leading-relaxed ai-reply-glow'}`}>
                  {m.content}
                </div>
              ))}
              {isLoading && <div className="text-gray-500 self-start p-4 animate-pulse">Aetherix is thinking...</div>}
              <div ref={chatEndRef} />
            </div>
          )}

          {/* Input Box */}
          <div className="w-full max-w-3xl mb-4">
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-4 border-breathe">
              <div className="flex items-start gap-3 mb-4">
                <Paperclip className="w-5 h-5 text-gray-500 mt-2 cursor-pointer hover:text-white transition-colors" />
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask me to order food, book rides, or find workers..."
                  className="flex-1 bg-transparent text-white outline-none resize-none py-2 placeholder:text-gray-600"
                  rows={1}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const q = messageInput.trim();
                      if (q) {
                        handleWebSearch(q);
                      } else {
                        setMessageInput('');
                      }
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-xs text-gray-400 hover:text-white hover:border-white/30 transition-colors active:scale-95"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Search Web</span>
                  </button>
                </div>
                <div className="flex gap-3 items-center">
                  <button onClick={toggleVoice} className={`p-1 rounded-md transition-all ${isListening ? 'text-white animate-pulse bg-white/10' : 'text-gray-500 hover:text-white'}`}>
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSend()}
                    disabled={!messageInput.trim() || isLoading}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white hover:bg-white/80 text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards — clickable instant prompts */}
          {messages.length === 0 && (
            <div className="w-full max-w-3xl grid grid-cols-2 md:grid-cols-3 gap-3">
              {featureCards.map((card, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(card.prompt)}
                  className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer hover:scale-[1.02] text-left border-breathe"
                >
                  <h3 className="text-sm font-medium text-gray-200 mb-1">{card.title}</h3>
                  <p className="text-xs text-gray-500">{card.description}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default function Home() {
  return <AethericDashboard />;
}
