import { useState, useEffect, useRef } from 'react';
import { ChevronRight, Calendar, Users, MapPin, Sparkles, Camera, Music, Download, Heart, Clock, CheckCircle, FileText, Bell, TrendingUp, CreditCard, Eye, ChevronLeft, Share2 } from 'lucide-react';

type Page = 'home' | 'services' | 'portfolio' | 'about' | 'faq' | 'contact' | 'premium';

interface PremiumFeaturesProps {
  onNavigate: (page: Page) => void;
}

const GMAIL_URL = 'https://mail.google.com/mail/?view=cm&fs=1&to=aolagbaye@gmail.com&su=Event%20Enquiry%20-%20Events%20By%20BELSH';
const WHATSAPP_URL = 'https://wa.me/2348035672491?text=Hi%20BELSH!%20I%27d%20like%20to%20inquire%20about%20planning%20my%20event.';

// Confetti Component
function Confetti({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: ['#d4a017', '#f2cc5a', '#e6b930', '#c48b00'][Math.floor(Math.random() * 4)],
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// 1. COUNTDOWN TIMER COMPONENT
function CountdownTimer() {
  const [eventDate, setEventDate] = useState('');
  const [eventName, setEventName] = useState('');
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!eventDate) return;

    const interval = setInterval(() => {
      const target = new Date(eventDate).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsComplete(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
      setIsComplete(false);
    }, 1000);

    return () => clearInterval(interval);
  }, [eventDate]);

  const timeUnits = countdown
    ? [
        { value: countdown.days, label: 'Days' },
        { value: countdown.hours, label: 'Hours' },
        { value: countdown.minutes, label: 'Minutes' },
        { value: countdown.seconds, label: 'Seconds' },
      ]
    : null;

  return (
    <div className="glass-card gold-border rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center">
          <Clock size={20} className="text-gold-400" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-purple-100">Live Event Countdown</h3>
          <p className="text-purple-400 text-sm">Count down to your special day</p>
        </div>
      </div>

      {!countdown ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">Event Name</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="My Special Event"
              className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">Event Date & Time</label>
            <input
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 text-sm focus:outline-none focus:border-gold-500/50 transition-colors"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {eventName && <p className="text-center text-gold-400 text-sm uppercase tracking-widest">{eventName}</p>}

          {isComplete ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-gold-900/40 border border-gold-500/50 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Sparkles size={32} className="text-gold-400" />
              </div>
              <p className="font-serif text-2xl text-purple-100 mb-2">The Day Has Arrived!</p>
              <p className="text-purple-400 text-sm">Congratulations on your special event!</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {timeUnits?.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="glass-dark rounded-xl p-4 border border-gold-500/20 hover:border-gold-500/40 transition-colors">
                    <p className="font-serif text-3xl md:text-4xl text-gold-400 mb-1">{value.toString().padStart(2, '0')}</p>
                    <p className="text-purple-400 text-xs uppercase tracking-widest">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => { setCountdown(null); setEventDate(''); }}
            className="text-sm text-purple-400 hover:text-gold-300 transition-colors w-full text-center"
          >
            Reset Countdown
          </button>
        </div>
      )}
    </div>
  );
}

// 2. AI EVENT COST ESTIMATOR
function CostEstimator() {
  const [eventType, setEventType] = useState('wedding');
  const [guests, setGuests] = useState(100);
  const [venueSize, setVenueSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [decoration, setDecoration] = useState<'basic' | 'standard' | 'premium' | 'luxury'>('standard');
  const [catering, setCatering] = useState(false);
  const [photography, setPhotography] = useState(false);
  const [entertainment, setEntertainment] = useState(false);
  const [estimate, setEstimate] = useState<{ min: number; max: number } | null>(null);

  const baseCosts: Record<string, number> = {
    wedding: 500000,
    birthday: 150000,
    corporate: 300000,
    anniversary: 200000,
    'baby-shower': 100000,
    'bridal-shower': 80000,
    'naming-ceremony': 120000,
    'graduation': 100000,
  };

  const decorationMultipliers: Record<string, number> = {
    basic: 1,
    standard: 1.3,
    premium: 1.8,
    luxury: 2.5,
  };

  const calculateEstimate = () => {
    const base = baseCosts[eventType] || 200000;
    const guestMultiplier = guests > 200 ? 1.5 : guests > 100 ? 1.2 : 1;
    const venueMultiplier = venueSize === 'large' ? 1.4 : venueSize === 'medium' ? 1 : 0.8;
    const decorMultiplier = decorationMultipliers[decoration];

    let total = base * guestMultiplier * venueMultiplier * decorMultiplier;

    if (catering) total += guests * 15000;
    if (photography) total += 150000;
    if (entertainment) total += 200000;

    const min = Math.round(total * 0.85);
    const max = Math.round(total * 1.15);

    setEstimate({ min, max });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const shareOnWhatsApp = () => {
    const message = `Hi BELSH Events! I'm interested in planning a ${eventType.replace('-', ' ')} event for ${guests} guests. My estimated budget is between ${formatPrice(estimate?.min || 0)} - ${formatPrice(estimate?.max || 0)}. Services: Decoration (${decoration})${catering ? ', Catering' : ''}${photography ? ', Photography' : ''}${entertainment ? ', Entertainment' : ''}. Can we discuss further?`;
    window.open(`https://wa.me/2348035672491?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="glass-card gold-border rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center">
          <TrendingUp size={20} className="text-gold-400" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-purple-100">AI Event Cost Estimator</h3>
          <p className="text-purple-400 text-sm">Get instant budget estimates</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">Event Type</label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 text-sm focus:outline-none focus:border-gold-500/50"
          >
            <option value="wedding">Wedding</option>
            <option value="birthday">Birthday Celebration</option>
            <option value="corporate">Corporate Event</option>
            <option value="anniversary">Anniversary</option>
            <option value="baby-shower">Baby Shower</option>
            <option value="bridal-shower">Bridal Shower</option>
            <option value="naming-ceremony">Naming Ceremony</option>
            <option value="graduation">Graduation Party</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">Number of Guests</label>
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            min="10"
            max="1000"
            className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 text-sm focus:outline-none focus:border-gold-500/50"
          />
        </div>

        <div>
          <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">Venue Size</label>
          <div className="grid grid-cols-3 gap-2">
            {['small', 'medium', 'large'].map((size) => (
              <button
                key={size}
                onClick={() => setVenueSize(size as any)}
                className={`py-2 rounded-lg text-sm capitalize transition-all ${
                  venueSize === size
                    ? 'bg-gold-500/20 border border-gold-500/40 text-gold-400'
                    : 'bg-dark-card border border-dark-border text-purple-300 hover:border-gold-500/30'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">Decoration Level</label>
          <div className="grid grid-cols-4 gap-2">
            {['basic', 'standard', 'premium', 'luxury'].map((level) => (
              <button
                key={level}
                onClick={() => setDecoration(level as any)}
                className={`py-2 rounded-lg text-xs capitalize transition-all ${
                  decoration === level
                    ? 'bg-gold-500/20 border border-gold-500/40 text-gold-400'
                    : 'bg-dark-card border border-dark-border text-purple-300 hover:border-gold-500/30'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-xs text-purple-400 uppercase tracking-widest">Additional Services</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'catering', label: 'Catering', icon: Users, value: catering, setter: setCatering },
            { key: 'photography', label: 'Photography', icon: Camera, value: photography, setter: setPhotography },
            { key: 'entertainment', label: 'Entertainment', icon: Music, value: entertainment, setter: setEntertainment },
          ].map(({ key, label, icon: Icon, value, setter }) => (
            <button
              key={key}
              onClick={() => setter(!value)}
              className={`flex items-center gap-2 py-3 px-4 rounded-lg transition-all ${
                value
                  ? 'bg-gold-500/20 border border-gold-500/40 text-gold-400'
                  : 'bg-dark-card border border-dark-border text-purple-300 hover:border-gold-500/30'
              }`}
            >
              <Icon size={16} />
              <span className="text-sm">{label}</span>
              {value && <CheckCircle size={14} className="ml-auto" />}
            </button>
          ))}
        </div>
      </div>

      <button onClick={calculateEstimate} className="btn-gold w-full mt-6">
        Calculate Estimate
      </button>

      {estimate && (
        <div className="mt-6 glass-dark rounded-xl p-6 border border-gold-500/20">
          <p className="text-center text-purple-400 text-sm mb-2">Estimated Budget Range</p>
          <div className="text-center">
            <p className="font-serif text-3xl text-gold-400 mb-1">{formatPrice(estimate.min)}</p>
            <p className="text-purple-400 text-sm">to</p>
            <p className="font-serif text-3xl text-gold-400 mt-1">{formatPrice(estimate.max)}</p>
          </div>
          <button onClick={shareOnWhatsApp} className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-700 hover:bg-green-600 text-white text-sm font-medium transition-colors">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Book This Package on WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}

// 3. MOOD BOARD
const moodBoardImages = [
  { category: 'Weddings', image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600', title: 'Garden Romance' },
  { category: 'Weddings', image: 'https://images.pexels.com/photos/1114425/pexels-photo-1114425.jpeg?auto=compress&cs=tinysrgb&w=600', title: 'Elegant Court' },
  { category: 'Birthdays', image: 'https://images.pexels.com/photos/33748012/pexels-photo-33748012.jpeg?auto=compress&cs=tinysrgb&w=600', title: '21st Elegance' },
  { category: 'Birthdays', image: 'https://images.pexels.com/photos/3171770/pexels-photo-3171770.jpeg?auto=compress&cs=tinysrgb&w=600', title: 'Sweet Sixteen' },
  { category: 'Corporate', image: 'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=600', title: 'Awards Gala' },
  { category: 'Corporate', image: 'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?auto=compress&cs=tinysrgb&w=600', title: 'Product Launch' },
  { category: 'Luxury', image: 'https://images.pexels.com/photos/1128782/pexels-photo-1128782.jpeg?auto=compress&cs=tinysrgb&w=600', title: 'White Luxe' },
  { category: 'Luxury', image: 'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=600', title: 'Sunset Terrace' },
  { category: 'Traditional', image: 'https://images.pexels.com/photos/29083282/pexels-photo-29083282.jpeg?auto=compress&cs=tinysrgb&w=600', title: 'Cultural Heritage' },
  { category: 'Private', image: 'https://images.pexels.com/photos/7505355/pexels-photo-7505355.jpeg?auto=compress&cs=tinysrgb&w=600', title: 'Candlelit Dinner' },
  { category: 'Private', image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=600', title: 'Garden Brunch' },
  { category: 'Outdoor', image: 'https://images.pexels.com/photos/2072181/pexels-photo-2072181.jpeg?auto=compress&cs=tinysrgb&w=600', title: 'Open Air Gala' },
];

const categories = ['All', 'Weddings', 'Birthdays', 'Corporate', 'Luxury', 'Traditional', 'Private', 'Outdoor'];

function MoodBoard() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const filteredImages = activeCategory === 'All'
    ? moodBoardImages
    : moodBoardImages.filter((img) => img.category === activeCategory);

  const toggleFavorite = (title: string) => {
    setFavorites((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const requestSimilar = (title: string) => {
    const message = `Hi BELSH Events! I love the "${title}" inspiration from your mood board and would like something similar for my event. Can we discuss?`;
    window.open(`https://wa.me/2348035672491?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="glass-card gold-border rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center">
          <Heart size={20} className="text-gold-400" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-purple-100">Event Inspiration Mood Board</h3>
          <p className="text-purple-400 text-sm">Get inspired by our curated gallery</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${
              activeCategory === cat
                ? 'bg-gold-500/20 border border-gold-500/40 text-gold-400'
                : 'bg-dark-card border border-dark-border text-purple-300 hover:border-gold-500/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((item) => (
          <div
            key={item.title}
            onMouseEnter={() => setHoveredItem(item.title)}
            onMouseLeave={() => setHoveredItem(null)}
            className="relative group aspect-[3/4] rounded-xl overflow-hidden cursor-pointer"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent" />

            {/* Heart Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(item.title);
              }}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                favorites.includes(item.title)
                  ? 'bg-gold-500 text-dark'
                  : 'bg-dark/50 text-white hover:bg-gold-500 hover:text-dark'
              }`}
            >
              <Heart size={14} fill={favorites.includes(item.title) ? 'currentColor' : 'none'} />
            </button>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-gold-400 text-[10px] uppercase tracking-widest mb-1">{item.category}</p>
              <p className="font-serif text-purple-100">{item.title}</p>
            </div>

            {/* Request Button on Hover */}
            {hoveredItem === item.title && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  requestSimilar(item.title);
                }}
                className="absolute inset-0 flex items-center justify-center bg-dark/80 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="btn-gold text-xs">Request Similar</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. CLIENT DASHBOARD
function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'payments'>('overview');

  // Mock data
  const dashboardData = {
    bookingStatus: 'Planning In Progress',
    eventDate: '2026-09-15',
    eventName: 'Adeola Wedding Ceremony',
    progress: 65,
    upcomingMeetings: [
      { date: '2026-07-10', title: 'Vendor Selection Review', time: '2:00 PM' },
      { date: '2026-07-20', title: 'Final Decor Preview', time: '11:00 AM' },
    ],
    payments: [
      { id: 1, description: 'Initial Deposit', amount: 200000, status: 'Paid', date: '2026-06-01' },
      { id: 2, description: 'Second Installment', amount: 150000, status: 'Pending', date: '2026-07-15' },
      { id: 3, description: 'Final Payment', amount: 150000, status: 'Upcoming', date: '2026-08-30' },
    ],
    documents: [
      { name: 'Contract Agreement', type: 'PDF', date: '2026-05-28' },
      { name: 'Vendor List', type: 'PDF', date: '2026-06-05' },
      { name: 'Mood Board Proposal', type: 'PDF', date: '2026-06-10' },
    ],
    notifications: [
      { message: 'Next meeting scheduled for July 10th', time: '2 hours ago', unread: true },
      { message: 'Second payment due in 15 days', time: '1 day ago', unread: true },
    ],
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price);
  };

  const daysUntilEvent = Math.ceil((new Date(dashboardData.eventDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="glass-card gold-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gold-900/30 to-purple-900/30 p-6 border-b border-dark-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center">
              <Eye size={20} className="text-gold-400" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-purple-100">Client Dashboard</h3>
              <p className="text-purple-400 text-sm">{dashboardData.eventName}</p>
            </div>
          </div>
          <div className="relative">
            {dashboardData.notifications.filter((n) => n.unread).length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                {dashboardData.notifications.filter((n) => n.unread).length}
              </span>
            )}
            <button className="w-10 h-10 rounded-full glass-card gold-border flex items-center justify-center hover:bg-gold-500/10 transition-colors">
              <Bell size={18} className="text-gold-400" />
            </button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-4">
          <span className="px-4 py-2 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-400 text-xs uppercase tracking-widest">
            {dashboardData.bookingStatus}
          </span>
          <span className="text-purple-300 text-sm">
            <Calendar size={14} className="inline mr-2" />
            {formatDate(dashboardData.eventDate)} ({daysUntilEvent} days)
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-dark-border">
        <div className="flex">
          {(['overview', 'documents', 'payments'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm uppercase tracking-widest transition-colors ${
                activeTab === tab
                  ? 'text-gold-400 border-b-2 border-gold-500'
                  : 'text-purple-400 hover:text-purple-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-purple-400 text-sm">Planning Progress</p>
                <p className="text-gold-400 text-sm font-medium">{dashboardData.progress}%</p>
              </div>
              <div className="h-2 bg-dark-card rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-500"
                  style={{ width: `${dashboardData.progress}%` }}
                />
              </div>
            </div>

            {/* Meetings */}
            <div>
              <p className="text-purple-400 text-xs uppercase tracking-widest mb-4">Upcoming Meetings</p>
              <div className="space-y-3">
                {dashboardData.upcomingMeetings.map((meeting, i) => (
                  <div key={i} className="flex items-center gap-4 glass-dark rounded-lg p-4">
                    <div className="w-12 h-12 rounded-lg bg-gold-900/30 flex items-center justify-center">
                      <Calendar size={20} className="text-gold-400" />
                    </div>
                    <div>
                      <p className="text-purple-100 font-medium">{meeting.title}</p>
                      <p className="text-purple-400 text-sm">{formatDate(meeting.date)} at {meeting.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div>
              <p className="text-purple-400 text-xs uppercase tracking-widest mb-4">Recent Notifications</p>
              <div className="space-y-2">
                {dashboardData.notifications.map((notif, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${notif.unread ? 'bg-gold-900/10 border border-gold-500/20' : 'bg-dark-card'}`}>
                    <div className={`w-2 h-2 rounded-full mt-2 ${notif.unread ? 'bg-gold-400' : 'bg-purple-600'}`} />
                    <div className="flex-1">
                      <p className="text-purple-200 text-sm">{notif.message}</p>
                      <p className="text-purple-500 text-xs mt-1">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-3">
            {dashboardData.documents.map((doc, i) => (
              <div key={i} className="flex items-center gap-4 glass-dark rounded-lg p-4">
                <div className="w-12 h-12 rounded-lg bg-gold-900/30 flex items-center justify-center">
                  <FileText size={20} className="text-gold-400" />
                </div>
                <div className="flex-1">
                  <p className="text-purple-100 font-medium">{doc.name}</p>
                  <p className="text-purple-400 text-xs">{doc.type} - Added {formatDate(doc.date)}</p>
                </div>
                <button className="w-10 h-10 rounded-full glass-card gold-border flex items-center justify-center hover:bg-gold-500/10 transition-colors">
                  <Download size={16} className="text-gold-400" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-3">
            {dashboardData.payments.map((payment) => (
              <div key={payment.id} className="flex items-center gap-4 glass-dark rounded-lg p-4">
                <div className="w-12 h-12 rounded-lg bg-gold-900/30 flex items-center justify-center">
                  <CreditCard size={20} className="text-gold-400" />
                </div>
                <div className="flex-1">
                  <p className="text-purple-100 font-medium">{payment.description}</p>
                  <p className="text-purple-400 text-xs">{formatDate(payment.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-gold-400 font-medium">{formatPrice(payment.amount)}</p>
                  <p className={`text-xs uppercase ${
                    payment.status === 'Paid' ? 'text-green-400' :
                    payment.status === 'Pending' ? 'text-yellow-400' : 'text-purple-400'
                  }`}>
                    {payment.status}
                  </p>
                </div>
              </div>
            ))}

            <div className="mt-6 pt-4 border-t border-dark-border">
              <div className="flex justify-between items-center">
                <p className="text-purple-400 text-sm">Total Paid</p>
                <p className="text-gold-400 font-serif text-xl">
                  {formatPrice(dashboardData.payments.filter((p) => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0))}
                </p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-purple-400 text-sm">Remaining</p>
                <p className="text-purple-200 font-serif text-xl">
                  {formatPrice(dashboardData.payments.filter((p) => p.status !== 'Paid').reduce((sum, p) => sum + p.amount, 0))}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 5. DOWNLOADABLE PACKAGES
function PackageDownloads() {
  const packages = [
    {
      name: 'Essential Wedding Package',
      price: 'From N500,000',
      features: ['Day-of coordination', 'Vendor management', 'Timeline creation', 'Basic decor setup'],
      image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
    {
      name: 'Premium Birthday Package',
      price: 'From N350,000',
      features: ['Full planning', 'Theme design', 'Entertainment booking', 'Photography coordination'],
      image: 'https://images.pexels.com/photos/33748012/pexels-photo-33748012.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
    {
      name: 'Corporate Excellence',
      price: 'From N800,000',
      features: ['Brand integration', 'AV production', 'Guest registration', 'Full event management'],
      image: 'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
    {
      name: 'Intimate Gathering',
      price: 'From N200,000',
      features: ['Personalized setup', 'Custom menu design', 'Private venue sourcing', 'Intimate styling'],
      image: 'https://images.pexels.com/photos/7505355/pexels-photo-7505355.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
  ];

  const handleDownload = (packageName: string) => {
    // In a real implementation, this would generate/download a PDF
    alert(`Downloading ${packageName} PDF brochure...`);
  };

  return (
    <div className="glass-card gold-border rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center">
          <Download size={20} className="text-gold-400" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-purple-100">Downloadable Event Packages</h3>
          <p className="text-purple-400 text-sm">Get detailed PDF brochures</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {packages.map((pkg) => (
          <div key={pkg.name} className="glass-dark rounded-xl overflow-hidden border border-gold-500/20 hover:border-gold-500/40 transition-colors">
            <div className="aspect-video relative">
              <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="font-serif text-lg text-purple-100">{pkg.name}</p>
                <p className="text-gold-400 text-sm">{pkg.price}</p>
              </div>
            </div>
            <div className="p-4">
              <ul className="space-y-2 mb-4">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-purple-300">
                    <CheckCircle size={14} className="text-gold-400 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleDownload(pkg.name)}
                className="w-full btn-outline-gold text-xs flex items-center justify-center gap-2"
              >
                <Download size={14} />
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// MAIN COMPONENT
export default function PremiumFeatures({ onNavigate }: PremiumFeaturesProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiTriggered, setConfettiTriggered] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!confettiTriggered) {
      setShowConfetti(true);
      setConfettiTriggered(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [confettiTriggered]);

  const navigate = (page: Page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={bodyRef}>
      <Confetti active={showConfetti} />

      {/* Hero */}
      <section className="page-hero text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(85,33,160,0.4)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4 opacity-0 animate-fade-in-up">Premium Tools</p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-purple-100 mb-4 opacity-0 animate-fade-in-up-2 leading-tight">
            Premium <span className="italic gold-text">Features</span>
          </h1>
          <div className="section-divider" />
          <p className="text-purple-300/80 text-base sm:text-lg max-w-xl mx-auto mt-4 opacity-0 animate-fade-in-up-3">
            Exclusive tools to help you plan your perfect event with ease and confidence.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-12">
          {/* Top Row */}
          <div className="grid lg:grid-cols-2 gap-8">
            <CountdownTimer />
            <CostEstimator />
          </div>

          {/* Mood Board - Full Width */}
          <MoodBoard />

          {/* Dashboard and Downloads */}
          <div className="grid lg:grid-cols-2 gap-8">
            <ClientDashboard />
            <PackageDownloads />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-purple-800/30 border-t border-dark-border text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl text-purple-100 mb-4">Ready to Start Planning?</h2>
          <p className="text-purple-300/80 mb-8">Let us bring your vision to life with our premium event planning services.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('contact')} className="btn-gold">
              Book a Consultation
              <ChevronRight size={16} />
            </button>
            <button onClick={() => navigate('services')} className="btn-outline-gold">
              View Services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
