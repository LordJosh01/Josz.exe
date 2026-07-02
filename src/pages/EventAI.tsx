import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Trash2, Lightbulb, Calendar, Users, MapPin, Clock, Heart, Camera, Music, Gift, Crown, Utensils, Palette, RefreshCw, Save } from 'lucide-react';
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
  { icon: Calendar, title: 'Book Early', desc: 'Book your venue 6-12 months ahead for weddings' },
  { icon: Users, title: 'Guest List', desc: 'Create your guest list early and group by priority' },
  { icon: MapPin, title: 'Venue Selection', desc: 'Consider accessibility and parking for guests' },
  { icon: Palette, title: 'Color Theme', desc: 'Choose 2-3 main colors for a cohesive look' },
  { icon: Heart, title: 'Stay Present', desc: 'Hire a coordinator to enjoy your celebration' },
];

const suggestedQuestions = [
  'What are the key elements of a successful wedding?',
  'How do I plan a birthday party on a budget?',
  'What should I consider when choosing a venue?',
  'How far in advance should I book vendors?',
];

const initialMessage: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `Hello! I'm BELSH Event AI, your intelligent planning assistant.

I can help you with:
* Planning weddings, birthdays, corporate events & more
* Venue selection advice for Kwara State
* Budget planning and vendor scheduling
* Creating event timelines
* Decoration and theme ideas

How may I help you today?`,
  timestamp: new Date(),
};

export default function EventAI({ onNavigate }: EventAIProps) {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedConversations, setSavedConversations] = useState<Message[][]>([]);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('belsh_ai_conversations');
    if (saved) setSavedConversations(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const saveConversation = () => {
    if (messages.length > 1) {
      const newSaved = [...savedConversations, messages];
      setSavedConversations(newSaved);
      localStorage.setItem('belsh_ai_conversations', JSON.stringify(newSaved));
    }
  };

  const loadConversation = (conv: Message[]) => setMessages(conv);

  const deleteSavedConversation = (index: number) => {
    const newSaved = savedConversations.filter((_, i) => i !== index);
    setSavedConversations(newSaved);
    localStorage.setItem('belsh_ai_conversations', JSON.stringify(newSaved));
  };

  const clearCurrentChat = () => {
    setMessages([initialMessage]);
    setConversationContext([]);
  };

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    const context = [...conversationContext, lowerInput].slice(-5);
    setConversationContext(context);

    // Greetings
    if (lowerInput.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
      return `Hello! Great to meet you!

I'm here to help you plan your perfect event. To give you the best advice, could you tell me:

1. What type of event are you planning? (wedding, birthday, corporate, etc.)
2. When is it happening?
3. How many guests are you expecting?

Once I know these details, I can give you personalized recommendations!`;
    }

    // Budget related
    if (lowerInput.includes('budget') || lowerInput.includes('cost') || lowerInput.includes('price') || lowerInput.includes('how much')) {
      return `Great question about budgeting! Here's a typical cost breakdown for events in Kwara State:

**Wedding Budget Ranges**
- Intimate (50 guests): N500,000 - N1,000,000
- Standard (100-200 guests): N1,500,000 - N4,000,000
- Grand (300+ guests): N5,000,000+

**Typical Budget Allocation**
- Venue: 20-25%
- Catering: 30-35%
- Decoration: 15-20%
- Photography/Video: 10%
- Entertainment: 8-10%
- Outfits: 10-15%
- Miscellaneous: 5%

What's your approximate budget range? I can suggest how to allocate it best!`;
    }

    // Decor/Theme
    if (lowerInput.includes('decor') || lowerInput.includes('decoration') || lowerInput.includes('theme') || lowerInput.includes('color')) {
      return `Excellent! Decoration sets the mood for your entire event.

**Popular Color Schemes in Kwara**
- Gold & White (Classic, elegant)
- Purple & Gold (Royal feel)
- Navy Blue & Silver (Modern)
- Coral & Peach (Romantic)

**Theme Ideas**
1. Garden Romance: Florals, fairy lights, pastels
2. Royal Affair: Deep colors, gold accents
3. Modern Minimal: Clean lines, statement pieces
4. Traditional Nigerian: Ankara patterns, cultural elements

Which color scheme resonates with you?`;
    }

    // Food/Catering
    if (lowerInput.includes('food') || lowerInput.includes('cater') || lowerInput.includes('menu') || lowerInput.includes('meal')) {
      return `Food is one of the most memorable parts of any event!

**Popular Menu Options**
1. Traditional: Jollof rice, fried rice, moin moin, assorted meats
2. Continental: Pasta bar, salad station, grilled proteins
3. Hybrid: Mix of both for diverse guests

**Planning Tips**
- Plan 1.2 servings per person for main dishes
- Include vegetarian options (10-15% of guests)
- Consider cultural preferences

What type of cuisine are you considering?`;
    }

    // Vendors
    if (lowerInput.includes('vendor') || lowerInput.includes('photographer') || lowerInput.includes('dj') || lowerInput.includes('mc')) {
      return `Here's guidance on booking vendors in Kwara:

**Booking Timeline**
- Photographer: 6-9 months ahead
- Videographer: 6-9 months ahead
- DJ/Band: 4-6 months ahead
- MC: 3-4 months ahead
- Florist/Decorator: 3-4 months ahead

**Questions to Ask**
1. What's included in your package?
2. How many hours of coverage?
3. Do you bring backup equipment?
4. Can I see your portfolio?

**Red Flags to Avoid**
- No contract or written agreement
- Demanding full payment upfront
- No portfolio or references

What type of vendor are you looking for?`;
    }

    // Outfit/Attire
    if (lowerInput.includes('outfit') || lowerInput.includes('dress') || lowerInput.includes('attire') || lowerInput.includes('aso ebi')) {
      return `Looking your best is essential!

**Traditional Options**
- Aso Ebi: Coordinate colors with guests
- Agbada: Grand for grooms
- Iro & Buba: Classic for brides
- Ankara: Vibrant, customizable

**Planning Tips**
- Order Aso Ebi 2-3 months ahead
- Schedule fittings 3 weeks before event
- Consider venue weather (AC/outdoor)

What style are you considering? Traditional, modern, or a mix?`;
    }

    // Guest list
    if (lowerInput.includes('guest') || lowerInput.includes('invite') || lowerInput.includes('attend')) {
      return `Guest list management is crucial!

**Guest List Strategy**
1. Start with must-have guests (family, close friends)
2. Add would like to have (extended family, colleagues)
3. Create a B-list for overflow spots

**Venue Capacity Guide**
- 50 guests: Small hall, restaurant private room
- 100-150: Medium hall, outdoor garden
- 200-300: Large hall, hotel ballroom
- 300+: Event center, open field

**Invitation Timeline**
- Save-the-dates: 3-4 months ahead
- Formal invites: 6-8 weeks ahead
- RSVP deadline: 2-3 weeks before event

How many guests are you thinking?`;
    }

    // Wedding
    if (lowerInput.includes('wedding')) {
      return `How exciting - a wedding! Let's make it unforgettable.

**Planning Checklist**
12 months: Set date, budget, guest count
10 months: Book venue, photographer, caterer
8 months: Choose attire, book DJ/band
6 months: Send save-the-dates, book florist
4 months: Order cake, finalize menu
2 months: Final fitting, confirm vendors
1 month: Final headcount, seating chart

**Key Questions**
1. Traditional + White wedding, or just one?
2. Indoor or outdoor preference?
3. Small/intimate or grand celebration?

What stage of planning are you at?`;
    }

    // Birthday
    if (lowerInput.includes('birthday')) {
      return `Birthday celebrations should be fun and memorable!

**Birthday Types & Ideas**
- Kids (1-10): Bounce house, games, character themes
- Teens (11-17): Gaming stations, photo booth
- Young Adults (18-30): Party vibe, DJ, Instagram moments
- Milestone (40/50/60+): Elegant dinner, memory lane

**Budget-Friendly Ideas**
- Host at home or public park
- Potluck food sharing
- Digital invitations (free!)
- DIY decorations

What age group are we celebrating?`;
    }

    // Timeline
    if (lowerInput.includes('timeline') || lowerInput.includes('schedule') || lowerInput.includes('program')) {
      return `A good timeline keeps everything running smoothly!

**Wedding Day Timeline (5 hours)**
12:00 PM - Vendor arrivals
1:00 PM - Bridal party photos
2:00 PM - Guest arrival
2:30 PM - Ceremony
3:00 PM - Cocktail hour
4:00 PM - Reception entrance
4:15 PM - First dance
4:30 PM - Dinner
5:30 PM - Toasts & cake
6:00 PM - Dancing
8:00 PM - Last dance & departure

**Tips**
- Add 15 min buffer between activities
- Have a designated timekeeper
- Share timeline with all vendors

Would you like me to customize a timeline for your event?`;
    }

    // Venue
    if (lowerInput.includes('venue') || lowerInput.includes('location') || lowerInput.includes('place') || lowerInput.includes('hall')) {
      return `Venue selection is critical! Here's guidance for Kwara State:

**Venue Types**
1. Hotel Ballrooms: All-inclusive, AC, parking
2. Event Centers: Large capacity, flexible
3. Outdoor Gardens: Beautiful, weather-dependent
4. Church Halls: Budget-friendly
5. Restaurants: Private rooms for intimate events

**What to Ask**
- Maximum capacity?
- What's included? (tables, chairs, linens?)
- Power backup?
- Parking capacity?
- Catering restrictions?

**Quick Size Guide**
- 50 guests: Small hall or restaurant
- 100 guests: Medium hall
- 200+ guests: Large hall or event center

What type of venue are you considering?`;
    }

    // Thanks
    if (lowerInput.includes('thank') || lowerInput.includes('thanks') || lowerInput.includes('helpful')) {
      return `You're welcome! I'm glad I could help.

Is there anything else you'd like to know about:
- Specific vendor recommendations
- Budget planning
- Timeline creation
- Theme/decoration ideas
- Guest list management

I'm here to guide you through every step!

Remember: BELSH Events offers full planning services. Would you like to book a consultation?`;
    }

    // Contact/booking
    if (lowerInput.includes('book') || lowerInput.includes('consultation') || lowerInput.includes('contact') || lowerInput.includes('service')) {
      return `I'd love to connect you with the BELSH Events team!

**Ways to Reach Us**
- WhatsApp: +234 803 567 2491
- Instagram: @events_by_belsh
- Email: aolagbaye@gmail.com

**What to Expect**
- Free 30-minute consultation
- Personalized planning advice
- Transparent pricing
- No pressure, just guidance

Would you like help preparing questions for your consultation?`;
    }

    // Default response
    return `That's an interesting question! Let me help you think through this.

**Based on your question, here are considerations:**

1. Event Type Matters: Different events need different approaches
2. Budget is Key: Everything flows from your budget
3. Location: In Kwara State, Ilorin has the most venues

**To give you the best advice, please tell me:**
- What type of event are you planning?
- How many guests are you expecting?
- Do you have a date in mind?

I can give you a detailed plan once I know these details!`;
  };

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 800));

    const responseContent = generateAIResponse(input);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setLoading(false);
  };

  const navigate = (page: Page) => onNavigate(page);

  return (
    <div>
      {/* Hero */}
      <section className="page-hero text-center relative overflow-hidden min-h-[45vh]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(147,51,234,0.4)_0%,transparent_70%)]" />
        <FloatingDots color="purple" count={25} size="md" />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <div className="relative w-[350px] h-[350px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[300px] h-[300px] border border-purple-500/20 rounded-full animate-spin-slow" style={{ animationDuration: '30s' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[200px] h-[200px] border border-gold-500/20 rounded-full animate-spin-slow" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
          <div className="relative inline-flex items-center justify-center mb-4 animate-float">
            <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl scale-150" />
            <div className="relative bg-purple-600/50 w-14 h-14 rounded-full flex items-center justify-center border border-gold-500/30">
              <Sparkles size={24} className="text-gold-400" />
            </div>
          </div>
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-3">AI-Powered Planning</p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-purple-100 mb-3">
            Event <span className="italic gold-text">AI</span>
          </h1>
          <div className="section-divider" />
          <p className="text-purple-300/80 text-sm max-w-xl mx-auto mt-3">
            Your intelligent event planning assistant for personalized tips and advice.
          </p>
        </div>
      </section>

      {/* Chat Section */}
      <section className="py-8 md:py-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-purple-100 text-sm font-medium">Saved Chats</h3>
                  {messages.length > 1 && (
                    <button onClick={saveConversation} className="text-gold-400 hover:text-gold-300 transition-colors text-xs flex items-center gap-1">
                      <Save size={12} />
                      Save
                    </button>
                  )}
                </div>
                {savedConversations.length > 0 ? (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {savedConversations.map((conv, i) => (
                      <div key={i} className="glass-dark rounded-lg p-2 flex items-center justify-between group">
                        <button onClick={() => loadConversation(conv)} className="text-purple-300 text-xs truncate flex-1 text-left hover:text-gold-400 transition-colors">
                          {conv[1]?.content.substring(0, 25)}...
                        </button>
                        <button onClick={() => deleteSavedConversation(i)} className="text-purple-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-purple-500 text-xs">No saved chats yet</p>
                )}
                {messages.length > 1 && (
                  <button onClick={clearCurrentChat} className="w-full mt-3 text-xs text-purple-400 hover:text-red-400 transition-colors flex items-center justify-center gap-1">
                    <Trash2 size={12} />
                    New Chat
                  </button>
                )}
              </div>

              <div className="glass-card rounded-xl p-4">
                <div className="inline-flex items-center gap-2 text-gold-400 text-xs uppercase tracking-widest mb-3">
                  <Lightbulb size={12} />
                  Quick Tips
                </div>
                <div className="space-y-2">
                  {tips.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-2">
                      <Icon size={14} className="text-gold-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-purple-200 text-xs font-medium">{title}</p>
                        <p className="text-purple-400 text-[10px]">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-xl p-4">
                <h3 className="text-purple-100 text-xs font-medium mb-3">Try Asking</h3>
                <div className="space-y-2">
                  {suggestedQuestions.map((q) => (
                    <button key={q} onClick={() => setInput(q)} className="w-full text-[11px] text-purple-300 hover:text-gold-400 transition-colors text-left py-1 border-b border-dark-border/50 last:border-0">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3">
              <div className="glass-card gold-border rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-900/50 to-gold-900/20 p-3 border-b border-dark-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600/50 flex items-center justify-center">
                      <Sparkles size={16} className="text-gold-400" />
                    </div>
                    <div>
                      <p className="text-purple-100 text-sm font-medium">BELSH Event AI</p>
                      <p className="text-purple-400 text-[10px]">Your intelligent planning assistant</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div ref={chatRef} className="h-[420px] overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-full bg-purple-600/30 flex items-center justify-center mr-2 shrink-0">
                          <Sparkles size={12} className="text-gold-400" />
                        </div>
                      )}
                      <div className={`max-w-[85%] rounded-xl p-3 ${msg.role === 'user' ? 'bg-gold-500/20 border border-gold-500/30' : 'bg-purple-800/30 border border-purple-700/30'}`}>
                        <p className="text-purple-100 text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p className="text-purple-500 text-[10px] mt-2">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-7 h-7 rounded-full bg-gold-600/30 flex items-center justify-center ml-2 shrink-0">
                          <Users size={12} className="text-gold-400" />
                        </div>
                      )}
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="w-7 h-7 rounded-full bg-purple-600/30 flex items-center justify-center mr-2">
                        <Sparkles size={12} className="text-gold-400" />
                      </div>
                      <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30">
                        <div className="flex items-center gap-2">
                          <RefreshCw size={14} className="text-gold-400 animate-spin" />
                          <span className="text-purple-300 text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <form onSubmit={sendMessage} className="p-3 border-t border-dark-border">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your question here..."
                      className="flex-1 bg-dark-card border border-dark-border rounded-lg px-4 py-2.5 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
                    />
                    <button type="submit" disabled={loading || !input.trim()} className="btn-gold px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      <Send size={16} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 bg-purple-900/40 border-y border-dark-border text-center">
        <div className="max-w-xl mx-auto px-6">
          <Crown size={24} className="text-gold-400 mx-auto mb-3" />
          <h2 className="font-serif text-lg text-purple-100 mb-2">Ready to make it real?</h2>
          <p className="text-purple-300/80 text-sm mb-4">Let the BELSH Events team bring your vision to life.</p>
          <button onClick={() => { navigate('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn-gold text-sm">
            Book a Free Consultation
          </button>
        </div>
      </section>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 30s linear infinite; }
      `}</style>
    </div>
  );
}
