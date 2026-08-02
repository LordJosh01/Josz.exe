import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Trash2, Lightbulb, Calendar, Users, MapPin, Clock, Heart, Camera, Music, Gift, Crown, Utensils, Palette, RefreshCw, Save } from 'lucide-react';
import FloatingDots from '../components/FloatingDots';
import Confetti from '../components/Confetti';

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

interface EventContext {
  eventType: string | null;
  guestCount: number | null;
  budget: string | null;
  date: string | null;
  location: string | null;
  style: string | null;
  lastTopic: string | null;
  conversationHistory: string[];
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
  'Can you help me create an event timeline?',
  'What are the latest decoration trends?',
  'Tell me about traditional Nigerian weddings',
  'How much does a wedding cost in Kwara?',
];

const followUpSuggestions: Record<string, string[]> = {
  wedding: ['How do I choose a venue?', 'What\'s a realistic budget?', 'Help me with a timeline', 'Decoration ideas?'],
  birthday: ['Budget-friendly ideas?', 'Theme suggestions?', 'How many guests?', 'Entertainment options?'],
  corporate: ['Venue recommendations?', 'AV requirements?', 'Catering options?', 'How to manage RSVPs?'],
  budget: ['How to save on decor?', 'Vendor negotiation tips?', 'Cost per guest?', 'Hidden costs to avoid?'],
  venue: ['What questions should I ask?', 'Indoor vs outdoor?', 'Capacity for 200 guests?', 'Parking considerations?'],
  decor: ['Color scheme ideas?', 'Flower budget tips?', 'DIY decoration ideas?', 'Latest trends?'],
  vendor: ['Photographer checklist?', 'DJ vs live band?', 'When to book vendors?', 'Red flags to avoid?'],
  timeline: ['Wedding day timeline?', 'Birthday party schedule?', 'How early to start planning?', 'Day-of coordination?'],
  traditional: ['Yoruba traditions?', 'Igbo traditions?', 'Hausa traditions?', 'Item checklist?'],
  food: ['Menu suggestions?', 'Cost per guest?', 'Small chops options?', 'Dietary considerations?'],
  bridal: ['How many guests?', 'Theme ideas?', 'Games and activities?', 'Gift ideas?'],
  default: ['Tell me about venues', 'Help with budgeting', 'Decoration ideas', 'Vendor tips', 'Create a timeline'],
};

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
* Traditional Nigerian ceremonies

How may I help you today?`,
  timestamp: new Date(),
};

// Helper to extract numbers from text
const extractNumber = (text: string): number | null => {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0]) : null;
};

// Helper to detect event type
const detectEventType = (text: string): string | null => {
  const types: Record<string, string[]> = {
    wedding: ['wedding', 'marriage', 'nuptial', 'engagement party'],
    birthday: ['birthday', 'birthday party', 'celebration'],
    corporate: ['corporate', 'business', 'conference', 'seminar', 'meeting', 'annual general'],
    baby: ['baby shower', 'naming ceremony', 'child dedication', 'christening'],
    traditional: ['traditional wedding', 'engagement ceremony', 'dowry', 'bride price', ' lobola', 'native law'],
    burial: ['burial', 'funeral', 'memorial', 'wake', 'lying in state', 'interment'],
    bridal: ['bridal shower', 'bridal'],
  };
  for (const [type, keywords] of Object.entries(types)) {
    if (keywords.some(k => text.includes(k))) return type;
  }
  return null;
};

export default function EventAI({ onNavigate }: EventAIProps) {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedConversations, setSavedConversations] = useState<Message[][]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [eventContext, setEventContext] = useState<EventContext>({
    eventType: null,
    guestCount: null,
    budget: null,
    date: null,
    location: null,
    style: null,
    lastTopic: null,
    conversationHistory: [],
  });
  const [followUps, setFollowUps] = useState<string[]>(followUpSuggestions.default);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

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
    setEventContext({ eventType: null, guestCount: null, budget: null, date: null, location: null, style: null, lastTopic: null, conversationHistory: [] });
    setFollowUps(followUpSuggestions.default);
  };

  // Detect the topic category for follow-up suggestions
  const detectTopic = (text: string): string => {
    const t = text.toLowerCase();
    if (t.includes('wedding') || t.includes('marriage') || t.includes('bride') || t.includes('groom')) return 'wedding';
    if (t.includes('birthday') || t.includes('party')) return 'birthday';
    if (t.includes('corporate') || t.includes('conference') || t.includes('business')) return 'corporate';
    if (t.includes('budget') || t.includes('cost') || t.includes('price') || t.includes('how much') || t.includes('afford')) return 'budget';
    if (t.includes('venue') || t.includes('hall') || t.includes('location') || t.includes('place')) return 'venue';
    if (t.includes('decor') || t.includes('decoration') || t.includes('theme') || t.includes('color') || t.includes('style') || t.includes('design')) return 'decor';
    if (t.includes('vendor') || t.includes('photographer') || t.includes('dj') || t.includes('band') || t.includes('mc') || t.includes('makeup') || t.includes('florist')) return 'vendor';
    if (t.includes('timeline') || t.includes('schedule') || t.includes('program') || t.includes('itinerary')) return 'timeline';
    if (t.includes('traditional') || t.includes('yoruba') || t.includes('igbo') || t.includes('hausa') || t.includes('dowry') || t.includes('bride price')) return 'traditional';
    if (t.includes('bridal shower') || t.includes('bridal')) return 'bridal';
    if (t.includes('food') || t.includes('cater') || t.includes('menu') || t.includes('meal') || t.includes('jollof')) return 'food';
    return 'default';
  };

  // Extract date from text
  const extractDate = (text: string): string | null => {
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const lower = text.toLowerCase();
    for (const month of months) {
      if (lower.includes(month)) {
        const match = lower.match(new RegExp(`${month}\\s+\\d{1,2}`, 'i'));
        if (match) return match[0];
        return month;
      }
    }
    if (lower.match(/\bnext\s+(month|year|week)\b/)) return lower.match(/\bnext\s+(month|year|week)\b/)![0];
    if (lower.match(/\bin\s+\d+\s+(days|weeks|months)\b/)) return lower.match(/\bin\s+\d+\s+(days|weeks|months)\b/)![0];
    return null;
  };

  // Extract location from text
  const extractLocation = (text: string): string | null => {
    const locations = ['ilorin', 'kwara', 'lagos', 'abuja', 'ibadan', 'kano', 'port harcourt', 'nigeria'];
    const lower = text.toLowerCase();
    for (const loc of locations) {
      if (lower.includes(loc)) return loc;
    }
    return null;
  };

  // Extract style preference from text
  const extractStyle = (text: string): string | null => {
    const styles: Record<string, string[]> = {
      'classic elegant': ['classic', 'elegant', 'traditional'],
      'modern minimalist': ['modern', 'minimal', 'minimalist', 'contemporary'],
      'bohemian': ['boho', 'bohemian', 'rustic'],
      'luxury glam': ['luxury', 'glam', 'glamorous', 'lavish', 'grand'],
      'garden romance': ['garden', 'outdoor', 'romantic', 'floral'],
    };
    const lower = text.toLowerCase();
    for (const [style, keywords] of Object.entries(styles)) {
      if (keywords.some(kw => lower.includes(kw))) return style;
    }
    return null;
  };

  // Update context based on user input
  const updateContext = (text: string) => {
    const lowerText = text.toLowerCase();
    const eventType = detectEventType(lowerText);
    const guestCount = extractNumber(lowerText);
    const detectedTopic = detectTopic(text);

    let budget = eventContext.budget;
    if (lowerText.includes('million') || lowerText.includes('thousand') || lowerText.match(/n?\d+k/i) || lowerText.match(/n\d+/i)) {
      budget = text;
    }

    const date = extractDate(text);
    const location = extractLocation(text);
    const style = extractStyle(text);

    const newContext = {
      eventType: eventType || eventContext.eventType,
      guestCount: guestCount || eventContext.guestCount,
      budget: budget,
      date: date || eventContext.date,
      location: location || eventContext.location,
      style: style || eventContext.style,
      lastTopic: detectedTopic !== 'default' ? detectedTopic : eventContext.lastTopic,
      conversationHistory: [...eventContext.conversationHistory, text].slice(-8),
    };

    setEventContext(newContext);
    setFollowUps(followUpSuggestions[detectedTopic] || followUpSuggestions.default);
    return newContext;
  };

  // Build context summary for personalized responses
  const buildContextSummary = (ctx: EventContext): string => {
    const parts: string[] = [];
    if (ctx.eventType) parts.push(ctx.eventType);
    if (ctx.guestCount) parts.push(`${ctx.guestCount} guests`);
    if (ctx.date) parts.push(`around ${ctx.date}`);
    if (ctx.location) parts.push(`in ${ctx.location}`);
    if (ctx.style) parts.push(`${ctx.style} style`);
    if (ctx.budget) parts.push(`budget mentioned`);
    return parts.length > 0 ? parts.join(', ') : '';
  };

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    const ctx = updateContext(userInput);
    const guests = ctx.guestCount || 100;
    const contextSummary = buildContextSummary(ctx);

    // Non-event question detection - AI only answers event-related questions
    const eventKeywords = [
      'wedding', 'marriage', 'engagement', 'bride', 'groom', 'ceremony', 'nuptial',
      'birthday', 'party', 'celebration', 'anniversary', 'graduation',
      'corporate', 'conference', 'seminar', 'meeting', 'business event', 'annual general',
      'baby shower', 'naming', 'dedication', 'christening', 'child',
      'burial', 'funeral', 'memorial', 'wake', 'interment',
      'venue', 'hall', 'hotel', 'location', 'place', 'event center',
      'cater', 'food', 'menu', 'jollof', 'rice', 'meal', 'drink',
      'decor', 'decoration', 'theme', 'color', 'design', 'style', 'flower', 'floral',
      'vendor', 'photographer', 'videographer', 'dj', 'mc', 'band', 'makeup', 'florist',
      'budget', 'cost', 'price', 'how much', 'naira', 'million', 'thousand',
      'guest', 'invite', 'attend', 'people', 'capacity',
      'outfit', 'dress', 'attire', 'aso ebi', 'aso oke', 'agbada', 'gele', 'kaftan',
      'timeline', 'schedule', 'program', 'itinerary', 'run of show',
      'souvenir', 'favors', 'gift',
      'traditional', 'dowry', 'bride price', 'native', 'yoruba', 'igbo', 'hausa',
      'planner', 'planning', 'organize', 'event', 'organise',
      ' Kwara', 'ilorin', 'nigeria', 'nigerian',
      'help', 'advice', 'suggest', 'recommend', 'tip', 'idea', 'question',
      'what', 'how', 'when', 'where', 'which', 'can you', 'tell me',
      'lighting', 'sound', 'music', 'entertainment', 'cake', 'bakery',
      'rental', 'chair', 'table', 'tent', 'canopy',
      'weather', 'season', 'date',
    ];

    const isEventRelated = eventKeywords.some(keyword => lowerInput.includes(keyword));

    // Check for completely unrelated topics (math, science, geography, politics, sports, etc.)
    const unrelatedTopics = [
      'president', 'politics', 'election', 'government', 'war', 'country capital',
      'math', 'calculate', 'equation', 'formula', 'algebra', 'geometry',
      'science', 'chemistry', 'physics', 'biology', 'atom', 'molecule',
      'programming', 'code', 'javascript', 'python', 'computer', 'software',
      'sports', 'football', 'basketball', 'soccer', 'tennis', 'athlete',
      'movie', 'film', 'actor', 'actress', 'celebrity', 'music artist', 'song',
      'game', 'video game', 'play', 'gaming',
      'weather forecast', 'temperature', 'climate change',
      'what is the meaning of life', 'who are you', 'what are you',
      'recipe', 'cook', 'how to cook',
    ];

    const isUnrelated = unrelatedTopics.some(topic => lowerInput.includes(topic));

    if (isUnrelated || (!isEventRelated && !lowerInput.match(/^(hi|hello|hey|good|thank|please)/))) {
      return `I appreciate your question! However, I'm specifically designed to help with event planning and celebrations only.

Event planning questions I can answer:
**Weddings & Ceremonies**
- Traditional and white wedding planning
- Venue selection and booking
- Vendor recommendations (photographers, DJs, caterers)

**Other Celebrations**
- Birthday parties, baby showers, naming ceremonies
- Corporate events, conferences, private dinners

**Planning Topics**
- Budget breakdown and cost estimates
- Timelines and schedules
- Decoration and theme ideas
- Guest list management
- Vendor booking guidance

**Nigerian Traditions**
- Traditional engagement ceremonies
- Cultural requirements (Yoruba, Igbo, Hausa)
- Aso Ebi coordination

How can I help you plan your upcoming event?`;
    }

    // Greetings with deep context awareness
    if (lowerInput.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
      if (contextSummary) {
        return `Hello again! I remember we're discussing ${contextSummary}. What would you like to explore next?

I can help with:
- Budget breakdown tailored to your event
- Vendor recommendations
- Timeline creation
- Decoration ideas
- Traditional ceremony guidance`;
      }
      return `Hello! Great to meet you!

I'm here to help you plan your perfect event. To give you the best advice, could you tell me:

1. What type of event are you planning? (wedding, birthday, corporate, etc.)
2. When is it happening?
3. How many guests are you expecting?
4. Do you have a location or style in mind?

Once I know these details, I can give you personalized recommendations!`;
    }

    // Corporate events
    if (lowerInput.includes('corporate') || lowerInput.includes('business event') || lowerInput.includes('conference') || lowerInput.includes('seminar') || lowerInput.includes('annual general')) {
      return `Corporate events require professional execution! Here's a comprehensive guide:

**Corporate Event Types**
1. **Conferences**: Keynote speakers, breakout sessions, networking
2. **Product Launches**: Media coverage, live demos, VIP guests
3. **Annual General Meetings**: Formal, shareholder-focused
4. **Team Building**: Outdoor activities, workshops, retreats
5. **Award Ceremonies**: Gala dinner, employee recognition

**Planning Timeline**
- 6 months: Define objectives, budget, guest list
- 4 months: Book venue, speakers, caterers
- 2 months: AV setup, branding materials
- 1 month: Registration, final confirmations

**Budget Allocation for Corporate**
- Venue (25-30%): Includes AV, furniture
- Catering (20-25%): Coffee breaks, lunch, dinner
- Technology (15-20%): Sound, visuals, livestream
- Speakers/Entertainment (10-15%)
- Branding & Materials (10%)
- Contingency (5-10%)

What type of corporate event are you planning?`;
    }

    // Traditional/Native engagement
    if (lowerInput.includes('traditional') || lowerInput.includes('engagement ceremony') || lowerInput.includes('dowry') || lowerInput.includes('bride price') || lowerInput.includes('native law') || lowerInput.includes(' lobola')) {
      return `Traditional ceremonies are beautiful and culturally rich! Here's guidance for Nigerian traditional engagements:

**Major Nigerian Traditional Weddings**

**Yoruba Tradition**
1. Introduction (Mo mi mo o): Formal request to bride's family
2. Engagement (Idana): Date set, items presented
3. Items: Kola nuts, bitter kola, alligator pepper, honey, sugar, salt, tubers of yam, bags of rice, palm oil, drinks, clothes, jewelry

**Igbo Tradition**
1. Introduction (Iju Aju): Initial inquiry
2. Knocking (Iku Aka): Formal proposal
3. Bride price (Ime Ego): Negotiation with Umunna
4. Items: Kola nuts, palm wine, goat, rice, yam, clothes, jewelry

**Hausa/Fulani Tradition**
1. Gayar Aures: Introduction
2. Sadaki: Bride price payment
3. Kamun Aures: Wedding fatiha
4. Items: Money, jewelry, clothes, household items

**Typical Budget: N500,000 - N3,000,000**
(depending on family requirements)

Which culture's traditional wedding are you planning? I can give you a detailed item list!

**yoruba**: Yoruba Traditional Wedding Details:
The Yoruba engagement (Idana) is beautiful and symbolic. Required items typically include:
- 24 Kola nuts (Obi)
- Bitter kola (Orogbo)
- Alligator pepper (Ataare)
- Honey (Oyin) - for sweetness in marriage
- Sugar (Iyo) - for a sweet life
- Salt (Iyo) - wisdom in the home
- Dried fish (Eja) - prosperity
- Palm oil (Epo) - smooth life
- Tubers of yam (10-20 pieces)
- Bags of rice (2-5 bags)
- Crates of drinks (malt, soft drinks)
- Envelope with money (Owo Ori)
- Complete outfit for bride (Aso Oke, Gele, Iro/Buba, Shoes, Jewelry)
- Groom's outfit (Agbada, Fila, Shoes)
- Traveling bag for bride's belongings
- Engagement ring

Budget for Yoruba Engagement: N500,000 - N2,500,000

**igbo**: Igbo Traditional Wedding Details:
The Igbo wine carrying (Iju ALO) ceremony requires:
- Kola nuts (Oji) - essential for prayer
- Palm wine (Nkwu Enu) - bride carries to groom
- Goat (Ewu) - for sacrifice
- Bags of rice
- Tubers of yam
- Palm oil
- Salt
- Stock fish and dry fish
- Crates of drinks
- Money for bride price (Ime Ego) - negotiated with Umunna
- Bride's complete outfit (2-4 sets)
- Jewelry, shoes, handbags
- Engagement ring

Budget for Igbo Traditional: N600,000 - N3,000,000

**hausa**: Hausa Traditional Wedding Details:
The Hausa wedding (Fatiha) includes:
- Sadaki (Bride price) - amount set by bride's family
- Kayan Daki (Dowry) - furniture, kitchen items for bride
- Kayan Jana'iza - items for the wedding day
- Clothing for bride (multiple sets)
- Jewelry (gold)
- Shoes and accessories
- Perfumes
- Food items (rice, oil, spices)
- Mats and pillows
- Money gifts (Kudin Salanka)

Budget for Hausa Wedding: N700,000 - N5,000,000

Let me know your culture and I'll provide a detailed item checklist!`;
    }

    // Burial/Funeral/Memorial
    if (lowerInput.includes('burial') || lowerInput.includes('funeral') || lowerInput.includes('memorial') || lowerInput.includes('wake') || lowerInput.includes('interment')) {
      return `Burial and memorial services require sensitivity, dignity, and careful planning. Here's comprehensive guidance:

**Types of Burial Events**
1. **Wake/Service of Songs**: Evening before burial
2. **Funeral Service**: Church/mosque ceremony
3. **Interment**: Graveside ceremony
4. **Reception**: Gathering after burial

**Planning Timeline**
- **Immediately**: Notify family, secure death certificate
- **1-2 days**: Book venue, engage undertakers, inform church/mosque
- **3-5 days**: Order casket, flowers, program printing
- **1 day before**: Wake/service of songs preparation
- **Burial day**: Full coordination

**Key Service Providers**
- Undertakers/Mortuary: N100,000 - N500,000
- Casket: N80,000 - N800,000
- Venue (hall/church): N50,000 - N300,000
- Catering: N1,500 - N3,000 per guest
- Pallbearers: N20,000 - N50,000
- Program printing: N50 - N150 per copy
- Photographer: N50,000 - N200,000
- Flowers: N30,000 - N150,000

**Proper Guest Count Considerations**
- Family only: 50-100
- Community: 200-500
- Dignitary/High-profile: 500-2000

**Nigerian Burial Traditions**
- **Yoruba**: Service of songs, lying-in-state, church service, procession
- **Igbo**: Wake-keep, church service, burial at ancestral home
- **Hausa**: Janazah prayers, burial same day or next

**Budget Range: N500,000 - N10,000,000+**
(depending on scale and family status)

What type of burial service are you planning? I can help with specific cultural guidance.`;
    }

    // Naming ceremony/Child dedication
    if (lowerInput.includes('naming') || lowerInput.includes('dedication') || (lowerInput.includes('child') && lowerInput.includes('ceremony')) || lowerInput.includes('baby shower') || lowerInput.includes('christening')) {
      return `Congratulations on the little one! Naming ceremonies are joyous occasions:

**Naming Ceremony Guide (Yoruba Style)**
- Day: 8th day after birth
- Items symbolizing life virtues:
  - Water (purity)
  - Salt (wisdom)
  - Honey (sweet life)
  - Kola nut (long life)
  - Palm oil (smooth life)
  - Sugar (joy)
  - Dry fish (wealth)

**Dedication Party Options**
1. **Church-based**: Special service, then reception
2. **Home celebration**: Intimate, budget-friendly
3. **Hall party**: Larger guest count, more formal

**Budget Breakdown: N150,000 - N800,000**
- Venue: N50,000 - N200,000
- Catering: N60,000 - N300,000
- Decorations: N30,000 - N150,000
- Photography: N20,000 - N100,000
- Cake: N15,000 - N50,000

**Typical Guest Count: 50-150 people**

Will this be religious (church/mosque) or strictly traditional?`;
    }

    // Bridal Shower
    if (lowerInput.includes('bridal shower') || lowerInput.includes('bridal')) {
      return `Bridal showers are beautiful pre-wedding celebrations! Here's your complete guide:

**Bridal Shower Planning**

**1. Timing**
- 1-3 months before the wedding
- Weekend afternoon is most popular
- 2-4 hours duration

**2. Format Options**
- **Intimate Tea Party**: 15-30 close friends, elegant sit-down
- **Fun & Games**: 30-50 guests, activities and entertainment
- **Spa & Pamper**: Relaxing spa-themed shower
- **Traditional**: Include cultural elements and blessings

**3. Popular Themes**
- Rose Gold & Blush — romantic, soft
- Bohemian Chic — pampas grass, macrame
- Tropical Paradise — vibrant, fun
- Classic Elegance — white & gold, timeless
- Ankara Fusion — traditional prints with modern style

**4. Activities & Games**
- "Who knows the bride best?" quiz
- Wedding dress toilet paper challenge
- Date night jar (guests contribute ideas)
- Advice cards for the couple
- Lingerie/gift unwrapping
- Photo booth with props

**5. Food & Drinks**
- Small chops & finger foods (perfect for mingling)
- Chapman, mocktails, fruit-infused water
- Cupcakes, mini desserts, fruit trays
- Light meal option: pasta or rice station

**6. Gift Ideas for the Bride**
- Lingerie set
- Couples' gift basket
- Spa voucher
- Kitchen essentials
- Personalized keepsakes

**Budget Ranges (Kwara)**
- Intimate (20 guests): N150,000 - N300,000
- Standard (40 guests): N300,000 - N600,000
- Lavish (60+ guests): N600,000 - N1,200,000

**Typical Costs**
- Venue: N50K - N200K
- Decor: N50K - N150K
- Catering: N80K - N250K
- Photography: N30K - N80K
- Games & props: N10K - N30K

How many guests are you planning for the bridal shower?`;
    }

    // Trends
    if (lowerInput.includes('trend') || lowerInput.includes('latest') || lowerInput.includes('modern') || lowerInput.includes('2024') || lowerInput.includes('2025') || lowerInput.includes("what's new")) {
      return `Here are the hottest event trends right now:

**Color Trends 2024-2025**
1. **Monochromatic**: Single color in varying shades
2. **Earthy Tones**: Terracotta, sage green, dusty rose
3. **Bold Jewel**: Emerald, ruby, sapphire, deep purple
4. **Gold + White**: Classic, always elegant
5. **Blush + Champagne**: Soft, romantic

**Decoration Styles**
- Grand entrance arches with fresh flowers
- Hanging installations (florals, lanterns, crystals)
- Neon signs with couple names or hashtags
- Photo walls with mixed frames
- Statement ceiling drapes
- Hanging rattan chairs for photos
- Balloon garlands in organic shapes

**Event Tech Trends**
- Digital invitations with RSVP tracking
- QR codes for menus and programs
- Instagram-worthy photo spots
- Live streaming for remote guests
- Interactive guest books (audio/video messages)

**Food Trends**
- Food stations (suya bar, small chops, pasta station)
- Live cooking stations
- Miniature versions of traditional dishes
- Artisan cakes with watercolor or marble designs
- Dessert tables with variety

Which trend interests you most?`;
    }

    // Music/Entertainment
    if (lowerInput.includes('dj') || lowerInput.includes('music') || lowerInput.includes('band') || lowerInput.includes('entertainment') || lowerInput.includes('mc') || lowerInput.includes('live performance')) {
      return `Entertainment makes or breaks the party! Here's your complete guide:

**DJ vs Live Band Comparison**
| Factor | DJ | Live Band |
|--------|-----|-----------|
| Song variety | Unlimited | Limited repertoire |
| Cost | N80K - N300K | N150K - N500K |
| Non-stop music | Yes | Breaks between sets |
| Guest interaction | Moderate | High energy |
| Best for | All events | Weddings, galas |

**MC Selection - Questions to Ask**
1. Experience with your event type?
2. Sample videos of past events?
3. Voice quality and crowd engagement?
4. Backup plan if unavailable?
5. Cost: N50K - N300K

**Music Timeline for Wedding Reception**
- Guest arrival: Soft Afrobeats, R&B
- Entrance: High energy, upbeat
- First dance: Romantic slow song
- Dinner: Smooth jazz, soft Afrobeats
- Party time: Latest hits, throwbacks, Afrobeats
- Last dance: Romantic, memorable

**Live Band Options in Kwara**
- Juju/Highlife bands (King Sunny Ade style)
- Gospel bands
- Contemporary Pop bands
- Traditional drummers (talking drum)

What's your entertainment vision?`;
    }

    // Budget with context awareness
    if (lowerInput.includes('budget') || lowerInput.includes('cost') || lowerInput.includes('price') || lowerInput.includes('how much') || lowerInput.includes('afford') || lowerInput.includes('expensive')) {
      if (eventContext.eventType === 'wedding' || lowerInput.includes('wedding')) {
        const g = ctx.guestCount || guests;
        const tier = g <= 80 ? { label: 'Intimate', low: 800000, high: 1500000, venue: 150000, catering: 400000, decor: 150000, photo: 150000, outfits: 200000, other: 250000 } : g <= 200 ? { label: 'Standard', low: 2000000, high: 5000000, venue: 500000, catering: 1200000, decor: 600000, photo: 400000, outfits: 500000, other: 800000 } : { label: 'Grand', low: 6000000, high: 15000000, venue: 1500000, catering: 4000000, decor: 2000000, photo: 800000, outfits: 1000000, other: 2000000 };
        const fmt = (n: number) => `N${n.toLocaleString('en-NG')}`;
        return `Here's a detailed wedding budget breakdown${eventContext.guestCount ? ` for your ${g} guests` : ''}:

**${tier.label} Wedding (${g} guests): ${fmt(tier.low)} - ${fmt(tier.high)}**
- Venue: ${fmt(tier.venue)} | Catering: ${fmt(tier.catering)} | Decor: ${fmt(tier.decor)}
- Photo/Video: ${fmt(tier.photo)} | Outfits: ${fmt(tier.outfits)} | Others: ${fmt(tier.other)}

**Budget-Saving Pro Tips:**
1. Allocate 5-10% contingency for unexpected costs
2. Get at least 3 quotes per vendor category
3. Book off-season (July-August) for discounts
4. Combine ceremony + reception at one venue
5. Use silk flowers mixed with fresh
6. Negotiate package deals with vendors

What's your target budget range? I can suggest how to maximize every naira!`;
      }

      return `Great question about budgeting! Here's a typical cost breakdown:

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

What's your approximate budget? I can suggest allocation strategies!`;
    }

    // Decor/Theme
    if (lowerInput.includes('decor') || lowerInput.includes('decoration') || lowerInput.includes('theme') || lowerInput.includes('color') || lowerInput.includes('design') || lowerInput.includes('style')) {
      const eventLabel = ctx.eventType ? ctx.eventType : 'event';
      return `Excellent! Decoration sets the mood for your entire ${eventLabel}.${ctx.style ? ` Since you mentioned a ${ctx.style} style, I'll tailor these suggestions.` : ''}

**Popular Color Schemes in Kwara**
- **Gold & White**: Classic, elegant, timeless
- **Purple & Gold**: Royal, sophisticated
- **Navy Blue & Silver**: Modern, refined
- **Coral & Peach**: Romantic, soft
- **Burgundy & Gold**: Rich, luxurious

**Theme Ideas**
1. **Garden Romance**: Florals, fairy lights, pastels, greenery
2. **Royal Affair**: Deep colors, gold accents, chandeliers
3. **Modern Minimal**: Clean lines, statement pieces, monochrome
4. **Traditional Nigerian**: Ankara patterns, cultural elements
5. **Bohemian**: Macrame, pampas grass, earthy tones

**Essential Decoration Elements**
- Entrance arch/Photo backdrop (N50K - N200K)
- Centerpieces: ${Math.ceil(guests/8)} tables needed (N8K - N25K each)
- Chair covers & sashes (N500 - N1,500 each)
- Table runners and overlays
- Stage/Head table decor
- Lighting (uplights, fairy lights, chandeliers)
- Aisle decor (if ceremony on-site)

**Estimated Decor Cost for ${guests} guests**
${guests <= 80 ? 'N150,000 - N300,000' : guests <= 150 ? 'N300,000 - N600,000' : guests <= 300 ? 'N500,000 - N1,200,000' : 'N800,000 - N2,000,000'}

Which color scheme or theme resonates with you?`;
    }

    // Food/Catering
    if (lowerInput.includes('food') || lowerInput.includes('cater') || lowerInput.includes('menu') || lowerInput.includes('meal') || lowerInput.includes('rice') || lowerInput.includes('jollof')) {
      return `Food is one of the most memorable parts of any event!${ctx.eventType ? ` For a ${ctx.eventType}, your guests will expect something special.` : ''}

**Popular Nigerian Menu Options**

**1. Traditional Nigerian (Most Popular)**
- Jollof rice (Nigerian-style, party rice!), fried rice, coconut rice
- Moin moin, efo riro, egusi soup, ewedu
- Assorted meats: beef, chicken, goat meat, ponmo, fish
- Plantain (dodo, boli), coleslaw, salad
- Amala + ewedu/gbegiri (Yoruba classic)
- Pounded yam + egusi or efo riro

**2. Continental**
- Pasta bar (jollof spaghetti, macaroni)
- Salad station, grilled proteins
- Fried chicken, wings, peppered gizzard
- Bread selection, roasted potatoes

**3. Hybrid (Best of Both)**
- Mix traditional + continental for diverse guests
- Great for weddings with mixed crowds

**4. Small Chops & Finger Foods (Crowd Favourite!)**
- Spring rolls, samosa, puff puff
- Chicken wings, gizzard, peppered snail
- Cocktail sausages, mini sliders, meat pie
- Fish roll, scotch eggs, doughnuts
- Asun (peppered goat meat), gizdodo

**5. Drinks & Beverages**
- Chapman, zobo, kunu (traditional drinks)
- Soft drinks: Coke, Fanta, Sprite, Maltina
- Water (still & sparkling)
- Fruit juices, cocktail options
- Premium: Mocktails, smoothies

**6. Desserts**
- Wedding cake / birthday cake
- Fruit trays (watermelon, pineapple, pawpaw)
- Ice cream station (kids love this!)
- Chin chin, kuli kuli (traditional snacks)

**Planning Tips**
- Main dishes: 1.2 servings per person (people go back for seconds!)
- Small chops: 4-5 packs per person
- Drinks: 2-3 bottles per person
- Dessert: 1 serving per person
- Always cook 10% extra — Nigerian parties have unexpected guests!

**Cost Per Guest (Kwara State)**
- Budget: N1,500 - N2,500/guest (basic rice + meat + drink)
- Standard: N3,000 - N5,000/guest (rice + 2 proteins + small chops + drinks)
- Premium: N6,000 - N10,000/guest (full menu + small chops + desserts + premium drinks)
- Luxury: N10,000+ /guest (multiple stations, premium meats, full bar)

**Estimated Catering for ${guests} guests**
${guests <= 50 ? 'N75,000 - N500,000' : guests <= 100 ? 'N150,000 - N1,000,000' : guests <= 200 ? 'N300,000 - N2,000,000' : 'N500,000 - N3,000,000+'}

**Cultural Food Notes**
- Yoruba events: Amala, efo riro, iyan are must-haves
- Igbo events: Egusi, bitterleaf soup, foo-foo, abacha
- Hausa events: Tuwo shinkafa, miyan kuka, danbun tsakiya
- Always include a vegetarian option

What type of cuisine are you considering?`;
    }

    // Vendors
    if (lowerInput.includes('vendor') || lowerInput.includes('photographer') || lowerInput.includes('videographer') || lowerInput.includes('makeup') || lowerInput.includes('florist')) {
      return `Here's comprehensive vendor guidance for Kwara State:

**Vendor Booking Timeline**
| Vendor | Book Ahead |
|--------|------------|
| Venue | 9-12 months |
| Photographer | 6-9 months |
| Videographer | 6-9 months |
| DJ/Band | 4-6 months |
| MC | 3-4 months |
| Florist/Decorator | 3-4 months |
| Makeup Artist | 2-3 months |
| Caterer | 2-3 months |

**Questions to Ask Every Vendor**
1. What's included in your package?
2. Hours of coverage/service?
3. Payment terms (deposit %, balance due)?
4. Backup plan if you're unavailable?
5. Portfolio or references to contact?
6. Insurance or guarantees?
7. Setup/breakdown time needed?
8. Additional fees (travel, overtime)?

**Red Flags to Avoid**
- No contract or written agreement
- Demanding 100% payment upfront
- No portfolio or references
- Unwilling to meet in person
- Unusually cheap (too good to be true)
- Vague about what's included

**Pro Tips**
- Book vendors who've worked at your venue
- Get itemized quotes, not just totals
- Read contracts thoroughly before signing
- Maintain regular contact after booking

What type of vendor are you looking for?`;
    }

    // Outfit/Attire
    if (lowerInput.includes('outfit') || lowerInput.includes('dress') || lowerInput.includes('attire') || lowerInput.includes('aso ebi') || lowerInput.includes('aso oke') || lowerInput.includes('fashion') || lowerInput.includes('wear')) {
      return `Looking your best is essential! Here's your complete attire guide:

**Traditional Nigerian Options**
- **Aso Ebi**: Coordinated family/friend uniforms (N15K - N150K/set)
- **Aso Oke**: Premium Yoruba handwoven fabric (N30K - N150K/set)
- **Agbada**: Grand, flowing for grooms (N40K - N200K)
- **Iro & Buba + Gele**: Classic Yoruba women's set
- **Ankara**: Vibrant, affordable, customizable (N15K - N50K/set)
- **George/Lace**: Elegant, formal events (N40K - N150K/set)
- **Senator/Kaftan**: Modern Nigerian men's wear

**Bride's Attire Journey**
1. Traditional outfit (2-3 outfit changes)
2. White wedding gown (rent N50K - N200K, buy N150K - N1M+)
3. Reception dress (comfortable for dancing)
4. Honeymoon outfits

**Groom's Attire Journey**
1. Traditional agbada or senator
2. Suit/tuxedo for white wedding
3. Reception outfit (senator, kaftan)

**Planning Timeline**
- 3 months: Choose designs, order fabrics
- 6 weeks: Begin sewing/fittings
- 3 weeks: Final fitting
- 1 week: Pickup and steam

**Aso Ebi Tips**
- Order 10% extra for latecomers
- Consider different styles for body types
- Provide color swatches to all tailors
- Collect money upfront!

What style are you considering? Traditional, modern, or a mix?`;
    }

    // Guest list
    if (lowerInput.includes('guest') || lowerInput.includes('invite') || lowerInput.includes('attend') || lowerInput.includes('capacity') || lowerInput.includes('people')) {
      return `Guest list management is crucial! Here's a strategic approach:

**Guest List Tiers**
- **Tier A (Must-have)**: Immediate family, best friends, close relatives
- **Tier B (Would like)**: Extended family, colleagues, neighbors
- **Tier C (Overflow)**: Acquaintances, distant relatives

**Venue Capacity vs Guest Count**
| Guests | Venue Type |
|--------|------------|
| 30-50 | Restaurant private room, small hall, home |
| 50-100 | Medium hall, church hall, garden |
| 100-200 | Large hall, hotel ballroom, event center |
| 200-400 | Event center, large hotel |
| 400+ | Open field, stadium, large event center |

**Invitation Timeline**
- Save-the-dates: 3-4 months ahead
- Traditional list sharing: Both families early
- Formal invites: 6-8 weeks ahead
- RSVP deadline: 2-3 weeks before event
- Final headcount to caterers: 1 week before

**RSVP Tracking Methods**
- WhatsApp broadcast with reply tracking
- Google Form link on invitation
- Dedicated phone number for RSVPs
- Event website with RSVP feature

**Pro Tips**
- Plan for 10-15% no-shows
- Have backup seats for unexpected guests
- Create a "VIP" list for reserved seating

How many guests are you thinking?`;
    }

    // Wedding specific
    if (lowerInput.includes('wedding') || lowerInput.includes('marriage')) {
      return `How exciting - a wedding! Let's make it unforgettable.

**Complete Wedding Planning Timeline**

**12+ Months Before**
- Set date (consider weather, holidays, family availability)
- Set overall budget
- Create guest list draft
- Research and book venue
- Book photographer and videographer

**8-10 Months Before**
- Choose wedding theme and colors
- Book DJ/band and MC
- Order invitations and Aso Ebi
- Book caterer
- Schedule dress fittings

**6 Months Before**
- Send save-the-dates
- Book florist/decorator
- Order wedding cake
- Plan honeymoon
- Book makeup artist

**3-4 Months Before**
- Send formal invitations
- Confirm all vendors
- Finalize menu with caterer
- Order souvenirs/favors

**1-2 Months Before**
- Final headcount
- Seating chart
- Final dress fitting
- Vendor run-through meeting
- Print programs

**1 Week Before**
- Confirm final details with all vendors
- Prepare vendor payments
- Pack for honeymoon

**Key Decisions**
1. Traditional + White wedding, or just one?
2. Indoor or outdoor preference?
3. Intimate or grand celebration?

What stage of planning are you at?`;
    }

    // Birthday specific
    if (lowerInput.includes('birthday')) {
      return `Birthday celebrations should be fun and memorable!

**Birthday Types & Ideas by Age**

**Kids (1-10 years): N100K - N500K**
- Bounce house, face painting, games
- Character themes (Frozen, Spider-Man, Cocomelon)
- Activity-based (art, baking, treasure hunt)
- Balloon decoration, cake cutting

**Teens (11-17 years): N150K - N600K**
- Gaming stations, foosball, video games
- Karaoke, photo booth
- Pool party, movie night
- Sleepover with activities

**Young Adults (18-35 years): N200K - N1M**
- Party vibe, DJ, Instagram moments
- Dinner party, lounge setting
- Themed costume party
- Outdoor barbecue, pool party

**Milestone (40/50/60+ years): N300K - N1.5M**
- Elegant dinner setting
- Memory lane display (photos through the years)
- Tribute video, speeches from loved ones
- Family gathering, reunion feel

**Budget-Friendly Ideas**
- Host at home or public park (free venue!)
- Potluck food sharing
- Digital invitations (free!)
- DIY decorations
- Homemade or semi-homemade cake
- Spotify playlist instead of DJ

What age group and party style are you thinking?`;
    }

    // Timeline/Program
    if (lowerInput.includes('timeline') || lowerInput.includes('schedule') || lowerInput.includes('program') || lowerInput.includes('run of show') || lowerInput.includes('itinerary')) {
      return `A good timeline keeps everything running smoothly!

**Wedding Day Timeline (5-hour celebration)**
10:00 AM - Vendor arrivals, setup begins
11:00 AM - Bridal party photos
12:00 PM - Guest arrival, ushers seat guests
12:30 PM - Processional, ceremony begins
  1:00 PM - Recessional, congratulations
  1:15 PM - Cocktail hour, group photos
  2:00 PM - Grand entrance (couple)
  2:15 PM - First dance
  2:30 PM - Welcome speech, prayers
  2:45 PM - Cake cutting ceremony
  3:00 PM - Food service begins
  3:30 PM - Toast/speeches (parents, friends)
  4:00 PM - Dance floor opens
  5:00 PM - Games/activities
  5:30 PM - Bouquet toss, garter toss
  6:00 PM - More dancing
  6:30 PM - Last dance
  7:00 PM - Farewell/sendoff

**Tips for Smooth Flow**
- Build in 15-minute buffers between key moments
- Appoint a day-of coordinator or timekeeper
- Share timeline with all vendors in advance
- Have a run-through the week before

**Birthday Party (3 hours)**
- 0:00: Guest arrival, mingling, music
- 0:30: Games/activities begin
- 1:00: Food service
- 1:30: Cake cutting, "Happy Birthday"
- 2:00: Gift opening, photos
- 2:30: More fun/dancing
- 3:00: Wrap up, party favors

Would you like me to customize a timeline for your specific event?`;
    }

    // Venue
    if (lowerInput.includes('venue') || lowerInput.includes('location') || lowerInput.includes('place') || lowerInput.includes('hall') || lowerInput.includes('event center') || lowerInput.includes('hotel')) {
      const venueContext = ctx.guestCount ? ` With ${ctx.guestCount} guests, you'll need a venue that seats everyone comfortably.` : '';
      return `Venue selection is critical!${venueContext} Here's comprehensive guidance for Kwara State and Nigeria:

**Popular Venues in Ilorin & Kwara State**

**1. Hotel Ballrooms & Conference Halls**
- Kwara Hotel (Ilorin) — AC, ample parking, all-inclusive packages
- Hotel Zenab (Ilorin) — elegant ballroom, in-house catering
- Siland Suites (Ilorin) — modern event hall, great for weddings
- Range: N300K - N1.5M

**2. Event Centers**
- Banex Event Centre — large capacity, flexible layout
- Crystore Event Hall — popular for weddings and parties
- De-Peace Event Centre — budget-friendly, good parking
- Kwara State Multipurpose Centre — government-owned, spacious
- Range: N200K - N800K

**3. Churches/Mosque Halls**
- Most denominations have event halls available to members
- Budget-friendly, familiar environment
- Range: N50K - N300K

**4. Restaurants & Private Dining**
- Grill House (Ilorin) — intimate settings, food on-site
- Crocodile Restaurant — University area, great for small gatherings
- Range: N100K - N400K

**5. Outdoor Gardens & Open Fields**
- University of Ilorin Botanical Garden — scenic, greenery
- Private compounds and family land — free or low cost
- Weather-dependent (have a canopy/tent backup!)
- Range: N50K - N300K (plus tent rental)

**Major Venues Outside Kwara (if needed)**
- Lagos: Eko Hotel, Oriental Hotel, Federal Palace, Balmoral Hall
- Abuja: Transcorp Hilton, NAF Conference Centre, International Conference Centre
- Ibadan: Jogor Centre, Kakanfo Inn

**Critical Questions to Ask Any Venue**
- Maximum capacity (seated vs standing)?
- What's included? (tables, chairs, linens, sound, generator?)
- Power backup / generator? (Essential in Nigeria!)
- Parking capacity and security?
- Catering restrictions or in-house catering only?
- Noise regulations / curfew time?
- AC or fans only?
- Setup/breakdown time included?
- Cleaning fee or damage deposit?

**Venue Size Quick Guide**
| Guests | Venue Size |
|--------|------------|
| 50 | Small hall / restaurant |
| 100 | Medium hall |
| 200 | Large hall / hotel ballroom |
| 300+ | Event center / open field with tent |

What type of venue are you considering? I can narrow it down!`;
    }

    // Flowers/Florist
    if (lowerInput.includes('flower') || lowerInput.includes('bouquet') || lowerInput.includes('floral') || lowerInput.includes('florist')) {
      return `Flowers add beauty, fragrance, and elegance to any event!

**Popular Flowers Available in Nigeria**
- **Roses**: N2,000 - N5,000 per stem (classic, romantic)
- **Lilies**: N3,000 - N6,000 per stem (elegant, fragrant)
- **Carnations**: N1,500 - N3,000 per stem (long-lasting)
- **Baby's breath**: N1,000 - N2,000 per bunch (filler)
- **Orchids**: N4,000 - N8,000 per stem (luxury)
- **Local flowers**: N500 - N1,500 per bunch (budget-friendly)

**Essential Floral Elements for Wedding**
- Bridal bouquet: N15,000 - N50,000
- Bridesmaids' bouquets (each): N10,000 - N25,000
- Boutonnieres (each): N2,000 - N5,000
- Centerpieces (each): N8,000 - N25,000
- Entrance arch: N50,000 - N200,000
- Aisle markers: N20,000 - N60,000
- Stage florals: N50,000 - N150,000

**Budget-Saving Tips**
1. Choose in-season flowers
2. Mix fresh flowers with quality silk flowers
3. Repurpose ceremony flowers for reception
4. Use more greenery than flowers
5. Consider potted plants as centerpieces
6. Order from local markets directly

**Typical Total Flower Budget: N150,000 - N500,000**

What floral style do you prefer? Romantic, modern, or traditional?`;
    }

    // Souvenirs/Party Favors
    if (lowerInput.includes('souvenir') || lowerInput.includes('favors') || lowerInput.includes('gift for guests') || lowerInput.includes('party favors') || lowerInput.includes('takeaway')) {
      return `Souvenirs show appreciation to your guests! Here are popular Nigerian options:

**Traditional Nigerian Souvenirs**
- Customized plastic food packs: N200 - N500 each
- Glass cups/mugs with print: N300 - N800 each
- Ankara fabric pieces (2 yards): N500 - N2,000 each
- Customized hand fans: N200 - N600 each
- Scented soaps: N300 - N800 each
- Key holders/bottle openers: N150 - N400 each
- Tote bags: N400 - N1,000 each

**Modern/Premium Options**
- Mini perfumes (10ml): N800 - N2,000 each
- Customized water bottles: N600 - N1,500 each
- Phone accessories (pouches, chargers): N300 - N800 each
- Scented candles: N500 - N1,500 each
- Chocolate boxes: N500 - N1,500 each
- Face towels: N400 - N1,000 each

**Planning Tips**
1. Order 10% extra for unexpected guests
2. Consider different tiers (VIP vs regular guests)
3. Package beautifully (presentation matters!)
4. Include a thank-you note/card
5. Label with guest names for place setting

**Typical Budget**
- 100 guests: N50K - N150K
- 200 guests: N100K - N300K
- 300+ guests: N150K - N500K

What type of souvenirs interest you?`;
    }

    // Photography/Video
    if (lowerInput.includes('photo') || lowerInput.includes('video') || lowerInput.includes('camera') || lowerInput.includes('pictures')) {
      return `Photography and videography capture memories that last forever!

**Photography Packages in Kwara**

**Basic Package: N80K - N150K**
- 4-6 hours coverage
- 200-300 edited photos
- Online gallery
- USB delivery

**Standard Package: N150K - N300K**
- 8-10 hours coverage
- 400-600 edited photos
- Pre-wedding shoot included
- Photo album (20-30 pages)
- Online gallery

**Premium Package: N300K - N600K**
- Full day coverage (getting ready to end)
- 800+ edited photos
- Pre-wedding + engagement shoots
- Premium photo albums (2 copies)
- Same-day edit slideshow
- Drone footage

**Videography Packages: N100K - N500K**
- Highlights reel (3-5 minutes)
- Full ceremony video
- Interviews with guests
- Cinematic editing

**Questions to Ask**
1. How many photographers on the day?
2. Editing style (candid, posed, artistic)?
3. Turnaround time for photos?
4. Backup equipment?
5. Album quality and pages included?
6. Raw footage available?

Do you need photography recommendations?`;
    }

    // Makeup/Beauty
    if (lowerInput.includes('makeup') || lowerInput.includes('beauty') || lowerInput.includes('gele') || lowerInput.includes('hair')) {
      return `Looking stunning on your big day is essential!

**Makeup Services in Kwara**

**Bridal Makeup: N30K - N100K**
- Trial session included
- HD/airbrush makeup
- False lashes
- Touch-up kit
- Gele tying (2-3 styles)

**Bridesmaids (each): N10K - N30K**
- Full face makeup
- Gele/headgear

**Guest Makeup: N5K - N20K**

**Popular Makeup Artists in Kwara**
- Book 2-3 months ahead for top artists
- Always do a trial session first
- Share inspiration photos

**Gele Styles**
- Fan style (popular)
- Auto-gele (pre-made, easy)
- Scorpion style
- Turban style
- Rose style

**Questions to Ask Makeup Artist**
1. Brand of products used?
2. Trial session included?
3. How many people can you handle?
4. Touch-up assistance during event?
5. Travel to venue or studio only?

**Pre-Event Beauty Timeline**
- 1 month: Facials, skin care routine
- 1 week: Manicure, pedicure, body scrub
- 2 days: Eyebrow shaping
- Day of: Arrive with clean, moisturized face

What look are you going for?`;
    }

    // Thanks
    if (lowerInput.includes('thank') || lowerInput.includes('thanks') || lowerInput.includes('helpful') || lowerInput.includes('appreciate')) {
      return `You're most welcome! I'm glad I could help.

I'm here for you throughout your planning journey!

**What else can I help with?**
- Vendor recommendations
- Detailed budget planning
- Timeline creation
- Theme/decoration ideas
- Guest list management
- Traditional ceremony guidance
- Troubleshooting planning challenges

Remember: BELSH Events offers professional planning services to bring your vision to life. Would you like to book a free consultation?

Just ask me anything!`;
    }

    // Contact/booking
    if (lowerInput.includes('book') || lowerInput.includes('consultation') || lowerInput.includes('contact') || lowerInput.includes('hire') || lowerInput.includes('your service') || lowerInput.includes('speak to someone')) {
      return `I'd love to connect you with the BELSH Events team!

**Ways to Reach Us**
- WhatsApp: +234 803 567 2491
- Instagram: @events_by_belsh
- Email: aolagbaye@gmail.com

**What to Expect**
- Free 30-minute consultation
- Personalized planning advice
- Transparent pricing
- Portfolio review
- No pressure, just guidance

**Services We Offer**
1. **Full Planning**: Start to finish management
2. **Day-of Coordination**: Ensure smooth execution
3. **Vendor Sourcing**: Find the best within budget
4. **Decor Setup**: Transform your venue
5. **Event Styling**: Curated aesthetic design

**What to Prepare for Consultation**
- Event date (or potential dates)
- Approximate guest count
- Budget range
- Vision/theme ideas
- Any specific requirements

Would you like help preparing questions for your consultation?`;
    }

    // Problem/complaint handling
    if (lowerInput.includes('problem') || lowerInput.includes('issue') || lowerInput.includes('help') || lowerInput.includes('worried') || lowerInput.includes('stressed') || lowerInput.includes('overwhelmed')) {
      return `I hear you - event planning can feel overwhelming! Let me help.

**Common Challenges & Solutions**

**Budget Constraints?**
- Prioritize what matters most to you
- DIY where possible (favors, some decor)
- Book off-season for vendor discounts
- Negotiate package deals

**Short Timeline?**
- Focus on essentials only
- Consider package deals (all-in-one)
- Ask vendors about expedited options
- Be flexible with dates

**Family Disagreements?**
- Create a shared vision board
- List non-negotiables separately
- Compromise on lower-priority items
- Consider a mediator/planner

**Vendor Ghosting?**
- Always have a written contract
- Follow up regularly
- Keep backup vendor contacts
- Consider booking platforms with guarantees

**Weather Concerns?**
- Always have Plan B (indoor backup)
- Rent tents/canopies for outdoor events
- Check seasonal weather patterns

Tell me your specific challenge - I'll help you find solutions!`;
    }

    // Default response with deep context
    const contextPrefix = contextSummary
      ? `Since we're discussing ${contextSummary}, `
      : '';

    const historyRef = ctx.conversationHistory.length > 1
      ? `\n**Building on our conversation so far**, I can see you're interested in: ${ctx.conversationHistory.slice(-3).map(h => h.substring(0, 40)).join(' → ')}.\n`
      : '';

    return `That's an interesting question! ${contextPrefix}let me help you think through this.

**Based on your question, here are considerations:**

1. **Event Type Matters**: Different events have different requirements
2. **Budget is Key**: Everything flows from your budget
3. **Location**: Kwara State (Ilorin) has many venue options
4. **Time**: Book early for best vendors

${contextSummary ? `**What I know about your event so far:**\n${contextSummary}\n${historyRef}` : '**To give you the best personalized advice, please tell me:**\n- What type of event are you planning?\n- How many guests are you expecting?\n- Do you have a date in mind?\n- What\'s your approximate budget?\n'}
I'll provide a detailed, customized plan once I know these details!

You can also ask me about:
- Traditional ceremonies
- Vendor booking
- Decoration trends
- Budget breakdowns
- Event timelines`;
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

    await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 600));

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
      <Confetti style="gold" active={showConfetti} />
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
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-3">
            Event <span className="italic gold-text">AI</span>
          </h1>
          <div className="section-divider" />
          <p className="text-white/80/80 text-sm max-w-xl mx-auto mt-3">
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
                  <h3 className="text-white text-sm font-medium">Saved Chats</h3>
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
                        <button onClick={() => loadConversation(conv)} className="text-white/80 text-xs truncate flex-1 text-left hover:text-gold-400 transition-colors">
                          {conv[1]?.content.substring(0, 25)}...
                        </button>
                        <button onClick={() => deleteSavedConversation(i)} className="text-white/60 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/60 text-xs">No saved chats yet</p>
                )}
                {messages.length > 1 && (
                  <button onClick={clearCurrentChat} className="w-full mt-3 text-xs text-white/70 hover:text-red-400 transition-colors flex items-center justify-center gap-1">
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
                        <p className="text-white/90 text-xs font-medium">{title}</p>
                        <p className="text-white/70 text-[10px]">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-xl p-4">
                <h3 className="text-white text-xs font-medium mb-3">Try Asking</h3>
                <div className="space-y-2">
                  {suggestedQuestions.map((q) => (
                    <button key={q} onClick={() => { setInput(q); setTimeout(() => sendMessage(), 50); }} className="w-full text-[11px] text-white/80 hover:text-gold-400 transition-colors text-left py-1 border-b border-dark-border/50 last:border-0">
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
                      <p className="text-white text-sm font-medium">BELSH Event AI</p>
                      <p className="text-white/70 text-[10px]">Your intelligent planning assistant</p>
                    </div>
                  </div>
                  {/* Context memory display */}
                  {(eventContext.eventType || eventContext.guestCount || eventContext.date || eventContext.location || eventContext.style) && (
                    <div className="flex flex-wrap gap-1.5 mt-3 animate-fade-in-up">
                      {eventContext.eventType && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 capitalize">{eventContext.eventType}</span>
                      )}
                      {eventContext.guestCount && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-white/80">{eventContext.guestCount} guests</span>
                      )}
                      {eventContext.date && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-white/80 capitalize">{eventContext.date}</span>
                      )}
                      {eventContext.location && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-white/80 capitalize">{eventContext.location}</span>
                      )}
                      {eventContext.style && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-white/80 capitalize">{eventContext.style}</span>
                      )}
                    </div>
                  )}                </div>

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
                        <p className="text-white text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p className="text-white/60 text-[10px] mt-2">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
                          <span className="text-white/80 text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Follow-up suggestions */}
                  {!loading && followUps.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 animate-fade-in-up">
                      {followUps.slice(0, 4).map((q) => (
                        <button
                          key={q}
                          onClick={() => { setInput(q); setTimeout(() => sendMessage(), 50); }}
                          className="text-[11px] px-3 py-1.5 rounded-full bg-purple-800/30 border border-purple-700/30 text-white/80 hover:text-gold-400 hover:border-gold-500/40 transition-all hover:scale-105"
                        >
                          {q}
                        </button>
                      ))}
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
                      className="flex-1 bg-dark-card border border-dark-border rounded-lg px-4 py-2.5 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
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
          <h2 className="font-serif text-lg text-white mb-2">Ready to make it real?</h2>
          <p className="text-white/80/80 text-sm mb-4">Let the BELSH Events team bring your vision to life.</p>
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
