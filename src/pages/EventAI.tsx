import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Trash2, Plus, Lightbulb, Calendar, Users, MapPin, Clock, Heart, Star, Camera, Music, Gift, Crown, Utensils, Palette, MessageCircle, RefreshCw, Save } from 'lucide-react';
import FloatingDots from '../components/FloatingDots';

type Page = 'home' | 'services' | 'portfolio' | 'about' | 'faq' | 'contact' | 'premium' | 'eventai';

interface EventAIProps {
  onNavigate: (page: Page) => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const tips = [
  {
    icon: Calendar,
    title: 'Book Early',
    desc: 'Book your venue 6-12 months ahead for weddings, 3-6 months for large events',
  },
  {
    icon: Users,
    title: 'Guest List Strategy',
    desc: 'Create your guest list early and group by priority to manage invites effectively',
  },
  {
    icon: MapPin,
    title: 'Venue Selection',
    desc: 'Consider accessibility, parking, and proximity to guests when choosing a venue',
  },
  {
    icon: Palette,
    title: 'Color Coordination',
    desc: 'Choose 2-3 main colors and stick to them for a cohesive look',
  },
  {
    icon: Clock,
    title: 'Timeline Planning',
    desc: 'Create a detailed timeline for your event day with buffer time between activities',
  },
  {
    icon: Gift,
    title: 'Party Favors',
    desc: 'Personalized party favors create lasting memories for your guests',
  },
  {
    icon: Camera,
    title: 'Photo Moments',
    desc: 'Plan specific photo opportunities and share a shot list with your photographer',
  },
  {
    icon: Music,
    title: 'Music Matters',
    desc: 'Create different playlists for different parts of your event',
  },
  {
    icon: Utensils,
    title: 'Food Planning',
    desc: 'Always account for dietary restrictions and include vegetarian options',
  },
  {
    icon: Heart,
    title: 'Stay Present',
    desc: 'Hire a coordinator so you can enjoy your own celebration',
  },
];

const suggestedQuestions = [
  'What are the key elements of a successful wedding?',
  'How do I plan a birthday party on a budget?',
  'What should I consider when choosing a venue?',
  'How far in advance should I book vendors?',
  'What is a typical event timeline?',
  'How do I manage my guest list effectively?',
];

export default function EventAI({ onNavigate }: EventAIProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedConversations, setSavedConversations] = useState<Message[][]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('belsh_ai_conversations');
    if (saved) {
      setSavedConversations(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveConversation = () => {
    if (messages.length > 0) {
      const newSaved = [...savedConversations, messages];
      setSavedConversations(newSaved);
      localStorage.setItem('belsh_ai_conversations', JSON.stringify(newSaved));
    }
  };

  const loadConversation = (conv: Message[]) => {
    setMessages(conv);
  };

  const deleteSavedConversation = (index: number) => {
    const newSaved = savedConversations.filter((_, i) => i !== index);
    setSavedConversations(newSaved);
    localStorage.setItem('belsh_ai_conversations', JSON.stringify(newSaved));
  };

  const clearCurrentChat = () => {
    setMessages([]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response with event planning tips
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const responses: Record<string, string> = {
      wedding: `For a successful wedding, focus on these key elements:

**Planning Phase (6-12 months before)**
1. Set your budget and stick to it
2. Create your guest list (A-list and B-list)
3. Book your venue and major vendors early
4. Choose your color scheme and theme

**Key Vendors to Book**
- Venue (12+ months ahead)
- Photographer (9+ months ahead)
- Caterer (6+ months ahead)
- DJ/Band (6+ months ahead)
- Florist (4-6 months ahead)

**Day-Of Tips**
- Create a detailed timeline
- Assign a trusted person to handle vendor questions
- Eat breakfast and stay hydrated
- Take moments to soak it all in!

Would you like more specific advice about any aspect?`,

      birthday: `Planning a memorable birthday on a budget? Here's how:

**Budget-Friendly Ideas**
1. **Timing**: Host during off-peak hours (afternoon vs evening)
2. **Venue**: Use your home, a park, or community center
3. **Food**: Potluck style or DIY food stations
4. **Decor**: Focus on one statement piece + balloons
5. **Entertainment**: Playlist + simple games or activities

**Cost Breakdown Example (N200,000 budget)**
- Decor & Balloons: N50,000
- Food & Cake: N80,000
- Photography: N40,000
- Miscellaneous: N30,000

**Pro Tips**
- Digital invitations save money
- Create Instagram-worthy photo corners
- Focus on the cake as the centerpiece

What type of birthday are you planning?`,

      venue: `When choosing a venue, consider these factors:

**Practical Considerations**
1. **Capacity**: Can it comfortably hold your guests?
2. **Location**: Is it accessible for your guests?
3. **Parking**: Adequate parking available?
4. **Weather backup**: Indoor/outdoor options?
5. **Accessibility**: Wheelchair accessible if needed?

**Vendor-Friendly Features**
- Adequate power supply
- Kitchen/prep area for caterers
- Loading area for equipment
- Tables and chairs included?

**In Kwara State, popular venue types include:**
- Hotel ballrooms (Ilorin)
- Outdoor gardens
- Church halls
- Community centers

**Questions to Ask**
- What's included in the rental fee?
- Are there noise restrictions?
- What's the cancellation policy?
- Is there in-house catering required?

Need help narrowing down options?`,

      timeline: `Here's a typical event timeline for a 5-hour celebration:

**Sample Wedding Day Timeline**

• 12:00 PM - Vendor arrivals & setup
• 1:00 PM - Bridal party photos
• 2:00 PM - Guest arrival begins
• 2:30 PM - Ceremony
• 3:00 PM - Cocktail hour & photos
• 4:00 PM - Reception entrance
• 4:15 PM - First dance
• 4:30 PM - Dinner service
• 5:30 PM - Toasts & cake cutting
• 6:00 PM - Open dancing
• 8:00 PM - Last dance & departure

**Buffer Time Tips**
- Add 30 min buffer between major activities
- Vendors need setup time before guests arrive
- Always have a Plan B for delays

Would you like a customized timeline for your specific event?`,

      default: `That's a great question! Here's some helpful advice for event planning:

**General Planning Tips**
1. Start early - 6+ months for major events
2. Create a realistic budget with 10% contingency
3. Book key vendors early
4. Have clear communication with all vendors
5. Create a detailed timeline

**Common Mistakes to Avoid**
- Not having a rain plan
- Underestimating guest count
- Not accounting for setup/cleanup time
- Forgetting vendor meals
- No designated person to handle issues

**Quick Checklist**
• Set date & budget
• Create guest list
• Book venue
• Book photographer
• Book caterer
• Send invitations (6-8 weeks ahead)
• Finalize details (2 weeks ahead)

What specific aspect would you like to explore further?`,
    };

    let responseContent = responses.default;

    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('wedding')) responseContent = responses.wedding;
    else if (lowerInput.includes('birthday')) responseContent = responses.birthday;
    else if (lowerInput.includes('venue')) responseContent = responses.venue;
    else if (lowerInput.includes('timeline') || lowerInput.includes('schedule')) responseContent = responses.timeline;

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setLoading(false);
  };

  const navigate = (page: Page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero */}
      <section className="page-hero text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(147,51,234,0.4)_0%,transparent_70%)]" />
        <FloatingDots color="purple" count={50} size="lg" />

        {/* AI Animation */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-[600px] h-[600px]">
            {/* Animated rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[500px] h-[500px] border border-purple-500/20 rounded-full animate-spin-slow" style={{ animationDuration: '30s' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[400px] h-[400px] border border-gold-500/20 rounded-full animate-spin-slow" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[300px] h-[300px] border border-purple-400/20 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }} />
            </div>

            {/* Central glowing orb */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
                <div className="relative bg-gradient-to-br from-purple-600 to-purple-900 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-pulse">
                  <Sparkles size={40} className="text-gold-400 animate-icon-pulse" />
                </div>
              </div>
            </div>

            {/* Floating particles */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gold-400/40 rounded-full animate-float"
                style={{
                  left: `${50 + 45 * Math.cos((i * 30 * Math.PI) / 180)}%`,
                  top: `${50 + 45 * Math.sin((i * 30 * Math.PI) / 180)}%`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="relative inline-block mb-6 animate-float">
            <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl" />
            <Sparkles size={50} className="text-gold-400 relative" />
          </div>
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4 animate-fade-in-up">AI-Powered Planning</p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-purple-100 mb-4 animate-fade-in-up-2">
            Event <span className="italic gold-text">AI</span>
          </h1>
          <div className="section-divider" />
          <p className="text-purple-300/80 text-lg max-w-xl mx-auto mt-4 animate-fade-in-up-3">
            Your intelligent event planning assistant. Get tips, timelines, and personalized advice for your celebration.
          </p>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-purple-900/30 border-y border-dark-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-gold-400 text-xs uppercase tracking-widest mb-3">
              <Lightbulb size={14} />
              Quick Tips
            </div>
            <h2 className="font-serif text-2xl text-purple-100">Essential Event Planning Tips</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {tips.slice(0, 5).map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card rounded-xl p-4 hover:border-gold-500/40 transition-all hover:scale-[1.02]">
                <div className="w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center mb-3">
                  <Icon size={18} className="text-gold-400" />
                </div>
                <h3 className="text-purple-100 text-sm font-medium mb-1">{title}</h3>
                <p className="text-purple-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar - Saved Conversations */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-purple-100 text-sm font-medium">Saved Chats</h3>
                  {messages.length > 0 && (
                    <button onClick={saveConversation} className="text-gold-400 hover:text-gold-300 transition-colors text-xs flex items-center gap-1">
                      <Save size={12} />
                      Save
                    </button>
                  )}
                </div>

                {savedConversations.length > 0 ? (
                  <div className="space-y-2">
                    {savedConversations.map((conv, i) => (
                      <div key={i} className="glass-dark rounded-lg p-2 flex items-center justify-between group">
                        <button
                          onClick={() => loadConversation(conv)}
                          className="text-purple-300 text-xs truncate flex-1 text-left hover:text-gold-400 transition-colors"
                        >
                          {conv[0]?.content.substring(0, 30)}...
                        </button>
                        <button
                          onClick={() => deleteSavedConversation(i)}
                          className="text-purple-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-purple-500 text-xs">No saved conversations yet</p>
                )}

                {messages.length > 0 && (
                  <button
                    onClick={clearCurrentChat}
                    className="w-full mt-4 text-xs text-purple-400 hover:text-red-400 transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 size={12} />
                    Clear Chat
                  </button>
                )}
              </div>

              {/* Suggested Questions */}
              <div className="glass-card rounded-xl p-4 mt-4">
                <h3 className="text-purple-100 text-sm font-medium mb-3">Try Asking</h3>
                <div className="space-y-2">
                  {suggestedQuestions.slice(0, 4).map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="w-full text-xs text-purple-300 hover:text-gold-400 transition-colors text-left py-1"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3">
              <div className="glass-card gold-border rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-900/50 to-gold-900/20 p-4 border-b border-dark-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-600/50 flex items-center justify-center">
                      <Sparkles size={18} className="text-gold-400 animate-icon-pulse" />
                    </div>
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Event AI</p>
                      <p className="text-purple-400 text-xs">Ask me anything about event planning</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-purple-900/50 flex items-center justify-center mx-auto mb-4">
                        <MessageCircle size={28} className="text-purple-400" />
                      </div>
                      <p className="text-purple-300 text-sm mb-2">Start a conversation</p>
                      <p className="text-purple-500 text-xs">Ask about venues, timelines, budgets, vendors, and more</p>
                    </div>
                  )}

                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl p-3 ${
                          msg.role === 'user'
                            ? 'bg-gold-500/20 border border-gold-500/30'
                            : 'bg-purple-800/30 border border-purple-700/30'
                        }`}
                      >
                        <p className="text-purple-100 text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p className="text-purple-500 text-[10px] mt-2">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30">
                        <div className="flex items-center gap-2">
                          <RefreshCw size={14} className="text-gold-400 animate-spin" />
                          <span className="text-purple-300 text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-dark-border">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Ask about event planning..."
                      className="flex-1 bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={loading || !input.trim()}
                      className="btn-gold px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-purple-900/40 border-y border-dark-border text-center">
        <div className="max-w-xl mx-auto px-6">
          <Crown size={32} className="text-gold-400 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-purple-100 mb-3">Ready to make it real?</h2>
          <p className="text-purple-300/80 text-sm mb-6">
            Let our expert team bring your vision to life. Book a free consultation today.
          </p>
          <button onClick={() => navigate('contact')} className="btn-gold">
            Book a Consultation
          </button>
        </div>
      </section>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
