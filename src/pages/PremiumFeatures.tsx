import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  ChevronRight, Calendar, Users, MapPin, Sparkles, Camera, Music, Download, Heart, Clock,
  CheckCircle, FileText, Bell, Eye, Share2, Gift, Crown, Wand2, Image, Video, Mic2,
  Palette, Cake, Car, Hotel, Star, MessageCircle, Send, X, Plus, Trash2, Edit3,
  Copy, QrCode, Mail, Phone, Globe, AlertTriangle, Shirt, ListMusic, PartyPopper,
  Building, UserCheck, Award, TrendingUp, DollarSign, Clock3, MapPinned, GalleryVerticalEnd,
  Film, Clapperboard, Theater, Users2, Ticket, ClipboardCheck, UserPlus, Menu as MenuIcon,
  Layout, Layers, PenTool, Save, RefreshCw, Info, ChevronDown, ChevronUp, Settings,
  Play, Pause, SkipForward, Volume2, Sun, Moon, Cloud, Umbrella, Thermometer, Instagram
} from 'lucide-react';

type Page = 'home' | 'services' | 'portfolio' | 'about' | 'faq' | 'contact' | 'premium';

interface PremiumFeaturesProps {
  onNavigate: (page: Page) => void;
}

const GMAIL_URL = 'https://mail.google.com/mail/?view=cm&fs=1&to=aolagbaye@gmail.com&su=Event%20Enquiry%20-%20Events%20By%20BELSH';
const WHATSAPP_URL = 'https://wa.me/2348035672491?text=Hi%20BELSH!%20I%27d%20like%20to%20inquire%20about%20planning%20my%20event.';
const INSTAGRAM_URL = 'https://www.instagram.com/rtw_by_belsh';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Enhanced Confetti Component
function Confetti({ active }: { active: boolean }) {
  if (!active) return null;

  const colors = ['#d4a017', '#f2cc5a', '#e6b930', '#c48b00', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ff9f43', '#ee5a5a'];
  const shapes = ['circle', 'square', 'triangle', 'star'];

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 200 }).map((_, i) => {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const size = 6 + Math.random() * 8;
        return (
          <div
            key={i}
            className="absolute animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-20px',
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
            }}
          >
            {shape === 'circle' && (
              <div
                className="rounded-full"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                  boxShadow: '0 0 6px rgba(255,255,255,0.5)',
                }}
              />
            )}
            {shape === 'square' && (
              <div
                style={{
                  width: size,
                  height: size,
                  backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                  transform: `rotate(${Math.random() * 360}deg)`,
                  boxShadow: '0 0 6px rgba(255,255,255,0.5)',
                }}
              />
            )}
            {shape === 'triangle' && (
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: `${size/2}px solid transparent`,
                  borderRight: `${size/2}px solid transparent`,
                  borderBottom: `${size}px solid ${colors[Math.floor(Math.random() * colors.length)]}`,
                  filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.5))',
                }}
              />
            )}
            {shape === 'star' && (
              <div
                className="text-center leading-none"
                style={{
                  fontSize: size,
                  color: colors[Math.floor(Math.random() * colors.length)],
                  textShadow: '0 0 6px rgba(255,255,255,0.5)',
                }}
              >
                ★
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// 1. COUNTDOWN TIMER WITH NOTIFICATIONS
function CountdownTimer() {
  const [eventDate, setEventDate] = useState('');
  const [eventName, setEventName] = useState('');
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [savedEvents, setSavedEvents] = useState<{ name: string; date: string }[]>([]);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
    const saved = localStorage.getItem('belsh_events');
    if (saved) setSavedEvents(JSON.parse(saved));
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  const sendNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/EVENT_BY_BELSH.jpg',
        badge: '/EVENT_BY_BELSH.jpg',
      });
    }
  };

  useEffect(() => {
    if (!eventDate) return;

    const target = new Date(eventDate).getTime();
    let lastDayNotified = -1;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsComplete(true);
        setShowConfetti(true);
        sendNotification('🎉 Your Event Has Arrived!', `${eventName} is happening now!`);
        setTimeout(() => setShowConfetti(false), 6000);
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
      setIsComplete(false);

      // Send reminder notifications
      if (notificationPermission === 'granted' && days !== lastDayNotified) {
        if (days === 30) {
          sendNotification('📅 30 Days Reminder', `${eventName} is in 30 days!`);
          lastDayNotified = days;
        } else if (days === 7) {
          sendNotification('📅 1 Week Reminder', `${eventName} is in 7 days!`);
          lastDayNotified = days;
        } else if (days === 1) {
          sendNotification('📅 Tomorrow!', `${eventName} is tomorrow!`);
          lastDayNotified = days;
        } else if (days === 0 && hours <= 1) {
          sendNotification('📅 1 Hour Left!', `${eventName} starts in 1 hour!`);
          lastDayNotified = days;
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [eventDate, eventName, notificationPermission]);

  const saveEvent = () => {
    if (eventName && eventDate) {
      const newEvents = [...savedEvents, { name: eventName, date: eventDate }];
      setSavedEvents(newEvents);
      localStorage.setItem('belsh_events', JSON.stringify(newEvents));
    }
  };

  const removeEvent = (index: number) => {
    const newEvents = savedEvents.filter((_, i) => i !== index);
    setSavedEvents(newEvents);
    localStorage.setItem('belsh_events', JSON.stringify(newEvents));
  };

  const timeUnits = countdown
    ? [
        { value: countdown.days, label: 'Days' },
        { value: countdown.hours, label: 'Hours' },
        { value: countdown.minutes, label: 'Minutes' },
        { value: countdown.seconds, label: 'Seconds' },
      ]
    : null;

  return (
    <div className="glass-card gold-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center">
            <Clock size={20} className="text-gold-400" />
          </div>
          <div>
            <h3 className="font-serif text-xl text-purple-100">Event Countdown</h3>
            <p className="text-purple-400 text-sm">Count down to your special day</p>
          </div>
        </div>
        {notificationPermission !== 'granted' && (
          <button
            onClick={requestNotificationPermission}
            className="text-xs px-3 py-2 rounded-lg bg-gold-500/20 border border-gold-500/40 text-gold-400 hover:bg-gold-500/30 transition-colors flex items-center gap-2"
          >
            <Bell size={14} />
            Enable Notifications
          </button>
        )}
      </div>

      {!countdown ? (
        <div className="space-y-4">
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Event Name"
            className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-colors"
          />
          <input
            type="datetime-local"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 text-sm focus:outline-none focus:border-gold-500/50 transition-colors"
          />
          <button onClick={saveEvent} className="btn-gold w-full text-sm">
            Start Countdown
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {eventName && <p className="text-center text-gold-400 text-sm uppercase tracking-widest">{eventName}</p>}

          {isComplete ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-gold-900/40 border border-gold-500/50 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <PartyPopper size={32} className="text-gold-400" />
              </div>
              <p className="font-serif text-2xl text-purple-100 mb-2">The Day Has Arrived!</p>
              <p className="text-purple-400 text-sm">Congratulations on your special event!</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {timeUnits?.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="glass-dark rounded-xl p-3 border border-gold-500/20 hover:border-gold-500/40 transition-colors">
                    <p className="font-serif text-2xl md:text-3xl text-gold-400 mb-1">{value.toString().padStart(2, '0')}</p>
                    <p className="text-purple-400 text-[10px] uppercase tracking-widest">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button onClick={() => { setCountdown(null); setEventDate(''); }} className="text-sm text-purple-400 hover:text-gold-300 transition-colors w-full text-center">
            Reset Countdown
          </button>
        </div>
      )}

      {/* Saved Events */}
      {savedEvents.length > 0 && (
        <div className="mt-6 pt-6 border-t border-dark-border">
          <p className="text-purple-400 text-xs uppercase tracking-widest mb-3">My Events</p>
          <div className="space-y-2">
            {savedEvents.map((event, i) => (
              <div key={i} className="flex items-center justify-between glass-dark rounded-lg p-3">
                <div>
                  <p className="text-purple-100 text-sm">{event.name}</p>
                  <p className="text-purple-400 text-xs">{new Date(event.date).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEventName(event.name); setEventDate(event.date); }} className="text-purple-400 hover:text-gold-400">
                    <Play size={14} />
                  </button>
                  <button onClick={() => removeEvent(i)} className="text-purple-400 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 2. EVENT INVITATION GENERATOR
function InvitationGenerator() {
  const [step, setStep] = useState(1);
  const [invitation, setInvitation] = useState({
    title: 'You Are Invited!',
    event: '',
    date: '',
    time: '',
    venue: '',
    host: '',
    message: '',
    theme: 'elegant',
    primaryColor: '#d4a017',
    photo: '',
  });
  const [showPreview, setShowPreview] = useState(false);

  const themes = [
    { id: 'elegant', name: 'Elegant Gold', colors: ['#d4a017', '#150829'] },
    { id: 'romantic', name: 'Romantic Rose', colors: ['#ff6b9d', '#2d1f3d'] },
    { id: 'modern', name: 'Modern Minimal', colors: ['#ffffff', '#0a0118'] },
    { id: 'traditional', name: 'Traditional', colors: ['#8b4513', '#1a0f05'] },
    { id: 'royal', name: 'Royal Purple', colors: ['#6b21a8', '#0f0520'] },
  ];

  const photoOptions = [
    'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1114425/pexels-photo-1114425.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/29083282/pexels-photo-29083282.jpeg?auto=compress&cs=tinysrgb&w=400',
  ];

  const shareViaWhatsApp = () => {
    const text = `${invitation.title}%0A%0A${invitation.event}%0ADate: ${invitation.date}%0ATime: ${invitation.time}%0AVenue: ${invitation.venue}%0A%0A${invitation.message}%0A%0A- ${invitation.host}`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`You're Invited to ${invitation.event}!`);
    const body = encodeURIComponent(`${invitation.title}\n\n${invitation.event}\nDate: ${invitation.date}\nTime: ${invitation.time}\nVenue: ${invitation.venue}\n\n${invitation.message}\n\n- ${invitation.host}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="glass-card gold-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center">
          <Mail size={20} className="text-gold-400" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-purple-100">Invitation Generator</h3>
          <p className="text-purple-400 text-sm">Create beautiful digital invitations</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-1 rounded-full ${s <= step ? 'bg-gold-500' : 'bg-dark-card'}`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Event Title (e.g., Adeola Wedding Ceremony)"
            value={invitation.event}
            onChange={(e) => setInvitation({ ...invitation, event: e.target.value })}
            className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={invitation.date}
              onChange={(e) => setInvitation({ ...invitation, date: e.target.value })}
              className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 text-sm focus:outline-none focus:border-gold-500/50"
            />
            <input
              type="time"
              value={invitation.time}
              onChange={(e) => setInvitation({ ...invitation, time: e.target.value })}
              className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 text-sm focus:outline-none focus:border-gold-500/50"
            />
          </div>
          <input
            type="text"
            placeholder="Venue"
            value={invitation.venue}
            onChange={(e) => setInvitation({ ...invitation, venue: e.target.value })}
            className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50"
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Host Name"
            value={invitation.host}
            onChange={(e) => setInvitation({ ...invitation, host: e.target.value })}
            className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50"
          />
          <textarea
            placeholder="Personal Message"
            value={invitation.message}
            onChange={(e) => setInvitation({ ...invitation, message: e.target.value })}
            rows={3}
            className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 resize-none"
          />
          <div>
            <p className="text-xs text-purple-400 mb-2">Choose Theme</p>
            <div className="grid grid-cols-5 gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setInvitation({ ...invitation, theme: t.id, primaryColor: t.colors[0] }); }}
                  className={`p-2 rounded-lg border ${invitation.theme === t.id ? 'border-gold-500' : 'border-dark-border'}`}
                >
                  <div className="w-full h-6 rounded" style={{ background: t.colors[0] }} />
                  <p className="text-[10px] text-purple-400 mt-1 truncate">{t.name}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-purple-400 mb-2">Background Photo (Optional)</p>
            <div className="grid grid-cols-4 gap-2">
              {photoOptions.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => setInvitation({ ...invitation, photo })}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${invitation.photo === photo ? 'border-gold-500' : 'border-transparent'}`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover opacity-70" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          {/* Preview */}
          <div
            className="relative aspect-[3/4] rounded-xl overflow-hidden"
            style={{ backgroundColor: themes.find(t => t.id === invitation.theme)?.colors[1] || '#150829' }}
          >
            {invitation.photo && (
              <img src={invitation.photo} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <p className="text-gold-400 text-sm tracking-widest uppercase mb-2">{invitation.title}</p>
              <h2 className="font-serif text-2xl text-white mb-4">{invitation.event || 'Your Event'}</h2>
              <div className="space-y-2">
                <p className="text-white/80 text-sm">{invitation.date}</p>
                <p className="text-white/80 text-sm">{invitation.time}</p>
                <p className="text-white/80 text-sm">{invitation.venue}</p>
              </div>
              {invitation.message && (
                <p className="text-white/60 text-xs mt-4 italic">"{invitation.message}"</p>
              )}
              {invitation.host && (
                <p className="text-gold-400 text-sm mt-4">Hosted by {invitation.host}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={shareViaWhatsApp} className="flex items-center justify-center gap-2 py-3 rounded-lg bg-green-700 hover:bg-green-600 text-white text-sm transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Share via WhatsApp
            </button>
            <button onClick={shareViaEmail} className="flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-sm transition-colors">
              <Mail size={16} />
              Share via Email
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="btn-outline-gold flex-1 text-sm">
            Back
          </button>
        )}
        {step < 3 && (
          <button onClick={() => setStep(step + 1)} className="btn-gold flex-1 text-sm">
            Next
          </button>
        )}
      </div>
    </div>
  );
}

// 3. VENUE FINDER FOR KWARA STATE
const kwaraVenues = [
  { name: 'Kwara Hotel', location: 'Ilorin', capacity: 500, type: ['Wedding', 'Corporate'], image: 'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=400', features: ['AC', 'Parking', 'Catering'] },
  { name: 'Princess Luxury Hotel', location: 'Ilorin', capacity: 800, type: ['Wedding', 'Birthday'], image: 'https://images.pexels.com/photos/1128782/pexels-photo-1128782.jpeg?auto=compress&cs=tinysrgb&w=400', features: ['Pool', 'Garden', 'VIP Lounge'] },
  { name: 'Grand Park Hotel', location: 'Ilorin', capacity: 400, type: ['Corporate', 'Birthday'], image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400', features: ['Conference Room', 'Projector', 'Sound System'] },
  { name: 'Iya Alaro Event Centre', location: 'Ilorin', capacity: 1200, type: ['Wedding', 'Traditional'], image: 'https://images.pexels.com/photos/29083282/pexels-photo-29083282.jpeg?auto=compress&cs=tinysrgb&w=400', features: ['Large Hall', 'Stage', 'Decor Services'] },
  { name: 'Golden Tulip Hotel', location: 'Offa', capacity: 350, type: ['Wedding', 'Corporate'], image: 'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=400', features: ['AC', 'Restaurant', 'Bar'] },
  { name: 'Harmony Event Hall', location: 'Ilorin', capacity: 600, type: ['Birthday', 'Corporate'], image: 'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?auto=compress&cs=tinysrgb&w=400', features: ['Modern Design', 'Parking', 'Security'] },
];

function VenueFinder() {
  const [eventType, setEventType] = useState('All');
  const [guestCount, setGuestCount] = useState('');
  const [location, setLocation] = useState('All');
  const [hoveredVenue, setHoveredVenue] = useState<string | null>(null);

  const filteredVenues = kwaraVenues.filter((v) => {
    if (eventType !== 'All' && !v.type.includes(eventType)) return false;
    if (location !== 'All' && v.location !== location) return false;
    if (guestCount && v.capacity < parseInt(guestCount)) return false;
    return true;
  });

  return (
    <div className="glass-card gold-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center">
          <MapPinned size={20} className="text-gold-400" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-purple-100">Venue Finder</h3>
          <p className="text-purple-400 text-sm">Discover venues in Kwara State</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-purple-100 text-sm focus:outline-none focus:border-gold-500/50"
        >
          <option value="All">All Events</option>
          <option value="Wedding">Wedding</option>
          <option value="Birthday">Birthday</option>
          <option value="Corporate">Corporate</option>
          <option value="Traditional">Traditional</option>
        </select>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-purple-100 text-sm focus:outline-none focus:border-gold-500/50"
        >
          <option value="All">All Locations</option>
          <option value="Ilorin">Ilorin</option>
          <option value="Offa">Offa</option>
        </select>
        <input
          type="number"
          placeholder="Min Guests"
          value={guestCount}
          onChange={(e) => setGuestCount(e.target.value)}
          className="bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredVenues.map((venue) => (
          <div
            key={venue.name}
            onMouseEnter={() => setHoveredVenue(venue.name)}
            onMouseLeave={() => setHoveredVenue(null)}
            className="relative rounded-xl overflow-hidden border border-dark-border hover:border-gold-500/40 transition-all cursor-pointer group"
          >
            <div className="aspect-video relative">
              <img src={venue.image} alt={venue.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="font-serif text-purple-100 text-sm">{venue.name}</p>
                <p className="text-purple-400 text-xs">{venue.location}</p>
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-center gap-2 text-xs text-purple-300 mb-2">
                <Users size={12} />
                <span>Capacity: {venue.capacity}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {venue.features.slice(0, 2).map((f) => (
                  <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-gold-900/30 text-gold-400">{f}</span>
                ))}
              </div>
            </div>
            {hoveredVenue === venue.name && (
              <button
                onClick={() => {
                  const msg = `Hi BELSH Events! I'm interested in ${venue.name} for my upcoming event. Can you provide more details?`;
                  window.open(`https://wa.me/2348035672491?text=${encodeURIComponent(msg)}`, '_blank');
                }}
                className="absolute inset-0 bg-dark/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="btn-gold text-xs">Inquire</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. PLAN MY EVENT WIZARD
function PlanMyEvent() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [plan, setPlan] = useState({
    eventType: '',
    guestCount: '',
    date: '',
    budget: '',
    venue: '',
    style: '',
    meals: '',
    entertainment: '',
  });
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const generatePlan = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
    }, 2000);
  };

  const sharePlan = () => {
    const msg = `Hi BELSH Events! I'd like to plan a ${plan.eventType} for ${plan.guestCount} guests on ${plan.date}. My preferred style is ${plan.style}. Here's my plan: Venue: ${plan.venue}, Entertainment: ${plan.entertainment}, Meals: ${plan.meals}. Can we discuss further?`;
    window.open(`https://wa.me/2348035672491?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="glass-card gold-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center">
          <Wand2 size={20} className="text-gold-400" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-purple-100">Plan My Event</h3>
          <p className="text-purple-400 text-sm">Personalized event planning wizard</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${i + 1 <= step ? 'bg-gold-500 text-dark' : 'bg-dark-card text-purple-400'}`}>
              {i + 1}
            </div>
            {i < totalSteps - 1 && <div className={`flex-1 h-0.5 ${i + 1 < step ? 'bg-gold-500' : 'bg-dark-card'}`} />}
          </div>
        ))}
      </div>

      {!generated ? (
        <div className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-purple-300">What type of event are you planning?</p>
              <div className="grid grid-cols-2 gap-3">
                {['Wedding', 'Birthday', 'Corporate', 'Anniversary', 'Baby Shower', 'Naming Ceremony'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setPlan({ ...plan, eventType: type })}
                    className={`py-3 px-4 rounded-lg text-sm transition-all ${plan.eventType === type ? 'bg-gold-500/20 border border-gold-500 text-gold-400' : 'bg-dark-card border border-dark-border text-purple-300 hover:border-gold-500/40'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-purple-300 mb-2">How many guests do you expect?</p>
                <input
                  type="number"
                  value={plan.guestCount}
                  onChange={(e) => setPlan({ ...plan, guestCount: e.target.value })}
                  placeholder="e.g., 150"
                  className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50"
                />
              </div>
              <div>
                <p className="text-sm text-purple-300 mb-2">When is your event?</p>
                <input
                  type="date"
                  value={plan.date}
                  onChange={(e) => setPlan({ ...plan, date: e.target.value })}
                  className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 text-sm focus:outline-none focus:border-gold-500/50"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-purple-300">What's your preferred venue type?</p>
              <div className="grid grid-cols-2 gap-3">
                {['Indoor Hall', 'Outdoor Garden', 'Hotel Ballroom', 'Traditional Setting', 'Beach/Lakeside', 'Private Residence'].map((venue) => (
                  <button
                    key={venue}
                    onClick={() => setPlan({ ...plan, venue })}
                    className={`py-3 px-4 rounded-lg text-sm transition-all ${plan.venue === venue ? 'bg-gold-500/20 border border-gold-500 text-gold-400' : 'bg-dark-card border border-dark-border text-purple-300 hover:border-gold-500/40'}`}
                  >
                    {venue}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-purple-300">What style do you prefer?</p>
              <div className="grid grid-cols-2 gap-3">
                {['Classic Elegant', 'Modern Minimalist', 'Traditional Nigerian', 'Bohemian', 'Luxury Glam', 'Rustic Charm'].map((style) => (
                  <button
                    key={style}
                    onClick={() => setPlan({ ...plan, style })}
                    className={`py-3 px-4 rounded-lg text-sm transition-all ${plan.style === style ? 'bg-gold-500/20 border border-gold-500 text-gold-400' : 'bg-dark-card border border-dark-border text-purple-300 hover:border-gold-500/40'}`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-purple-300 mb-2">Do you need entertainment?</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Live Band', 'DJ', 'Cultural Performers', 'Comedian/MC'].map((ent) => (
                    <button
                      key={ent}
                      onClick={() => setPlan({ ...plan, entertainment: ent })}
                      className={`py-3 px-4 rounded-lg text-sm transition-all ${plan.entertainment === ent ? 'bg-gold-500/20 border border-gold-500 text-gold-400' : 'bg-dark-card border border-dark-border text-purple-300 hover:border-gold-500/40'}`}
                    >
                      {ent}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-purple-300 mb-2">Meal service preference?</p>
                <div className="grid grid-cols-3 gap-3">
                  {['Buffet', 'Plated', 'Cocktail'].map((meal) => (
                    <button
                      key={meal}
                      onClick={() => setPlan({ ...plan, meals: meal })}
                      className={`py-3 px-4 rounded-lg text-sm transition-all ${plan.meals === meal ? 'bg-gold-500/20 border border-gold-500 text-gold-400' : 'bg-dark-card border border-dark-border text-purple-300 hover:border-gold-500/40'}`}
                    >
                      {meal}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="btn-outline-gold flex-1 text-sm">
                Back
              </button>
            )}
            {step < totalSteps ? (
              <button onClick={() => setStep(step + 1)} className="btn-gold flex-1 text-sm">
                Next
              </button>
            ) : (
              <button onClick={generatePlan} className="btn-gold flex-1 text-sm">
                Generate My Plan
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw size={32} className="text-gold-400 animate-spin mx-auto mb-4" />
              <p className="text-purple-300">Creating your personalized plan...</p>
            </div>
          ) : (
            <>
              <div className="glass-dark rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-gold-400" />
                  <span className="text-sm text-purple-300">Event: <span className="text-purple-100">{plan.eventType}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-gold-400" />
                  <span className="text-sm text-purple-300">Guests: <span className="text-purple-100">{plan.guestCount}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-gold-400" />
                  <span className="text-sm text-purple-300">Date: <span className="text-purple-100">{plan.date}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-gold-400" />
                  <span className="text-sm text-purple-300">Venue: <span className="text-purple-100">{plan.venue}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-gold-400" />
                  <span className="text-sm text-purple-300">Style: <span className="text-purple-100">{plan.style}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-gold-400" />
                  <span className="text-sm text-purple-300">Entertainment: <span className="text-purple-100">{plan.entertainment}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-gold-400" />
                  <span className="text-sm text-purple-300">Meals: <span className="text-purple-100">{plan.meals}</span></span>
                </div>
              </div>

              <button onClick={sharePlan} className="btn-gold w-full text-sm">
                <MessageCircle size={16} />
                Book This Plan on WhatsApp
              </button>

              <button onClick={() => { setStep(1); setGenerated(false); setPlan({ eventType: '', guestCount: '', date: '', budget: '', venue: '', style: '', meals: '', entertainment: '' }); }} className="text-sm text-purple-400 hover:text-gold-300 w-full text-center">
                Start Over
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// 5. RSVP MANAGEMENT
function RSVPManager() {
  const [guests, setGuests] = useState<{ name: string; phone: string; status: 'pending' | 'attending' | 'declined'; meal: string }[]>([]);
  const [newGuest, setNewGuest] = useState({ name: '', phone: '' });
  const [stats, setStats] = useState({ attending: 0, declined: 0, pending: 0 });

  useEffect(() => {
    setStats({
      attending: guests.filter(g => g.status === 'attending').length,
      declined: guests.filter(g => g.status === 'declined').length,
      pending: guests.filter(g => g.status === 'pending').length,
    });
  }, [guests]);

  const addGuest = () => {
    if (newGuest.name && newGuest.phone) {
      setGuests([...guests, { ...newGuest, status: 'pending', meal: '' }]);
      setNewGuest({ name: '', phone: '' });
    }
  };

  const updateStatus = (index: number, status: 'attending' | 'declined' | 'pending') => {
    const updated = [...guests];
    updated[index].status = status;
    setGuests(updated);
  };

  const sendReminder = (phone: string, name: string) => {
    const msg = `Hi ${name}! This is a friendly reminder from BELSH Events. Please confirm your attendance for our upcoming event. Reply with YES or NO.`;
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="glass-card gold-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center">
          <UserCheck size={20} className="text-gold-400" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-purple-100">RSVP Management</h3>
          <p className="text-purple-400 text-sm">Track guest responses in real-time</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center glass-dark rounded-lg p-3">
          <p className="text-2xl text-green-400 font-serif">{stats.attending}</p>
          <p className="text-xs text-purple-400">Attending</p>
        </div>
        <div className="text-center glass-dark rounded-lg p-3">
          <p className="text-2xl text-red-400 font-serif">{stats.declined}</p>
          <p className="text-xs text-purple-400">Declined</p>
        </div>
        <div className="text-center glass-dark rounded-lg p-3">
          <p className="text-2xl text-yellow-400 font-serif">{stats.pending}</p>
          <p className="text-xs text-purple-400">Pending</p>
        </div>
      </div>

      {/* Add Guest */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <input
          type="text"
          placeholder="Guest Name"
          value={newGuest.name}
          onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
          className="bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50"
        />
        <input
          type="tel"
          placeholder="Phone (e.g., +234...)"
          value={newGuest.phone}
          onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
          className="bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50"
        />
      </div>
      <button onClick={addGuest} className="btn-gold w-full text-sm mb-6">
        <Plus size={14} />
        Add Guest
      </button>

      {/* Guest List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {guests.map((guest, i) => (
          <div key={i} className="flex items-center justify-between glass-dark rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${guest.status === 'attending' ? 'bg-green-400' : guest.status === 'declined' ? 'bg-red-400' : 'bg-yellow-400'}`} />
              <div>
                <p className="text-purple-100 text-sm">{guest.name}</p>
                <p className="text-purple-400 text-xs">{guest.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={guest.status}
                onChange={(e) => updateStatus(i, e.target.value as any)}
                className="bg-dark-card border border-dark-border rounded px-2 py-1 text-xs text-purple-100 focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="attending">Attending</option>
                <option value="declined">Declined</option>
              </select>
              <button onClick={() => sendReminder(guest.phone, guest.name)} className="text-purple-400 hover:text-gold-400">
                <MessageCircle size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. EVENT MEMORY WALL
function MemoryWall() {
  const [memories, setMemories] = useState<{ name: string; message: string; photo: string }[]>([]);
  const [newMemory, setNewMemory] = useState({ name: '', message: '' });
  const [activeFilter, setActiveFilter] = useState('all');

  const sampleMemories = [
    { name: 'Adeola Family', message: 'What an amazing celebration! Thank you BELSH Events!', photo: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'The Okoyes', message: 'Our dream wedding came true. Forever grateful!', photo: 'https://images.pexels.com/photos/1114425/pexels-photo-1114425.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Chidinma', message: 'Best birthday ever! The decor was stunning.', photo: 'https://images.pexels.com/photos/33748012/pexels-photo-33748012.jpeg?auto=compress&cs=tinysrgb&w=300' },
  ];

  useEffect(() => {
    setMemories(sampleMemories);
  }, []);

  const addMemory = () => {
    if (newMemory.name && newMemory.message) {
      setMemories([...memories, { ...newMemory, photo: '' }]);
      setNewMemory({ name: '', message: '' });
    }
  };

  return (
    <div className="glass-card gold-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center">
          <GalleryVerticalEnd size={20} className="text-gold-400" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-purple-100">Memory Wall</h3>
          <p className="text-purple-400 text-sm">Share your event memories</p>
        </div>
      </div>

      {/* Add Memory */}
      <div className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Your Name"
          value={newMemory.name}
          onChange={(e) => setNewMemory({ ...newMemory, name: e.target.value })}
          className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50"
        />
        <textarea
          placeholder="Share your memory..."
          value={newMemory.message}
          onChange={(e) => setNewMemory({ ...newMemory, message: e.target.value })}
          rows={2}
          className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 resize-none"
        />
        <button onClick={addMemory} className="btn-gold w-full text-sm">
          <Plus size={14} />
          Add Memory
        </button>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-2 gap-3">
        {memories.map((memory, i) => (
          <div key={i} className="glass-dark rounded-xl p-3 group hover:border-gold-500/40 transition-all">
            {memory.photo && (
              <img src={memory.photo} alt="" className="w-full h-24 object-cover rounded-lg mb-2 opacity-70" />
            )}
            <p className="text-purple-100 text-sm mb-1">{memory.name}</p>
            <p className="text-purple-400 text-xs line-clamp-2">{memory.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 7. VIP CLIENT PORTAL
function VIPPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: 'Premium Client', tier: 'Gold' });

  const exclusiveOffers = [
    { title: 'Priority Booking', desc: 'Book your dates before anyone else', icon: Crown },
    { title: 'Private Consultation', desc: '1-on-1 session with our lead planner', icon: Calendar },
    { title: 'Exclusive Discounts', desc: 'Special rates on premium packages', icon: Gift },
    { title: 'VIP Support', desc: '24/7 dedicated support line', icon: Phone },
  ];

  return (
    <div className="glass-card gold-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center">
          <Crown size={20} className="text-gold-400" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-purple-100">VIP Client Portal</h3>
          <p className="text-purple-400 text-sm">Exclusive benefits for premium clients</p>
        </div>
      </div>

      {!isLoggedIn ? (
        <div className="text-center py-8">
          <Crown size={48} className="text-gold-400 mx-auto mb-4 opacity-50" />
          <p className="text-purple-300 mb-4">Access exclusive tools and benefits</p>
          <button onClick={() => setIsLoggedIn(true)} className="btn-gold text-sm">
            Request VIP Access
          </button>
          <p className="text-purple-500 text-xs mt-3">Contact us to become a VIP client</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-3 glass-dark rounded-lg p-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center">
              <Crown size={20} className="text-dark" />
            </div>
            <div>
              <p className="text-purple-100 font-medium">{user.name}</p>
              <p className="text-gold-400 text-xs uppercase tracking-widest">{user.tier} Member</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {exclusiveOffers.map(({ title, desc, icon: Icon }) => (
              <div key={title} className="glass-dark rounded-lg p-3 hover:border-gold-500/40 transition-colors">
                <Icon size={20} className="text-gold-400 mb-2" />
                <p className="text-purple-100 text-sm">{title}</p>
                <p className="text-purple-400 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 8. AI EVENT PLANNER (Speech, Program, Highlights)
function AIEventPlanner() {
  const [activeTab, setActiveTab] = useState<'speech' | 'program' | 'highlights'>('speech');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState('');
  const [input, setInput] = useState({ eventType: '', names: '', tone: 'formal' });

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      if (activeTab === 'speech') {
        setGenerated(`Dear family and friends,

Welcome to this beautiful ${input.eventType} celebration!

${input.names ? `To ${input.names}, may your journey together be filled with love, joy, and countless blessings.` : 'May this day bring you endless happiness and cherished memories.'}

Today marks the beginning of a new chapter. As we gather here, let us celebrate love, unity, and the bonds that bring us together.

I raise my glass to love, laughter, and a lifetime of happiness. Cheers!`);
      } else if (activeTab === 'program') {
        setGenerated(`EVENT PROGRAM

12:00 PM - Guest Arrival & Registration
12:30 PM - Opening Ceremony & Welcome Address
1:00 PM - Cultural Performance
1:30 PM - Main Event Ceremony
2:30 PM - Photo Session
3:00 PM - Cake Cutting & Toasts
3:30 PM - Entertainment & Dance
5:00 PM - Closing Remarks & Departure

Note: Times are flexible and can be adjusted based on your preferences.`);
      } else {
        setGenerated(`EVENT HIGHLIGHT REEL CONCEPT

Opening Scene: Aerial shot of venue
Duration: 5 seconds

Scene 1: Guest arrivals and candid moments
Duration: 15 seconds

Scene 2: Main ceremony highlights
Duration: 20 seconds

Scene 3: Emotional moments (tears, laughter)
Duration: 10 seconds

Scene 4: Dance floor energy
Duration: 15 seconds

Closing: Slow-motion confetti and celebration
Duration: 5 seconds

Total Runtime: ~70 seconds
Music: Upbeat Afro-pop with emotional crescendo`);
      }
      setGenerating(false);
    }, 2000);
  };

  return (
    <div className="glass-card gold-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center">
          <Sparkles size={20} className="text-gold-400" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-purple-100">AI Event Planner</h3>
          <p className="text-purple-400 text-sm">Generate speeches, programs & concepts</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['speech', 'program', 'highlights'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setGenerated(''); }}
            className={`flex-1 py-2 rounded-lg text-xs uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-gold-500/20 border border-gold-500/40 text-gold-400' : 'bg-dark-card border border-dark-border text-purple-400 hover:border-gold-500/30'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="space-y-3 mb-4">
        <input
          type="text"
          placeholder="Event Type (e.g., Wedding, Birthday)"
          value={input.eventType}
          onChange={(e) => setInput({ ...input, eventType: e.target.value })}
          className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50"
        />
        {activeTab === 'speech' && (
          <input
            type="text"
            placeholder="Names (e.g., Tunde & Funke)"
            value={input.names}
            onChange={(e) => setInput({ ...input, names: e.target.value })}
            className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50"
          />
        )}
      </div>

      <button onClick={generate} className="btn-gold w-full text-sm mb-4" disabled={generating}>
        {generating ? (
          <span className="flex items-center gap-2">
            <RefreshCw size={14} className="animate-spin" />
            Generating...
          </span>
        ) : (
          <>
            <Sparkles size={14} />
            Generate {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </>
        )}
      </button>

      {/* Output */}
      {generated && (
        <div className="glass-dark rounded-lg p-4">
          <pre className="text-purple-200 text-sm whitespace-pre-wrap font-sans">{generated}</pre>
          <div className="flex gap-2 mt-4">
            <button onClick={() => navigator.clipboard.writeText(generated)} className="flex-1 btn-outline-gold text-xs flex items-center justify-center gap-2">
              <Copy size={12} />
              Copy
            </button>
            <button onClick={() => {
              const msg = `Hi BELSH! I generated this ${activeTab}: ${generated.substring(0, 200)}... Can we use this for my event?`;
              window.open(`https://wa.me/2348035672491?text=${encodeURIComponent(msg)}`, '_blank');
            }} className="flex-1 btn-gold text-xs flex items-center justify-center gap-2">
              <MessageCircle size={12} />
              Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// MAIN COMPONENT
export default function PremiumFeatures({ onNavigate }: PremiumFeaturesProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeSection, setActiveSection] = useState('countdown');

  useEffect(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  }, []);

  const sections = [
    { id: 'countdown', label: 'Countdown', icon: Clock },
    { id: 'invitation', label: 'Invitations', icon: Mail },
    { id: 'venue', label: 'Venues', icon: MapPinned },
    { id: 'planner', label: 'Plan Event', icon: Wand2 },
    { id: 'rsvp', label: 'RSVP', icon: UserCheck },
    { id: 'memory', label: 'Memories', icon: GalleryVerticalEnd },
    { id: 'vip', label: 'VIP', icon: Crown },
    { id: 'ai', label: 'AI Tools', icon: Sparkles },
  ];

  const navigate = (page: Page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <Confetti active={showConfetti} />

      {/* Hero */}
      <section className="page-hero text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(85,33,160,0.4)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4 opacity-0 animate-fade-in-up">Event Planning Suite</p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-purple-100 mb-4 opacity-0 animate-fade-in-up-2 leading-tight">
            Premium <span className="italic gold-text">Tools</span>
          </h1>
          <div className="section-divider" />
          <p className="text-purple-300/80 text-base sm:text-lg max-w-xl mx-auto mt-4 opacity-0 animate-fade-in-up-3">
            Your all-in-one event planning ecosystem. Count down, create invitations, find venues, and manage guests.
          </p>
        </div>
      </section>

      {/* Section Navigation */}
      <section className="sticky top-16 md:top-20 z-40 bg-dark/90 backdrop-blur-md border-b border-dark-border py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeSection === id
                    ? 'bg-gold-500/20 border border-gold-500/40 text-gold-400'
                    : 'bg-dark-card border border-dark-border text-purple-300 hover:border-gold-500/30'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {activeSection === 'countdown' && <CountdownTimer />}
            {activeSection === 'countdown' && <InvitationGenerator />}
            {activeSection === 'invitation' && <InvitationGenerator />}
            {activeSection === 'invitation' && <VenueFinder />}
            {activeSection === 'venue' && <VenueFinder />}
            {activeSection === 'venue' && <PlanMyEvent />}
            {activeSection === 'planner' && <PlanMyEvent />}
            {activeSection === 'planner' && <RSVPManager />}
            {activeSection === 'rsvp' && <RSVPManager />}
            {activeSection === 'rsvp' && <MemoryWall />}
            {activeSection === 'memory' && <MemoryWall />}
            {activeSection === 'memory' && <VIPPortal />}
            {activeSection === 'vip' && <VIPPortal />}
            {activeSection === 'vip' && <AIEventPlanner />}
            {activeSection === 'ai' && <AIEventPlanner />}
            {activeSection === 'ai' && <CountdownTimer />}
          </div>
        </div>
      </section>

      {/* Social CTA */}
      <section className="py-12 bg-purple-800/30 border-t border-dark-border text-center">
        <div className="max-w-xl mx-auto px-6">
          <p className="text-purple-300 text-sm mb-4">Interested in our Ready-to-Wear services?</p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-700/50 to-gold-700/50 border border-gold-500/30 hover:border-gold-500/60 transition-all"
          >
            <Instagram size={20} className="text-gold-400" />
            <div className="text-left">
              <p className="text-gold-400 text-sm font-medium">@rtw_by_belsh</p>
              <p className="text-purple-400 text-xs">Follow us or contact on Instagram</p>
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}
