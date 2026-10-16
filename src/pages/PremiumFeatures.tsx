import { useState, useEffect, useRef } from 'react';
import {
  Calendar, Users, Sparkles, Camera, Heart, Clock,
  CheckCircle, Bell, Gift, Crown, Wand2,
  MessageCircle, Plus, Trash2, Mail, Phone,
  PartyPopper, UserCheck, GalleryVerticalEnd,
  RefreshCw, Play, Image, Upload, X, Star,
  Wallet, MapPin, Utensils, Palette, Music, Lightbulb
} from 'lucide-react';
import Confetti from '../components/Confetti';
import FloatingDots from '../components/FloatingDots';
import { supabase, type Memory, type RsvpGuest, type CountdownEvent } from '../lib/supabase';

type Page = 'home' | 'services' | 'portfolio' | 'about' | 'faq' | 'contact' | 'premium' | 'eventai';

interface PremiumFeaturesProps {
  onNavigate: (page: Page) => void;
}

const WHATSAPP_URL = 'https://wa.me/2348035672491?text=Hi%20BELSH!%20I%27d%20like%20to%20inquire%20about%20planning%20my%20event.';
const INSTAGRAM_URL = 'https://www.instagram.com/rtw_by_belsh';

// 1. COUNTDOWN TIMER WITH NOTIFICATIONS
function getStoredCountdown(): { name: string; target: number } | null {
  const stored = localStorage.getItem('belsh-active-countdown');
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored) as Partial<{ name: string; target: number }>;
    if (typeof parsed.name === 'string' && typeof parsed.target === 'number') return parsed as { name: string; target: number };
  } catch {
    localStorage.removeItem('belsh-active-countdown');
  }

  return null;
}

function CountdownTimer() {
  const [storedCountdown] = useState(() => getStoredCountdown());
  const [eventDate, setEventDate] = useState(() => storedCountdown ? new Date(storedCountdown.target).toISOString().slice(0, 16) : '');
  const [eventName, setEventName] = useState(() => storedCountdown?.name ?? '');
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [savedEvents, setSavedEvents] = useState<CountdownEvent[]>([]);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
    supabase.from('countdown_events').select('*').order('event_date', { ascending: true }).then(({ data }) => {
      if (data) setSavedEvents(data as CountdownEvent[]);
    });
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

  const saveEvent = async () => {
    if (eventName && eventDate) {
      if ('Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
      }
      const target = new Date(eventDate).getTime();
      localStorage.setItem('belsh-active-countdown', JSON.stringify({ name: eventName, target }));
      window.dispatchEvent(new Event('belsh-countdown-updated'));
      const { data } = await supabase.from('countdown_events').insert({ name: eventName, event_date: new Date(eventDate).toISOString() }).select();
      if (data) setSavedEvents([...savedEvents, data[0] as CountdownEvent]);
    }
  };

  const removeEvent = (id: string) => {
    supabase.from('countdown_events').delete().eq('id', id);
    setSavedEvents(savedEvents.filter(e => e.id !== id));
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
    <div className="glass-card gold-border rounded-2xl p-6 relative overflow-hidden animate-fade-in-up">
      <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent pointer-events-none" />
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center animate-icon-bounce">
            <Clock size={20} className="text-gold-400" />
          </div>
          <div>
            <h3 className="font-serif text-xl text-white">Event Countdown</h3>
            <p className="text-white/70 text-sm">Count down to your special day</p>
          </div>
        </div>
        {notificationPermission !== 'granted' && (
          <button
            onClick={requestNotificationPermission}
            className="text-xs px-3 py-2 rounded-lg bg-gold-500/20 border border-gold-500/40 text-gold-400 hover:bg-gold-500/30 transition-all flex items-center gap-2 hover:scale-105"
          >
            <Bell size={14} />
            Enable Notifications
          </button>
        )}
      </div>

      {!countdown ? (
        <div className="space-y-4 relative z-10">
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Event Name"
            className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
          />
          <input
            type="datetime-local"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-500/50 transition-all"
          />
          <button onClick={saveEvent} className="btn-gold w-full text-sm hover:scale-[1.02] transition-transform">
            Start Countdown
          </button>
        </div>
      ) : (
        <div className="space-y-6 relative z-10">
          {eventName && <p className="text-center text-gold-400 text-sm uppercase tracking-widest animate-pulse">{eventName}</p>}

          {isComplete ? (
            <div className="text-center py-8 animate-bounce-in">
              <div className="w-16 h-16 rounded-full bg-gold-900/40 border border-gold-500/50 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <PartyPopper size={32} className="text-gold-400" />
              </div>
              <p className="font-serif text-2xl text-white mb-2">The Day Has Arrived!</p>
              <p className="text-white/70 text-sm">Congratulations on your special event!</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {timeUnits?.map(({ value, label }, i) => (
                <div key={label} className="text-center animate-pop-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="glass-dark rounded-xl p-3 border border-gold-500/20 hover:border-gold-500/40 transition-all hover:scale-105 hover:shadow-lg hover:shadow-gold-500/10">
                    <p className="font-serif text-2xl md:text-3xl text-gold-400 mb-1">{value.toString().padStart(2, '0')}</p>
                    <p className="text-white/70 text-[10px] uppercase tracking-widest">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button onClick={() => {
            localStorage.removeItem('belsh-active-countdown');
            window.dispatchEvent(new Event('belsh-countdown-updated'));
            setCountdown(null);
            setEventDate('');
            setEventName('');
          }} className="text-sm text-white/70 hover:text-gold-300 transition-colors w-full text-center">
            Reset Countdown
          </button>
        </div>
      )}

      {savedEvents.length > 0 && (
        <div className="mt-6 pt-6 border-t border-dark-border relative z-10">
          <p className="text-white/70 text-xs uppercase tracking-widest mb-3">My Events</p>
          <div className="space-y-2">
            {savedEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between glass-dark rounded-lg p-3 hover:border-gold-500/30 transition-all group">
                <div>
                  <p className="text-white text-sm">{event.name}</p>
                  <p className="text-white/70 text-xs">{new Date(event.event_date).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEventName(event.name); setEventDate(new Date(event.event_date).toISOString().slice(0, 16)); }} className="text-white/70 hover:text-gold-400">
                    <Play size={14} />
                  </button>
                  <button onClick={() => removeEvent(event.id)} className="text-white/70 hover:text-red-400">
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

// 2. EVENT INVITATION GENERATOR WITH TEMPLATES & DOWNLOAD
function InvitationGenerator() {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [invitation, setInvitation] = useState({
    title: 'You Are Invited!',
    event: '',
    date: '',
    time: '',
    venue: '',
    host: '',
    message: '',
    dressCode: '',
    rsvpContact: '',
    theme: 'elegant',
    primaryColor: '#d4a017',
    photo: '',
    style: 'classic',
  });
  const [customBg, setCustomBg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const templates = [
    { id: 'wedding', name: 'Wedding', icon: Heart, preview: 'Elegant wedding invitation with romantic details' },
    { id: 'birthday', name: 'Birthday', icon: PartyPopper, preview: 'Fun and colorful birthday celebration' },
    { id: 'corporate', name: 'Corporate', icon: Gift, preview: 'Professional and sophisticated business event' },
    { id: 'traditional', name: 'Traditional', icon: Crown, preview: 'Cultural celebration with traditional styling' },
    { id: 'baby', name: 'Baby Shower', icon: Sparkles, preview: 'Soft and sweet baby shower invitation' },
    { id: 'engagement', name: 'Engagement', icon: Star, preview: 'Romantic engagement party invitation' },
    { id: 'bridal', name: 'Bridal Shower', icon: Heart, preview: 'Intimate bridal shower celebration' },
    { id: 'naming', name: 'Naming Ceremony', icon: Sparkles, preview: 'Joyful child naming celebration' },
    { id: 'burial', name: 'Memorial Service', icon: Crown, preview: 'Dignified memorial and celebration of life' },
  ];

  const themes = [
    { id: 'elegant', name: 'Elegant Gold', colors: ['#d4a017', '#150829'] },
    { id: 'romantic', name: 'Romantic Rose', colors: ['#ff6b9d', '#2d1f3d'] },
    { id: 'modern', name: 'Modern Minimal', colors: ['#ffffff', '#0a0118'] },
    { id: 'traditional', name: 'Traditional', colors: ['#8b4513', '#1a0f05'] },
    { id: 'royal', name: 'Royal Purple', colors: ['#6b21a8', '#0f0520'] },
  ];

  const styles = [
    { id: 'classic', name: 'Classic Centered', desc: 'Centered layout with event details below' },
    { id: 'modern', name: 'Modern Split', desc: 'Left-aligned title with right-aligned details' },
    { id: 'minimal', name: 'Minimal', desc: 'Clean design with essential info only' },
    { id: 'floral', name: 'Floral Frame', desc: 'Decorative border around content' },
    { id: 'bold', name: 'Bold Statement', desc: 'Large typography, minimal design' },
  ];

  const photoOptions = [
    'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1114425/pexels-photo-1114425.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/29083282/pexels-photo-29083282.jpeg?auto=compress&cs=tinysrgb&w=400',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomBg(reader.result as string);
        setInvitation({ ...invitation, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const shareViaWhatsApp = () => {
    const text = `${invitation.title}%0A%0A${invitation.event}%0ADate: ${invitation.date}%0ATime: ${invitation.time}%0AVenue: ${invitation.venue}%0A${invitation.dressCode ? `Dress Code: ${invitation.dressCode}%0A` : ''}${invitation.rsvpContact ? `RSVP: ${invitation.rsvpContact}%0A` : ''}%0A${invitation.message}%0A%0A- ${invitation.host}`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`You're Invited to ${invitation.event}!`);
    const body = encodeURIComponent(`${invitation.title}\n\n${invitation.event}\nDate: ${invitation.date}\nTime: ${invitation.time}\nVenue: ${invitation.venue}\n${invitation.dressCode ? `Dress Code: ${invitation.dressCode}\n` : ''}${invitation.rsvpContact ? `RSVP: ${invitation.rsvpContact}\n` : ''}\n${invitation.message}\n\n- ${invitation.host}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const downloadInvitation = async () => {
    if (!previewRef.current) return;

    // Create canvas for download
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 1000;

    // Draw background
    const theme = themes.find(t => t.id === invitation.theme);
    const accent = invitation.primaryColor || theme?.colors[0] || '#d4a017';
    const bgColor = theme?.colors[1] || '#150829';

    // Draw background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, bgColor);
    grad.addColorStop(1, accent + '22');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const drawInvitationText = () => {
      ctx.textAlign = 'center';
      ctx.fillStyle = accent;
      ctx.font = '24px Georgia, serif';
      ctx.fillText(invitation.title.toUpperCase(), canvas.width / 2, 300);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Georgia, serif';
      ctx.fillText(invitation.event || 'Your Event', canvas.width / 2, 400);

      ctx.font = '24px sans-serif';
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText(invitation.date, canvas.width / 2, 500);
      ctx.fillText(invitation.time, canvas.width / 2, 550);
      ctx.fillText(invitation.venue, canvas.width / 2, 600);

      if (invitation.message) {
        ctx.font = 'italic 18px Georgia, serif';
        ctx.fillStyle = '#cccccc';
        wrapText(ctx, `"${invitation.message}"`, canvas.width / 2, 700, canvas.width - 100, 25);
      }

      if (invitation.host) {
        ctx.font = '20px sans-serif';
        ctx.fillStyle = accent;
        ctx.fillText(`Hosted by ${invitation.host}`, canvas.width / 2, 850);
      }

      if (invitation.dressCode) {
        ctx.font = '18px sans-serif';
        ctx.fillStyle = '#bbbbbb';
        ctx.fillText(`Dress Code: ${invitation.dressCode}`, canvas.width / 2, 890);
      }

      if (invitation.rsvpContact) {
        ctx.font = '18px sans-serif';
        ctx.fillStyle = '#bbbbbb';
        ctx.fillText(`RSVP: ${invitation.rsvpContact}`, canvas.width / 2, 920);
      }

      // Download
      const link = document.createElement('a');
      link.download = `invitation-${invitation.event || 'event'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    // Draw background image if exists
    if (invitation.photo) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = invitation.photo;
      return new Promise<void>((resolve) => {
        img.onload = () => {
          ctx.globalAlpha = 0.3;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = 1;
          drawInvitationText();
          resolve();
        };
        img.onerror = () => { drawInvitationText(); resolve(); };
      });
    } else {
      drawInvitationText();
    }
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line !== '') {
        ctx.fillText(line, x, y);
        line = word + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  };

  const activeBackground = customBg || invitation.photo;

  const activeTheme = themes.find(t => t.id === invitation.theme);

  return (
    <div className="glass-card gold-border rounded-2xl p-6 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '150ms' }}>
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent pointer-events-none" />
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center animate-icon-wiggle">
          <Mail size={20} className="text-gold-400" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-white">Invitation Generator</h3>
          <p className="text-white/70 text-sm">Create, customize & download invitations</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-6 relative z-10">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`flex-1 h-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-gold-500 scale-y-110' : 'bg-dark-card'}`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4 relative z-10 animate-slide-in-right">
          <p className="text-xs text-white/70 mb-2">Choose a Template</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {templates.map(({ id, name, icon: Icon, preview }) => (
              <button
                key={id}
                onClick={() => setSelectedTemplate(id)}
                className={`p-4 rounded-xl border transition-all hover:scale-[1.02] ${
                  selectedTemplate === id
                    ? 'border-gold-500 bg-gold-500/10 shadow-lg shadow-gold-500/20'
                    : 'border-dark-border bg-dark-card hover:border-gold-500/40'
                }`}
              >
                <Icon size={24} className={`mb-2 ${selectedTemplate === id ? 'text-gold-400' : 'text-white/70'}`} />
                <p className="text-sm text-white font-medium">{name}</p>
                <p className="text-[10px] text-white/70 mt-1">{preview}</p>
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Event Title (e.g., Adeola Wedding Ceremony)"
            value={invitation.event}
            onChange={(e) => setInvitation({ ...invitation, event: e.target.value })}
            className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-all mt-4"
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 relative z-10 animate-slide-in-right">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={invitation.date}
              onChange={(e) => setInvitation({ ...invitation, date: e.target.value })}
              className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-500/50 transition-all"
            />
            <input
              type="time"
              value={invitation.time}
              onChange={(e) => setInvitation({ ...invitation, time: e.target.value })}
              className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-500/50 transition-all"
            />
          </div>
          <input
            type="text"
            placeholder="Venue (e.g., Government House, Ilorin)"
            value={invitation.venue}
            onChange={(e) => setInvitation({ ...invitation, venue: e.target.value })}
            className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
          />
          <input
            type="text"
            placeholder="Host Name(s)"
            value={invitation.host}
            onChange={(e) => setInvitation({ ...invitation, host: e.target.value })}
            className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Dress Code (e.g., Gold & Ivory)"
              value={invitation.dressCode}
              onChange={(e) => setInvitation({ ...invitation, dressCode: e.target.value })}
              className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
            />
            <input
              type="text"
              placeholder="RSVP Contact (e.g., 0803 123 4567)"
              value={invitation.rsvpContact}
              onChange={(e) => setInvitation({ ...invitation, rsvpContact: e.target.value })}
              className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
            />
          </div>
          <textarea
            placeholder="Personal Message (Optional)"
            value={invitation.message}
            onChange={(e) => setInvitation({ ...invitation, message: e.target.value })}
            rows={2}
            className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 resize-none transition-all"
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 relative z-10 animate-slide-in-right">
          {/* Style */}
          <div>
            <p className="text-xs text-white/70 mb-2">Layout Style</p>
            <div className="space-y-2">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setInvitation({ ...invitation, style: s.id })}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    invitation.style === s.id
                      ? 'border-gold-500 bg-gold-500/10'
                      : 'border-dark-border bg-dark-card hover:border-gold-500/30'
                  }`}
                >
                  <p className="text-sm text-white">{s.name}</p>
                  <p className="text-[10px] text-white/70">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <p className="text-xs text-white/70 mb-2">Color Theme</p>
            <div className="grid grid-cols-5 gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setInvitation({ ...invitation, theme: t.id, primaryColor: t.colors[0] }); }}
                  className={`p-2 rounded-lg border transition-all hover:scale-105 ${invitation.theme === t.id ? 'border-gold-500 ring-2 ring-gold-500/30' : 'border-dark-border'}`}
                >
                  <div className="w-full h-6 rounded" style={{ background: t.colors[0] }} />
                  <p className="text-[10px] text-white/70 mt-1 truncate">{t.name}</p>
                </button>
              ))}
            </div>
            {/* Custom color picker */}
            <div className="mt-3 flex items-center gap-3">
              <p className="text-[10px] text-white/70">Or pick custom:</p>
              <input
                type="color"
                value={invitation.primaryColor}
                onChange={(e) => setInvitation({ ...invitation, primaryColor: e.target.value, theme: 'custom' })}
                className="w-8 h-8 rounded cursor-pointer bg-transparent border border-dark-border"
              />
              <span className="text-[10px] text-white/50 font-mono">{invitation.primaryColor}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-white/70 mb-2">Background Photo</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full glass-dark rounded-lg p-4 border-2 border-dashed border-gold-500/30 hover:border-gold-500/60 transition-all flex flex-col items-center justify-center gap-2 mb-3 hover:bg-gold-500/5"
            >
              <Upload size={24} className="text-gold-400" />
              <p className="text-white/80 text-xs">Upload Your Own Background</p>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            {customBg && (
              <div className="relative mb-3 rounded-lg overflow-hidden">
                <img src={customBg} alt="Custom background" className="w-full h-20 object-cover opacity-70" />
                <button
                  onClick={() => { setCustomBg(null); setInvitation({ ...invitation, photo: '' }); }}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center"
                >
                  <X size={12} className="text-white" />
                </button>
              </div>
            )}
            <p className="text-[10px] text-white0 text-center mb-2">Or choose preset:</p>
            <div className="grid grid-cols-4 gap-2">
              {photoOptions.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => { setCustomBg(null); setInvitation({ ...invitation, photo }); }}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${invitation.photo === photo && !customBg ? 'border-gold-500 ring-2 ring-gold-500/30' : 'border-transparent'}`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover opacity-70" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4 relative z-10 animate-slide-in-right">
          {/* Preview */}
          <div
            ref={previewRef}
            className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl transition-shadow duration-500"
            style={{ backgroundColor: activeTheme?.colors[1] || '#150829' }}
          >
            {activeBackground && (
              <img src={activeBackground} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            )}

            {/* Accent color overlay from theme */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(135deg, transparent 0%, ${invitation.primaryColor}10 50%, transparent 100%)` }} />

            {/* Style-based layouts */}
            <div className="absolute inset-0 p-6" style={{ color: invitation.primaryColor }}>
              {invitation.style === 'classic' && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="text-sm tracking-widest uppercase mb-2" style={{ color: invitation.primaryColor }}>{invitation.title}</p>
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
                    <p className="text-sm mt-4" style={{ color: invitation.primaryColor }}>Hosted by {invitation.host}</p>
                  )}
                  {invitation.dressCode && (
                    <p className="text-white/60 text-xs mt-2">Dress Code: {invitation.dressCode}</p>
                  )}
                  {invitation.rsvpContact && (
                    <p className="text-white/60 text-xs mt-1">RSVP: {invitation.rsvpContact}</p>
                  )}
                </div>
              )}

              {invitation.style === 'modern' && (
                <div className="h-full flex">
                  <div className="flex-1 flex flex-col justify-center text-left">
                    <p className="text-xs tracking-widest uppercase mb-2" style={{ color: invitation.primaryColor }}>{invitation.title}</p>
                    <h2 className="font-serif text-3xl text-white">{invitation.event || 'Your Event'}</h2>
                  </div>
                  <div className="flex-1 flex flex-col justify-center items-end text-right">
                    <p className="text-white/80 text-sm mb-1">{invitation.date}</p>
                    <p className="text-white/80 text-sm mb-1">{invitation.time}</p>
                    <p className="text-white/80 text-sm">{invitation.venue}</p>
                    {invitation.host && (
                      <p className="text-xs mt-4" style={{ color: invitation.primaryColor }}>- {invitation.host}</p>
                    )}
                    {invitation.dressCode && (
                      <p className="text-white/60 text-[10px] mt-1">Dress: {invitation.dressCode}</p>
                    )}
                    {invitation.rsvpContact && (
                      <p className="text-white/60 text-[10px] mt-1">RSVP: {invitation.rsvpContact}</p>
                    )}
                  </div>
                </div>
              )}

              {invitation.style === 'minimal' && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <h2 className="font-serif text-3xl text-white mb-6">{invitation.event || 'Your Event'}</h2>
                  <div className="w-16 h-px mb-6" style={{ background: `${invitation.primaryColor}80` }} />
                  <div className="text-white/80 text-sm space-y-1">
                    <p>{invitation.date} | {invitation.time}</p>
                    <p>{invitation.venue}</p>
                  </div>
                </div>
              )}

              {invitation.style === 'floral' && (
                <div className="h-full flex flex-col items-center justify-center text-center border-2 m-4 rounded-xl p-4" style={{ borderColor: `${invitation.primaryColor}50` }}>
                  <div className="absolute top-2 left-2 text-2xl" style={{ color: `${invitation.primaryColor}80` }}>❀</div>
                  <div className="absolute top-2 right-2 text-2xl" style={{ color: `${invitation.primaryColor}80` }}>❀</div>
                  <div className="absolute bottom-2 left-2 text-2xl" style={{ color: `${invitation.primaryColor}80` }}>❀</div>
                  <div className="absolute bottom-2 right-2 text-2xl" style={{ color: `${invitation.primaryColor}80` }}>❀</div>
                  <p className="text-xs tracking-widest uppercase mb-2" style={{ color: invitation.primaryColor }}>{invitation.title}</p>
                  <h2 className="font-serif text-2xl text-white mb-4">{invitation.event || 'Your Event'}</h2>
                  <div className="space-y-2">
                    <p className="text-white/80 text-sm">{invitation.date}</p>
                    <p className="text-white/80 text-sm">{invitation.time}</p>
                    <p className="text-white/80 text-sm">{invitation.venue}</p>
                  </div>
                  {invitation.host && (
                    <p className="text-xs mt-4" style={{ color: invitation.primaryColor }}>~ {invitation.host}</p>
                  )}
                  {invitation.dressCode && (
                    <p className="text-white/60 text-[10px] mt-1">Dress Code: {invitation.dressCode}</p>
                  )}
                  {invitation.rsvpContact && (
                    <p className="text-white/60 text-[10px] mt-1">RSVP: {invitation.rsvpContact}</p>
                  )}
                </div>
              )}

              {invitation.style === 'bold' && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <h2 className="font-serif text-5xl text-white mb-6 leading-tight">{invitation.event || 'Your Event'}</h2>
                  <p className="text-lg tracking-widest uppercase" style={{ color: invitation.primaryColor }}>{invitation.date}</p>
                  <p className="text-white/60 text-sm mt-2">{invitation.venue}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={downloadInvitation}
              className="flex items-center justify-center gap-2 py-3 rounded-lg bg-gold-600 hover:bg-gold-500 text-dark text-sm font-medium transition-all hover:scale-[1.02]"
            >
              <Camera size={14} />
              Download
            </button>
            <button
              onClick={shareViaWhatsApp}
              className="flex items-center justify-center gap-2 py-3 rounded-lg bg-green-700 hover:bg-green-600 text-white text-sm transition-all hover:scale-[1.02]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </button>
            <button
              onClick={shareViaEmail}
              className="flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-sm transition-all hover:scale-[1.02]"
            >
              <Mail size={14} />
              Email
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-6 relative z-10">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="btn-outline-gold flex-1 text-sm hover:scale-[1.02] transition-transform">
            Back
          </button>
        )}
        {step < 4 && (
          <button
            onClick={() => setStep(step + 1)}
            className="btn-gold flex-1 text-sm hover:scale-[1.02] transition-transform"
            disabled={step === 1 && !selectedTemplate && !invitation.event}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

// 3. PLAN MY EVENT WIZARD
interface PlanResult {
  summary: string;
  budget: { low: number; mid: number; high: number };
  budgetBreakdown: { category: string; pct: number; icon: string }[];
  timeline: { weeksOut: number; task: string }[];
  decor: string[];
  vendors: { category: string; note: string }[];
  tips: string[];
}

const formatNairaInline = (n: number) => `N${n.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;

function buildPlanResult(plan: {
  eventType: string; guestCount: string; date: string; venue: string; style: string; meals: string; entertainment: string[];
}): PlanResult {
  const guests = parseInt(plan.guestCount) || 100;
  const type = plan.eventType || 'Event';

  // Per-guest base cost varies by event type
  const perGuest: Record<string, [number, number, number]> = {
    'Wedding': [15000, 25000, 45000],
    'Traditional Wedding': [10000, 18000, 30000],
    'Engagement': [8000, 14000, 22000],
    'Birthday': [8000, 15000, 25000],
    'Corporate': [12000, 20000, 35000],
    'Anniversary': [10000, 18000, 30000],
    'Baby Shower': [6000, 10000, 18000],
    'Naming Ceremony': [7000, 12000, 20000],
    'Burial / Memorial': [8000, 15000, 25000],
    'Bridal Shower': [6000, 11000, 18000],
    'Conference / Seminar': [15000, 25000, 40000],
    'Concert / Party': [10000, 20000, 40000],
  };
  const base = perGuest[type] || [10000, 18000, 30000];
  const [low, mid, high] = base.map((b) => Math.round((b * guests) / 1000) * 1000);

  // Budget allocation percentages vary by event type
  const alloc: Record<string, { category: string; pct: number; icon: string }[]> = {
    'Wedding': [
      { category: 'Venue & Catering', pct: 40, icon: '🍽️' },
      { category: 'Décor & Flowers', pct: 20, icon: '💐' },
      { category: 'Attire & Beauty', pct: 15, icon: '👗' },
      { category: 'Photography & Video', pct: 10, icon: '📸' },
      { category: 'Entertainment & Music', pct: 8, icon: '🎵' },
      { category: 'Logistics & Misc.', pct: 7, icon: '🚐' },
    ],
    'Conference / Seminar': [
      { category: 'Venue & Equipment', pct: 35, icon: '🏛️' },
      { category: 'Speakers & Honoraria', pct: 25, icon: '🎤' },
      { category: 'Catering & Refreshments', pct: 20, icon: '☕' },
      { category: 'Branding & Materials', pct: 10, icon: '📋' },
      { category: 'Logistics & Misc.', pct: 10, icon: '🚐' },
    ],
    'Concert / Party': [
      { category: 'Artist & Sound', pct: 40, icon: '🎤' },
      { category: 'Venue & Stage', pct: 25, icon: '🎪' },
      { category: 'Lighting & Effects', pct: 15, icon: '💡' },
      { category: 'Security & Logistics', pct: 12, icon: '🛡️' },
      { category: 'Branding & Tickets', pct: 8, icon: '🎫' },
    ],
  };
  const defaultAlloc = [
    { category: 'Venue & Catering', pct: 40, icon: '🍽️' },
    { category: 'Décor & Styling', pct: 22, icon: '💐' },
    { category: 'Photography & Video', pct: 12, icon: '📸' },
    { category: 'Entertainment & Music', pct: 12, icon: '🎵' },
    { category: 'Logistics & Misc.', pct: 14, icon: '🚐' },
  ];
  const budgetBreakdown = alloc[type] || defaultAlloc;

  // Smart décor recommendations based on style + venue
  const decorByStyle: Record<string, string[]> = {
    'Gold & Ivory': ['Gold sequin tablecloths with ivory overlays', 'Tall gold candelabras with white roses', 'Gold chiavari chairs with ivory sashes'],
    'All-White Elegance': ['All-white floral arrangements (roses & lilies)', 'White draping with fairy lights', 'White carpet aisle with petals'],
    'Royal Purple': ['Purple and silver palette with crystal accents', 'Purple uplighting around the venue', 'Lavender and violet floral centerpieces'],
    'Rose Gold & Blush': ['Rose gold sequin runners with blush napkins', 'Blush and cream floral arrangements', 'Rose gold votive candles'],
    'Ankara Fusion': ['Ankara print table runners with solid accents', 'Colorful beadwork centerpieces', 'African print photo backdrop'],
    'Luxury Glam': ['Crystal chandeliers and string curtains', 'Mirrored table tops with floral runners', 'Gold and black lounge furniture'],
    'Traditional Nigerian': ['Aso-oke fabric draping in ceremonial colours', 'Cowrie shell and bead accents', 'Traditional calabash centerpieces'],
    'Bohemian': ['Macramé backdrops with pampas grass', 'Wooden crates with wildflowers', 'Rattan lanterns and fairy lights'],
    'Rustic Charm': ['Burlap runners with lace overlays', 'Mason jar floral centerpieces', 'Wooden signage and barrel tables'],
    'Modern Minimalist': ['Single-stem floral centerpieces', 'Geometric terrariums with succulents', 'Clean white linens with black accents'],
    'Classic Elegant': ['Tall floral centerpieces with cascading greenery', 'Crystal glassware and gold flatware', 'Candelabras with ivory candles'],
    'Tropical Paradise': ['Palm leaves and bird of paradise flowers', 'Bamboo accents and tiki torches', 'Bright tropical floral centerpieces'],
  };
  const baseDecor = decorByStyle[plan.style] || ['Elegant floral centerpieces matching your colour palette', 'Coordinated table linens and chair covers', 'Ambient lighting with fairy lights and uplighting'];

  // Venue-specific additions
  const venueDecor: Record<string, string> = {
    'Outdoor Garden': ' Add garden arches and weather-proof draping.',
    'Hotel Ballroom': ' Add ceiling draping and grand entrance decor.',
    'Traditional Setting': ' Add traditional canopy and mat decoration.',
    'Beach/Lakeside': ' Add wind-proof florals and seaside accent pieces.',
    'Private Residence': ' Add space-optimising decor and entrance styling.',
    'Open Field with Tent': ' Add tent lining, flooring, and perimeter lighting.',
  };
  if (venueDecor[plan.venue]) baseDecor.push(venueDecor[plan.venue].trim());

  // Smart vendor checklist based on event type + options
  const baseVendors: { category: string; note: string }[] = [
    { category: 'Venue', note: 'Book early — popular dates go fast in Kwara.' },
    { category: 'Caterer', note: `Plan for ${guests} guests with ${plan.meals || 'buffet'} service.` },
    { category: 'Photographer & Videographer', note: 'Book 6–8 weeks ahead; ask for a highlight reel.' },
    { category: 'Makeup Artist', note: 'Trial session recommended 2 weeks before.' },
  ];

  const ent = plan.entertainment || [];
  if (ent.includes('DJ')) baseVendors.push({ category: 'DJ', note: 'Share your playlist and do-not-play list in advance.' });
  if (ent.includes('Live Band')) baseVendors.push({ category: 'Live Band', note: 'Confirm set times and sound check schedule.' });
  if (ent.includes('Cultural Performers')) baseVendors.push({ category: 'Cultural Performers', note: 'Brief them on any traditions or protocols to observe.' });
  if (ent.includes('Comedian/MC') || ent.includes('Standup Comedian')) baseVendors.push({ category: 'MC / Comedian', note: 'Share the run-of-show and any sensitive topics to avoid.' });
  if (ent.includes('Photobooth')) baseVendors.push({ category: 'Photobooth Vendor', note: 'Request props matching your colour scheme.' });
  if (ent.includes('Fireworks / Sparklers')) baseVendors.push({ category: 'Pyrotechnics', note: 'Check venue permits and safety requirements.' });
  if (ent.includes('Dance Troupe')) baseVendors.push({ category: 'Dance Troupe', note: 'Coordinate performance slot with the MC.' });
  if (ent.includes('Live Saxophonist')) baseVendors.push({ category: 'Saxophonist', note: 'Ideal for cocktail hour or the couple\'s entrance.' });
  if (ent.includes('Magician / Hypnotist')) baseVendors.push({ category: 'Magician / Hypnotist', note: 'Confirm stage space and audience participation scope.' });

  // Timeline countdown from event date
  const eventDate = plan.date ? new Date(plan.date) : null;
  const timeline: { weeksOut: number; task: string }[] = [];
  const baseTimeline = [
    { weeksOut: 12, task: 'Book venue, caterer, and photographer — lock in the big three.' },
    { weeksOut: 10, task: 'Send out save-the-dates and book the MC/DJ.' },
    { weeksOut: 8, task: 'Order the cake, book makeup & beauty, and finalize the décor concept.' },
    { weeksOut: 6, task: 'Order invitations, book entertainment, and finalize the menu.' },
    { weeksOut: 4, task: 'Final headcount to caterer, finalize seating plan, and do a venue walkthrough.' },
    { weeksOut: 2, task: 'Final dress fitting, confirm all vendors, and print programs.' },
    { weeksOut: 1, task: 'Final vendor confirmations, pack day-of bags, and confirm setup times.' },
    { weeksOut: 0, task: 'Event day — arrive early, delegate, and enjoy!' },
  ];
  for (const t of baseTimeline) {
    if (eventDate) {
      const taskDate = new Date(eventDate);
      taskDate.setDate(taskDate.getDate() - t.weeksOut * 7);
      timeline.push({ weeksOut: t.weeksOut, task: `${t.task} (by ${taskDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })})` });
    } else {
      timeline.push(t);
    }
  }

  // Smart tips based on guest count and venue
  const tips: string[] = [];
  if (guests > 300) tips.push(`With ${guests} guests, consider hiring a second photographer and extra ushers to keep things flowing.`);
  if (guests > 200 && plan.meals === 'Plated') tips.push('For plated service at this scale, assign a dedicated catering captain to coordinate timing.');
  if (plan.venue === 'Outdoor Garden' || plan.venue === 'Open Field with Tent') tips.push('Have a rain plan ready — reserve a tent or indoor backup space.');
  if (plan.venue === 'Beach/Lakeside') tips.push('Check tide times and wind conditions; secure all décor against wind.');
  if (plan.venue === 'Private Residence') tips.push('Arrange parking attendants and consider a shuttle from a nearby lot.');
  if (plan.eventType === 'Wedding' || plan.eventType === 'Traditional Wedding') tips.push('Schedule the couple\'s portrait session during golden hour (just before sunset) for the best photos.');
  if (plan.eventType === 'Conference / Seminar') tips.push('Prepare name badges, a registration desk, and a clear signage plan for breakouts.');
  if (plan.eventType === 'Concert / Party') tips.push('Hire professional security and confirm sound check is done 2 hours before doors open.');
  if (plan.eventType === 'Burial / Memorial') tips.push('Coordinate with the family on order of tributes and keep the program dignified and on-time.');
  tips.push('Set up a WhatsApp group with all vendors one week before for real-time coordination.');
  tips.push('Pack a "day-of emergency kit": pins, tape, scissors, a first-aid kit, and a portable charger.');

  const summary = `Your ${type.toLowerCase()} for ${guests} guests${
    plan.date ? ` on ${new Date(plan.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''
  }${plan.venue ? ` at a ${plan.venue.toLowerCase()}` : ''} with a ${plan.style || 'classic'} style. ${
    plan.entertainment.length > 0 ? `${plan.entertainment.join(', ')} for entertainment, ` : ''
  }${plan.meals ? `${plan.meals.toLowerCase()} meal service.` : 'Catering to be finalized.'}`;

  return { summary, budget: { low, mid, high }, budgetBreakdown, timeline, decor: baseDecor, vendors: baseVendors, tips };
}

function PlanMyEvent() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [plan, setPlan] = useState({
    eventType: '',
    guestCount: '',
    date: '',
    venue: '',
    style: '',
    meals: '',
    entertainment: [],
  });
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlanResult | null>(null);

  const generatePlan = () => {
    setLoading(true);
    setTimeout(() => {
      setResult(buildPlanResult(plan));
      setLoading(false);
      setGenerated(true);
    }, 2000);
  };

  const sharePlan = () => {
    const msg = `Hi BELSH Events! I'd like to plan a ${plan.eventType} for ${plan.guestCount} guests on ${plan.date}. My preferred style is ${plan.style}. Venue: ${plan.venue}, Entertainment: ${plan.entertainment.join(', ') || 'None'}, Meals: ${plan.meals}. Can we discuss further?`;
    window.open(`https://wa.me/2348035672491?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="glass-card gold-border rounded-2xl p-6 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/5 to-transparent pointer-events-none" />
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center animate-icon-spin">
          <Wand2 size={20} className="text-gold-400" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-white">Plan My Event</h3>
          <p className="text-white/70 text-sm">Personalized event planning wizard</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-6 relative z-10">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${i + 1 <= step ? 'bg-gold-500 text-dark scale-110' : 'bg-dark-card text-white/70'}`}>
              {i + 1}
            </div>
            {i < totalSteps - 1 && <div className={`flex-1 h-0.5 transition-all duration-500 ${i + 1 < step ? 'bg-gold-500' : 'bg-dark-card'}`} />}
          </div>
        ))}
      </div>

      {!generated ? (
        <div className="space-y-6 relative z-10">
          {step === 1 && (
            <div className="space-y-4 animate-slide-in-right">
              <p className="text-sm text-white/80">What type of event are you planning?</p>
              <div className="grid grid-cols-2 gap-3">
                {['Wedding', 'Birthday', 'Corporate', 'Anniversary', 'Baby Shower', 'Naming Ceremony', 'Burial / Memorial', 'Bridal Shower', 'Traditional Wedding', 'Engagement', 'Conference / Seminar', 'Concert / Party'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setPlan({ ...plan, eventType: type })}
                    className={`py-3 px-4 rounded-lg text-sm transition-all hover:scale-[1.02] ${plan.eventType === type ? 'bg-gold-500/20 border border-gold-500 text-gold-400 shadow-lg shadow-gold-500/10' : 'bg-dark-card border border-dark-border text-white/80 hover:border-gold-500/40'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-slide-in-right">
              <div>
                <p className="text-sm text-white/80 mb-2">How many guests do you expect?</p>
                <input
                  type="number"
                  value={plan.guestCount}
                  onChange={(e) => setPlan({ ...plan, guestCount: e.target.value })}
                  placeholder="e.g., 150"
                  className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
                />
              </div>
              <div>
                <p className="text-sm text-white/80 mb-2">When is your event?</p>
                <input
                  type="date"
                  value={plan.date}
                  onChange={(e) => setPlan({ ...plan, date: e.target.value })}
                  className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-500/50 transition-all"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-slide-in-right">
              <p className="text-sm text-white/80">What's your preferred venue type?</p>
              <div className="grid grid-cols-2 gap-3">
                {['Indoor Hall', 'Outdoor Garden', 'Hotel Ballroom', 'Traditional Setting', 'Beach/Lakeside', 'Private Residence', 'Church / Mosque Hall', 'Event Center', 'Restaurant / Lounge', 'Open Field with Tent'].map((venue) => (
                  <button
                    key={venue}
                    onClick={() => setPlan({ ...plan, venue })}
                    className={`py-3 px-4 rounded-lg text-sm transition-all hover:scale-[1.02] ${plan.venue === venue ? 'bg-gold-500/20 border border-gold-500 text-gold-400 shadow-lg shadow-gold-500/10' : 'bg-dark-card border border-dark-border text-white/80 hover:border-gold-500/40'}`}
                  >
                    {venue}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-slide-in-right">
              <p className="text-sm text-white/80">What style do you prefer?</p>
              <div className="grid grid-cols-2 gap-3">
                {['Classic Elegant', 'Modern Minimalist', 'Traditional Nigerian', 'Bohemian', 'Luxury Glam', 'Rustic Charm', 'Gold & Ivory', 'Ankara Fusion', 'Rose Gold & Blush', 'Royal Purple', 'Tropical Paradise', 'All-White Elegance'].map((style) => (
                  <button
                    key={style}
                    onClick={() => setPlan({ ...plan, style })}
                    className={`py-3 px-4 rounded-lg text-sm transition-all hover:scale-[1.02] ${plan.style === style ? 'bg-gold-500/20 border border-gold-500 text-gold-400 shadow-lg shadow-gold-500/10' : 'bg-dark-card border border-dark-border text-white/80 hover:border-gold-500/40'}`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 animate-slide-in-right">
              <div>
                <p className="text-sm text-white/80 mb-2">Select all the entertainment you need (you can choose multiple):</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Live Band', 'DJ', 'Cultural Performers', 'Comedian/MC', 'Photobooth', 'Fireworks / Sparklers', 'Dance Troupe', 'Magician / Hypnotist', 'Standup Comedian', 'Live Saxophonist'].map((ent) => (
                    <button
                      key={ent}
                      onClick={() => setPlan({ ...plan, entertainment: plan.entertainment.includes(ent) ? plan.entertainment.filter(e => e !== ent) : [...plan.entertainment, ent] })}
                      className={`py-3 px-4 rounded-lg text-sm transition-all hover:scale-[1.02] ${plan.entertainment.includes(ent) ? 'bg-gold-500/20 border border-gold-500 text-gold-400 shadow-lg shadow-gold-500/10' : 'bg-dark-card border border-dark-border text-white/80 hover:border-gold-500/40'}`}
                    >
                      {ent}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-white/80 mb-2">Meal service preference?</p>
                <div className="grid grid-cols-3 gap-3">
                  {['Buffet', 'Plated', 'Cocktail', 'Small Chops Only', 'Hybrid (Buffet + Plated)', 'Food Stations'].map((meal) => (
                    <button
                      key={meal}
                      onClick={() => setPlan({ ...plan, meals: meal })}
                      className={`py-3 px-4 rounded-lg text-sm transition-all hover:scale-[1.02] ${plan.meals === meal ? 'bg-gold-500/20 border border-gold-500 text-gold-400 shadow-lg shadow-gold-500/10' : 'bg-dark-card border border-dark-border text-white/80 hover:border-gold-500/40'}`}
                    >
                      {meal}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 relative z-10">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="btn-outline-gold flex-1 text-sm hover:scale-[1.02] transition-transform">
                Back
              </button>
            )}
            {step < totalSteps ? (
              <button onClick={() => setStep(step + 1)} className="btn-gold flex-1 text-sm hover:scale-[1.02] transition-transform">
                Next
              </button>
            ) : (
              <button onClick={generatePlan} className="btn-gold flex-1 text-sm hover:scale-[1.02] transition-transform">
                Generate My Plan
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6 relative z-10">
          {loading ? (
            <div className="text-center py-12 animate-pulse">
              <RefreshCw size={32} className="text-gold-400 animate-spin mx-auto mb-4" />
              <p className="text-white/80">Creating your personalized plan...</p>
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="glass-dark rounded-xl p-4 animate-pop-in">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-gold-400" />
                  <h4 className="text-gold-400 text-sm font-medium">Your Event Summary</h4>
                </div>
                <p className="text-white/90 text-sm leading-relaxed">{result?.summary}</p>
              </div>

              {/* Budget estimate */}
              <div className="glass-dark rounded-xl p-4 animate-pop-in" style={{ animationDelay: '80ms' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Wallet size={16} className="text-gold-400" />
                  <h4 className="text-gold-400 text-sm font-medium">Estimated Budget</h4>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Essential', value: result?.budget.low, color: 'text-green-400', desc: 'Core essentials' },
                    { label: 'Recommended', value: result?.budget.mid, color: 'text-gold-400', desc: 'Best balance' },
                    { label: 'Premium', value: result?.budget.high, color: 'text-purple-400', desc: 'Full luxury' },
                  ].map((tier) => (
                    <div key={tier.label} className="text-center glass-card rounded-lg p-3">
                      <p className="text-[10px] text-white/60 mb-1">{tier.desc}</p>
                      <p className={`text-base font-serif ${tier.color}`}>{formatNairaInline(tier.value!)}</p>
                      <p className="text-[10px] text-white/50 mt-1">{tier.label}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {result?.budgetBreakdown.map((item) => (
                    <div key={item.category} className="flex items-center gap-2">
                      <span className="text-sm">{item.icon}</span>
                      <span className="text-xs text-white/80 flex-1">{item.category}</span>
                      <div className="w-20 h-1.5 bg-dark-card rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-gold-500 to-gold-300 rounded-full" style={{ width: `${item.pct}%` }} />
                      </div>
                      <span className="text-xs text-gold-400 w-8 text-right">{item.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Décor recommendations */}
              <div className="glass-dark rounded-xl p-4 animate-pop-in" style={{ animationDelay: '160ms' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Palette size={16} className="text-gold-400" />
                  <h4 className="text-gold-400 text-sm font-medium">Décor Recommendations</h4>
                </div>
                <ul className="space-y-2">
                  {result?.decor.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/80 animate-slide-in-left" style={{ animationDelay: `${i * 60}ms` }}>
                      <CheckCircle size={14} className="text-gold-400 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Vendor checklist */}
              <div className="glass-dark rounded-xl p-4 animate-pop-in" style={{ animationDelay: '240ms' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Users size={16} className="text-gold-400" />
                  <h4 className="text-gold-400 text-sm font-medium">Vendor Checklist</h4>
                </div>
                <div className="space-y-2">
                  {result?.vendors.map((v, i) => (
                    <div key={i} className="flex items-start gap-2 animate-slide-in-left" style={{ animationDelay: `${i * 60}ms` }}>
                      <CheckCircle size={14} className="text-gold-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-white font-medium">{v.category}</p>
                        <p className="text-[11px] text-white/60">{v.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="glass-dark rounded-xl p-4 animate-pop-in" style={{ animationDelay: '320ms' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={16} className="text-gold-400" />
                  <h4 className="text-gold-400 text-sm font-medium">Planning Timeline</h4>
                </div>
                <div className="space-y-3">
                  {result?.timeline.map((t, i) => (
                    <div key={i} className="flex items-start gap-3 animate-slide-in-left" style={{ animationDelay: `${i * 50}ms` }}>
                      <div className="w-7 h-7 rounded-full bg-gold-900/40 border border-gold-500/30 flex items-center justify-center shrink-0">
                        <span className="text-[10px] text-gold-400 font-medium">{t.weeksOut === 0 ? '✓' : `${t.weeksOut}w`}</span>
                      </div>
                      <p className="text-xs text-white/80 pt-1">{t.task}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Smart tips */}
              <div className="glass-dark rounded-xl p-4 animate-pop-in border border-gold-500/20" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb size={16} className="text-gold-400" />
                  <h4 className="text-gold-400 text-sm font-medium">Smart Tips</h4>
                </div>
                <ul className="space-y-2">
                  {result?.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/80 animate-slide-in-left" style={{ animationDelay: `${i * 50}ms` }}>
                      <span className="text-gold-400 shrink-0">💡</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button onClick={sharePlan} className="btn-gold w-full text-sm hover:scale-[1.02] transition-all hover:shadow-lg hover:shadow-gold-500/20">
                <MessageCircle size={16} className="mr-2" />
                Book This Plan on WhatsApp
              </button>

              <button onClick={() => { setStep(1); setGenerated(false); setResult(null); setPlan({ eventType: '', guestCount: '', date: '', venue: '', style: '', meals: '', entertainment: [] }); }} className="text-sm text-white/70 hover:text-gold-300 w-full text-center transition-colors">
                Start Over
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// 4. RSVP MANAGEMENT
function RSVPManager() {
  const [guests, setGuests] = useState<RsvpGuest[]>([]);
  const [newGuest, setNewGuest] = useState({ name: '', phone: '' });
  const [rsvpError, setRsvpError] = useState('');
  const [stats, setStats] = useState({ attending: 0, declined: 0, pending: 0 });

  useEffect(() => {
    supabase.from('rsvp_guests').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setGuests(data as RsvpGuest[]);
    });
  }, []);

  useEffect(() => {
    setStats({
      attending: guests.filter(g => g.status === 'attending').length,
      declined: guests.filter(g => g.status === 'declined').length,
      pending: guests.filter(g => g.status === 'pending').length,
    });
  }, [guests]);

  const addGuest = async () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(newGuest.name.trim())) {
      setRsvpError('Name can only contain letters and spaces.');
      return;
    }
    const digits = newGuest.phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      setRsvpError('Please enter a valid phone number (10-15 digits).');
      return;
    }
    setRsvpError('');
    if (newGuest.name && newGuest.phone) {
      const { data } = await supabase.from('rsvp_guests').insert({ name: newGuest.name, phone: newGuest.phone, status: 'pending', meal: '' }).select();
      if (data) setGuests([...guests, data[0] as RsvpGuest]);
      setNewGuest({ name: '', phone: '' });
    }
  };

  const removeGuest = (id: string) => {
    supabase.from('rsvp_guests').delete().eq('id', id);
    setGuests(guests.filter(g => g.id !== id));
  };

  const updateStatus = (id: string, status: 'attending' | 'declined' | 'pending') => {
    supabase.from('rsvp_guests').update({ status }).eq('id', id);
    setGuests(guests.map(g => g.id === id ? { ...g, status } : g));
  };

  const sendReminder = (phone: string, name: string) => {
    const msg = `Hi ${name}! This is a friendly reminder from BELSH Events. Please confirm your attendance for our upcoming event. Reply with YES or NO.`;
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="glass-card gold-border rounded-2xl p-6 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '250ms' }}>
      <div className="absolute inset-0 bg-gradient-to-tr from-green-500/5 to-transparent pointer-events-none" />
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center animate-icon-pulse">
          <UserCheck size={20} className="text-gold-400" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-white">RSVP Management</h3>
          <p className="text-white/70 text-sm">Track guest responses in real-time</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6 relative z-10">
        {[
          { value: stats.attending, label: 'Attending', color: 'text-green-400' },
          { value: stats.declined, label: 'Declined', color: 'text-red-400' },
          { value: stats.pending, label: 'Pending', color: 'text-yellow-400' },
        ].map((stat, i) => (
          <div key={stat.label} className="text-center glass-dark rounded-lg p-3 animate-pop-in hover:scale-105 transition-transform" style={{ animationDelay: `${i * 100}ms` }}>
            <p className={`text-2xl font-serif ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-white/70">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Add Guest */}
      <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
        <input
          type="text"
          placeholder="Guest Name (letters only)"
          value={newGuest.name}
          onChange={(e) => { setNewGuest({ ...newGuest, name: e.target.value }); setRsvpError(''); }}
          className="bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
        />
        <input
          type="tel"
          placeholder="Phone (e.g., +234...)"
          value={newGuest.phone}
          onChange={(e) => { setNewGuest({ ...newGuest, phone: e.target.value }); setRsvpError(''); }}
          className="bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
        />
      </div>
      {rsvpError && (
        <p className="text-red-400 text-xs mb-3 relative z-10">{rsvpError}</p>
      )}
      <button onClick={addGuest} className="btn-gold w-full text-sm mb-6 relative z-10 hover:scale-[1.02] transition-transform">
        <Plus size={14} />
        Add Guest
      </button>

      {/* Guest List */}
      <div className="space-y-2 max-h-64 overflow-y-auto relative z-10">
        {guests.map((guest) => (
          <div key={guest.id} className="flex items-center justify-between glass-dark rounded-lg p-3 hover:border-gold-500/30 transition-all group animate-slide-in-right">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full animate-pulse ${guest.status === 'attending' ? 'bg-green-400' : guest.status === 'declined' ? 'bg-red-400' : 'bg-yellow-400'}`} />
              <div>
                <p className="text-white text-sm">{guest.name}</p>
                <p className="text-white/70 text-xs">{guest.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={guest.status}
                onChange={(e) => updateStatus(guest.id, e.target.value as any)}
                className="bg-dark-card border border-dark-border rounded px-2 py-1 text-xs text-white focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="attending">Attending</option>
                <option value="declined">Declined</option>
              </select>
              <button onClick={() => sendReminder(guest.phone, guest.name)} className="text-white/70 hover:text-gold-400 transition-colors">
                <MessageCircle size={14} />
              </button>
              <button onClick={() => removeGuest(guest.id)} className="text-white/70 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. EVENT MEMORY WALL (Public, with photo upload and delete)
function MemoryWall() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [newMemory, setNewMemory] = useState({ name: '', message: '' });
  const [newPhoto, setNewPhoto] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from('memories').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setMemories(data as Memory[]);
    });
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addMemory = async () => {
    if (newMemory.name && newMemory.message) {
      const { data } = await supabase.from('memories').insert({
        name: newMemory.name,
        message: newMemory.message,
        photo: newPhoto,
      }).select();
      if (data) setMemories([data[0] as Memory, ...memories]);
      setNewMemory({ name: '', message: '' });
      setNewPhoto('');
    }
  };

  const removeMemory = (id: string) => {
    supabase.from('memories').delete().eq('id', id);
    setMemories(memories.filter(m => m.id !== id));
  };

  return (
    <div className="glass-card gold-border rounded-2xl p-6 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '300ms' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent pointer-events-none" />
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center animate-icon-float">
          <GalleryVerticalEnd size={20} className="text-gold-400" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-white">Memory Wall</h3>
          <p className="text-white/70 text-sm">Share your event memories with everyone</p>
        </div>
      </div>

      {/* Add Memory */}
      <div className="space-y-3 mb-6 relative z-10">
        <input
          type="text"
          placeholder="Your Name"
          value={newMemory.name}
          onChange={(e) => setNewMemory({ ...newMemory, name: e.target.value })}
          className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
        />
        <textarea
          placeholder="Share your memory..."
          value={newMemory.message}
          onChange={(e) => setNewMemory({ ...newMemory, message: e.target.value })}
          rows={2}
          className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 resize-none transition-all"
        />

        {/* Photo Upload */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full glass-dark rounded-lg p-3 border-2 border-dashed border-gold-500/30 hover:border-gold-500/60 transition-all flex items-center justify-center gap-2 hover:bg-gold-500/5"
        >
          <Upload size={16} className="text-gold-400" />
          <span className="text-white/80 text-xs">Add Photo (Optional)</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
        {newPhoto && (
          <div className="relative rounded-lg overflow-hidden">
            <img src={newPhoto} alt="Preview" className="w-full h-32 object-cover opacity-80" />
            <button
              onClick={() => setNewPhoto('')}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors"
            >
              <X size={12} className="text-white" />
            </button>
          </div>
        )}

        <button onClick={addMemory} className="btn-gold w-full text-sm hover:scale-[1.02] transition-transform">
          <Plus size={14} />
          Add Memory
        </button>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-2 gap-3 relative z-10">
        {memories.map((memory, i) => (
          <div
            key={memory.id}
            className="glass-dark rounded-xl p-3 group hover:border-gold-500/40 transition-all animate-pop-in hover:scale-[1.02] hover:shadow-lg hover:shadow-gold-500/10"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {memory.photo && (
              <img src={memory.photo} alt="" className="w-full h-24 object-cover rounded-lg mb-2 opacity-80 group-hover:opacity-100 transition-opacity" />
            )}
            <p className="text-white text-sm mb-1">{memory.name}</p>
            <p className="text-white/70 text-xs line-clamp-2">{memory.message}</p>
            <div className="flex items-center justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white/40 text-[10px]">{new Date(memory.created_at).toLocaleDateString()}</p>
              <button onClick={() => removeMemory(memory.id)} className="text-red-400 hover:text-red-300 transition-colors">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {memories.length === 0 && (
        <div className="text-center py-8 relative z-10">
          <Image size={40} className="text-purple-600 mx-auto mb-3 opacity-50" />
          <p className="text-white/70 text-sm">No memories yet. Be the first to share!</p>
        </div>
      )}
    </div>
  );
}

// 6. EVENT BUDGET CALCULATOR
function BudgetCalculator() {
  const [eventCosts, setEventCosts] = useState({
    venue: 0,
    catering: 0,
    decor: 0,
    photography: 0,
    music: 0,
    attire: 0,
    transport: 0,
    miscellaneous: 0,
  });
  const [guestCount, setGuestCount] = useState(100);

  const total = Object.values(eventCosts).reduce((sum, val) => sum + val, 0);
  const costPerGuest = guestCount > 0 ? total / guestCount : 0;

  const formatNaira = (n: number) => `N${n.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;

  const categories = [
    { key: 'venue', label: 'Venue', icon: MapPin },
    { key: 'catering', label: 'Catering & Food', icon: Utensils },
    { key: 'decor', label: 'Decoration', icon: Palette },
    { key: 'photography', label: 'Photography', icon: Camera },
    { key: 'music', label: 'Music / DJ / MC', icon: Music },
    { key: 'attire', label: 'Attire & Beauty', icon: Crown },
    { key: 'transport', label: 'Transport', icon: Calendar },
    { key: 'miscellaneous', label: 'Miscellaneous', icon: Gift },
  ] as const;

  return (
    <div className="glass-card gold-border rounded-2xl p-6 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '350ms' }}>
      <div className="absolute inset-0 bg-gradient-to-tr from-green-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl" />

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center animate-icon-bounce">
          <Wallet size={20} className="text-gold-400" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-white">Budget Calculator</h3>
          <p className="text-white/70 text-sm">Estimate and track your event costs</p>
        </div>
      </div>

      {/* Guest count */}
      <div className="mb-4 relative z-10">
        <label className="text-white/70 text-xs mb-2 block">Number of Guests</label>
        <input
          type="number"
          value={guestCount}
          onChange={(e) => setGuestCount(Math.max(0, parseInt(e.target.value) || 0))}
          className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold-500/50 transition-all"
        />
      </div>

      {/* Category inputs */}
      <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
        {categories.map(({ key, label, icon: Icon }, i) => (
          <div
            key={key}
            className="glass-dark rounded-lg p-3 animate-pop-in hover:border-gold-500/30 transition-all"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Icon size={14} className="text-gold-400 shrink-0" />
              <span className="text-white/70 text-[10px] uppercase tracking-wider truncate">{label}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-white/50 text-xs">N</span>
              <input
                type="number"
                placeholder="0"
                value={eventCosts[key] || ''}
                onChange={(e) => setEventCosts({ ...eventCosts, [key]: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-full bg-transparent text-white text-sm focus:outline-none tabular-nums"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Results */}
      <div className="glass-dark rounded-lg p-4 relative z-10 animate-pop-in">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/70 text-sm">Total Budget</span>
          <span className="text-gold-400 font-serif text-2xl tabular-nums">{formatNaira(total)}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/70 text-xs">Cost per Guest</span>
          <span className="text-white text-sm tabular-nums">{formatNaira(Math.round(costPerGuest))}</span>
        </div>
        <div className="h-px bg-dark-border my-3" />
        <p className="text-white/50 text-[10px]">
          {costPerGuest > 0 && costPerGuest < 2000 && 'Budget-friendly range'}
          {costPerGuest >= 2000 && costPerGuest < 5000 && 'Standard range'}
          {costPerGuest >= 5000 && costPerGuest < 10000 && 'Premium range'}
          {costPerGuest >= 10000 && 'Luxury range'}
        </p>
      </div>
    </div>
  );
}

// 7. AI EVENT PLANNER
function AIEventPlanner() {
  const [activeTab, setActiveTab] = useState<'speech' | 'program' | 'highlights'>('speech');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState('');
  const [input, setInput] = useState({ eventType: 'wedding', names: '', speakerRole: '' });
  const [speechLength, setSpeechLength] = useState<'short' | 'medium' | 'long'>('medium');

  const eventOptions = [
    { value: 'wedding', label: 'Wedding' },
    { value: 'birthday', label: 'Birthday Party' },
    { value: 'burial', label: 'Burial / Memorial' },
    { value: 'bridal', label: 'Bridal Shower' },
    { value: 'naming', label: 'Naming Ceremony' },
    { value: 'traditional', label: 'Traditional Wedding' },
    { value: 'corporate', label: 'Corporate Event' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'conference', label: 'Conference / Seminar' },
    { value: 'concert', label: 'Concert / Party' },
  ];

  const generateSpeech = (type: string, names: string, role: string, length: 'short' | 'medium' | 'long'): string => {
    const lengthMap = {
      short: { paras: 2, toast: true, story: false, blessing: true },
      medium: { paras: 4, toast: true, story: true, blessing: true },
      long: { paras: 6, toast: true, story: true, blessing: true, extra: true },
    };
    const cfg = lengthMap[length];

    const r = role.trim();
    const roleIntro = r
      ? ` For those who may not know me, I am ${r}, and it is my honour to say a few words today.`
      : '';
    const roleCloseline = r
      ? ` As ${r}, let me add one thing — `
      : ' Let me add one thing — ';
    const roleToCouple = r
      ? ` Speaking as ${r}, I want you both to know — `
      : ' I want you both to know — ';

    const speeches: Record<string, () => string> = {
      wedding: () => {
        let parts: string[] = [];
        parts.push(`Distinguished guests, family, and friends — good afternoon and welcome.${roleIntro}`);
        parts.push(`Today is a sacred and joyous occasion as we celebrate the union of ${names || 'this beautiful couple'}. To see two people choose each other, before God and before all of us, is a reminder that love is the greatest gift we are given in this life.`);
        if (cfg.story) parts.push(`I have watched ${names || 'them'} grow — from the early days of shy glances and long phone calls, to the confident, loving couple standing before us today. What has always struck me is the way they bring out the best in each other, the way their laughter fills every room they enter.`);
        parts.push(`Marriage is not just about the wedding day — it is about the thousands of ordinary days that follow. It is patience when things are difficult. It is kindness when the world is not. It is choosing each other, again and again, long after the cameras have gone home.`);
        if (cfg.extra) parts.push(`To the families: you are not losing a child, you are gaining a new branch on your family tree. May this union bring your two families closer together, and may the doors that open from this day bring blessings to generations yet unborn.`);
        if (cfg.blessing) parts.push(`${roleToCouple}may your home be filled with laughter that echoes through the years. May your children carry your names with pride. May God bless this marriage with peace, prosperity, and unshakeable love.`);
        if (cfg.toast) parts.push(`So please, raise your glasses with me — to ${names || 'the couple'}! May your love grow deeper with every passing year. Congratulations, and may God bless your union!`);
        return parts.join('\n\n');
      },
      birthday: () => {
        let parts: string[] = [];
        parts.push(`Family and friends, thank you all for being here today to celebrate ${names || 'our birthday celebrant'}.${roleIntro}`);
        parts.push(`Birthdays are more than just candles and cake — they are milestones that remind us to pause and give thanks for the gift of life. And today, we celebrate a life that has touched so many of us in this room.`);
        if (cfg.story) parts.push(`${names || 'This person'} has always been the kind who puts others first — who remembers your birthday even when you forget theirs, who shows up when it matters most. That is the person we are celebrating today.`);
        parts.push(`Another year means another chapter — new dreams to chase, new mountains to climb, and new memories to make with the people who love you most.`);
        if (cfg.extra) parts.push(`To the family: thank you for raising someone who makes the world a little brighter. To the friends: thank you for standing by them through every season.`);
        if (cfg.blessing) parts.push(`${roleCloseline}may this new year bring you health that never fails, joy that never runs dry, and doors that open wider than you ever imagined. May God's favour rest upon you.`);
        if (cfg.toast) parts.push(`So let us raise our glasses — happy birthday, ${names || 'my dear'}! Here's to many more years of life, love, and laughter!`);
        return parts.join('\n\n');
      },
      burial: () => {
        let parts: string[] = [];
        parts.push(`Family, friends, and well-wishers — thank you for gathering here today to honour the life of ${names || 'our beloved departed'}.${roleIntro}`);
        parts.push(`Today is not a day of endings, but a day of remembrance. We do not come to say goodbye — we come to say thank you. Thank you for a life lived with purpose, for a heart that gave freely, and for a legacy that will not fade.`);
        if (cfg.story) parts.push(`${names || 'Our loved one'} taught us what it means to be generous — not just with money, but with time, with wisdom, and with love. The lessons they left behind are worth more than gold, and we carry them with us still.`);
        parts.push(`In our culture, we say that a person is not truly gone until they are forgotten. As long as we speak their name, share their stories, and walk the paths they showed us, they live on — in us, and in the generations that follow.`);
        if (cfg.extra) parts.push(`To the family: we know that no words can fill the space they have left behind. But we want you to know that you do not grieve alone. This community, these friends, this family — we are here, and we will continue to be here.`);
        if (cfg.blessing) parts.push(`May God grant the family the strength to bear this loss, and may the soul of our beloved find eternal rest. May light perpetual shine upon them.`);
        if (cfg.toast) parts.push(`Please join me — to ${names || 'our beloved'}. A life well lived, a legacy well left. May you rest in perfect peace.`);
        return parts.join('\n\n');
      },
      bridal: () => {
        let parts: string[] = [];
        parts.push(`Ladies, friends, and family — what a beautiful day to celebrate ${names || 'our beautiful bride-to-be'}!${roleIntro}`);
        parts.push(`A bridal shower is a special moment — it is the calm before the beautiful storm of wedding day. It is a moment for the women who have shaped her, the friends who have stood by her, and the family who loves her, to gather and pour into her before she takes this big step.`);
        if (cfg.story) parts.push(`${names || 'Our bride'} has always been the kind of friend who remembers every detail — who throws the best surprises, who brings soup when you are sick. Today, it is our turn to celebrate her.`);
        parts.push(`Marriage is a wonderful adventure, and you are ready for it. You have a good heart, a strong spirit, and a community of women behind you who will always be in your corner.`);
        if (cfg.extra) parts.push(`To the bridesmaids and friends: keep showing up for her. The wedding day comes once, but friendship is the foundation that holds a marriage up for decades.`);
        if (cfg.blessing) parts.push(`May your marriage be filled with the same joy you bring to everyone around you. May your home be warm, your arguments be few, and your love grow deeper with every passing year.`);
        if (cfg.toast) parts.push(`Raise your glasses — to ${names || 'our beautiful bride'}! Cheers to love, to friendship, and to the beautiful journey ahead!`);
        return parts.join('\n\n');
      },
      naming: () => {
        let parts: string[] = [];
        parts.push(`Family and friends, welcome and thank you for joining us to celebrate the naming of ${names || 'this precious child'}.${roleIntro}`);
        parts.push(`In our tradition, a name is more than a label — it is a prophecy, a prayer, and a heritage. The name we give this child today will walk with them for the rest of their life, and we choose it with love, with wisdom, and with hope.`);
        if (cfg.story) parts.push(`Looking at this child, I see the faces of the parents and grandparents reflected in those tiny features. I see the beginning of a new chapter for this family — a branch that will grow strong because its roots are deep.`);
        parts.push(`To the parents: you have been entrusted with a great gift. Raise this child with love that is firm and gentle, with values that are clear and kind. The world they will grow into is changing fast, but the foundation you build at home will never go out of style.`);
        if (cfg.extra) parts.push(`To the grandparents: your wisdom is needed now more than ever. Share your stories, teach your traditions, and let this child know where they come from.`);
        if (cfg.blessing) parts.push(`May this child grow in wisdom, in health, and in favour with God and with people. May their name be spoken with pride for generations to come.`);
        if (cfg.toast) parts.push(`Please raise your glasses — to ${names || 'our newest family member'}! May your life be long, bright, and full of blessings!`);
        return parts.join('\n\n');
      },
      traditional: () => {
        let parts: string[] = [];
        parts.push(`Elders, family, and guests — thank you for being here today as we celebrate the traditional union of ${names || 'this couple'}.${roleIntro}`);
        parts.push(`Today is about more than two people — it is about two families coming together. Our ancestors understood that marriage joins not just individuals, but lineages. The items exchanged today carry centuries of meaning, and we honour that.`);
        if (cfg.story) parts.push(`Watching ${names || 'this couple'} go through the traditional rites — the introduction, the proposal, the acceptance — is to witness something sacred. This is the foundation upon which their married life will be built.`);
        parts.push(`To the families: you have done well. You have raised children who respect tradition, who honour their elders, and who understand that some things are bigger than themselves.`);
        if (cfg.extra) parts.push(`To the couple: as you step into marriage, remember the values that brought you here — respect, patience, and the wisdom of those who came before you.`);
        if (cfg.blessing) parts.push(`May your union be blessed with children who carry your names proudly. May your two families grow closer with each passing year. May God bless this marriage abundantly.`);
        if (cfg.toast) parts.push(`Raise your glasses — to ${names || 'the couple'} and to the joining of two families! I se! Congratulations!`);
        return parts.join('\n\n');
      },
      corporate: () => {
        let parts: string[] = [];
        parts.push(`Good evening, distinguished guests, colleagues, and partners — welcome.${roleIntro}`);
        parts.push(`Tonight we gather not just to celebrate, but to recognise the hard work, the late nights, and the shared vision that have brought us to this point. ${names || 'This organization'} is built on people who believe in what we do, and tonight is about them.`);
        if (cfg.story) parts.push(`When we look back at where we started and where we are now, the growth is clear. But behind every milestone, every deal, every success — there are people. People who showed up, who pushed harder, who refused to settle.`);
        parts.push(`The road ahead is full of opportunity, and if we continue to work together with the same spirit that brought us here, there is no limit to what we can achieve.`);
        if (cfg.extra) parts.push(`To our partners and clients: thank you for your trust. We do not take it for granted, and we will continue to earn it every single day.`);
        if (cfg.blessing) parts.push(`May this organization continue to grow, to innovate, and to make a difference. May the year ahead be our best yet.`);
        if (cfg.toast) parts.push(`Please raise your glasses — to ${names || 'our team'}, to our future, and to the journey ahead. Cheers!`);
        return parts.join('\n\n');
      },
      engagement: () => {
        let parts: string[] = [];
        parts.push(`Family and friends, welcome! Today we celebrate love and commitment as ${names || 'this couple'} takes the next step together.${roleIntro}`);
        parts.push(`An engagement is a promise — a promise that says, "I choose you, not just for the good days, but for all the days." It is a beautiful thing to witness two people make that promise before the people they love most.`);
        if (cfg.story) parts.push(`${names || 'This couple'} reminds us that real love is not about perfection — it is about two imperfect people who choose each other, every single day, and who make it work with patience and laughter.`);
        parts.push(`As you prepare for the wedding, remember that the wedding is one day, but the marriage is a lifetime. Take time to enjoy this season — the planning, the dreaming, the anticipation.`);
        if (cfg.extra) parts.push(`To the families: support them, pray for them, and be there for them. A strong marriage is built on a strong community.`);
        if (cfg.blessing) parts.push(`May your engagement be filled with joy, your wedding be everything you dreamed, and your marriage be even more beautiful than either.`);
        if (cfg.toast) parts.push(`Raise your glasses — to ${names || 'the happy couple'}! Congratulations on your engagement!`);
        return parts.join('\n\n');
      },
      anniversary: () => {
        let parts: string[] = [];
        parts.push(`Family and friends, thank you for joining us to celebrate the anniversary of ${names || 'this wonderful couple'}.${roleIntro}`);
        parts.push(`An anniversary is more than a date on a calendar — it is a testament. It says: we chose each other, and we kept choosing each other, through every joy and every challenge that came our way.`);
        if (cfg.story) parts.push(`${names || 'This couple'} has shown us what commitment looks like — not in grand gestures, but in the quiet, daily acts of love. The patience, the forgiveness, the laughter shared over simple meals, the storms weathered side by side.`);
        parts.push(`In a world where so much is temporary, your love is a reminder that some things are built to last. Each year together has added a new chapter to a story that keeps getting better.`);
        if (cfg.extra) parts.push(`To the children and grandchildren: you are the living proof of their love. Every one of you is a branch on a tree they planted together.`);
        if (cfg.blessing) parts.push(`May God grant you many more years of health, happiness, and togetherness. May your love grow deeper with every anniversary you celebrate.`);
        if (cfg.toast) parts.push(`Raise your glasses — to ${names || 'this beautiful couple'}! Happy anniversary, and here's to many more!`);
        return parts.join('\n\n');
      },
      conference: () => {
        let parts: string[] = [];
        parts.push(`Distinguished guests, colleagues, and partners — good morning and welcome to ${names || "today's conference"}.${roleIntro}`);
        parts.push(`We gather here today because we believe in the power of ideas, the value of collaboration, and the importance of the conversations that happen in rooms like this one. Each of you brings a perspective that matters.`);
        if (cfg.story) parts.push(`This conference was born from a simple idea — that when we come together, share knowledge, and challenge each other's thinking, we all move forward. Today, we have an incredible lineup of speakers and sessions designed to do exactly that.`);
        parts.push(`Over the next few hours, I encourage you to not just listen, but to engage. Ask questions. Challenge assumptions. Connect with the person sitting next to you. The most valuable outcomes of this conference will not be the slides — they will be the conversations.`);
        if (cfg.extra) parts.push(`To our sponsors and partners: thank you for making this possible. Your support is an investment in the future of this industry.`);
        if (cfg.blessing) parts.push(`May this conference spark new ideas, new partnerships, and new possibilities. May we leave here today better than we arrived.`);
        if (cfg.toast) parts.push(`Please raise your glasses — to a successful conference, to new connections, and to the ideas that will shape our future. Cheers!`);
        return parts.join('\n\n');
      },
      concert: () => {
        let parts: string[] = [];
        parts.push(`Ladies and gentlemen — welcome to ${names || "tonight's show"}! Are you ready?${roleIntro}`);
        parts.push(`Tonight is about music, energy, and the kind of memories that last long after the last song fades. We have an incredible show lined up for you, and we are so glad you are here to be part of it.`);
        if (cfg.story) parts.push(`${names || 'This artist'} has poured heart and soul into tonight's performance. Every song, every beat, every note — it is all for you. So I want you to feel every moment, sing every word, and make this a night to remember.`);
        parts.push(`Before we get started, a few quick reminders: keep your phones charged for the moments you will want to remember, but do not forget to put them down and live in the moment too. The best memories are the ones you experience, not the ones you record.`);
        if (cfg.extra) parts.push(`To the crew, the band, and everyone behind the scenes: tonight would not be possible without you. Let us give them a round of applause.`);
        if (cfg.blessing) parts.push(`May this night be everything you hoped for and more. May the music move you, the energy lift you, and the memories stay with you forever.`);
        if (cfg.toast) parts.push(`Raise your glasses — to ${names || "tonight's artist"}, to the music, and to a night we will never forget. Let's go!`);
        return parts.join('\n\n');
      },
    };

    return (speeches[type] || speeches.wedding)();
  };

  const generateProgram = (type: string): string => {
    const programs: Record<string, string> = {
      wedding: `WEDDING DAY PROGRAM

12:00 PM - Guest Arrival & Ushering
12:30 PM - Procession & Seating of Parents
1:00 PM - Opening Prayer & Welcome Address
1:15 PM - Introduction of the Couple
1:30 PM - Sermon / Marriage Counsel
2:00 PM - Exchange of Vows & Rings
2:15 PM - Pronouncement & Kiss
2:30 PM - Couple's Exit & Photo Session
3:00 PM - Grand Entrance to Reception
3:15 PM - Cutting of the Cake
3:30 PM - Toasts & Speeches
4:00 PM - First Dance
4:15 PM - Food Service Begins
5:00 PM - Groom & Bride's Family Dance
5:30 PM - Open Dance Floor
6:30 PM - Couple's Thank You & Favour Distribution
7:00 PM - Closing Remarks & Prayer
7:15 PM - Departure of Guests`,

      birthday: `BIRTHDAY CELEBRATION PROGRAM

4:00 PM - Guest Arrival & Registration
4:30 PM - Red Carpet & Photo Session
5:00 PM - Opening Prayer & Welcome Address
5:15 PM - Introduction of the Celebrant
5:30 PM - celebrant's Grand Entrance
5:45 PM - First Dance (Celebrant)
6:00 PM - Cutting of the Cake
6:15 PM - Toasts & Tributes from Family/Friends
6:45 PM - Food Service Begins
7:00 PM - Games & Entertainment
7:45 PM - Surprise Performance / Video Messages
8:00 PM - Open Dance Floor
9:00 PM - celebrant's Thank You Speech
9:15 PM - Group Photos & Favour Distribution
9:30 PM - Closing Remarks
10:00 PM - After-Party Begins`,

      burial: `MEMORIAL SERVICE PROGRAM

8:00 AM - Lying-in-State / Viewing
9:00 AM - Procession & Seating
9:30 AM - Opening Hymn & Prayer
9:45 AM - Welcome Address by Family
10:00 AM - Tributes from Family Members
10:30 AM - Tributes from Friends & Colleagues
11:00 AM - Sermon / Homily
11:30 AM - Eulogy
12:00 PM - Final Viewing
12:30 PM - Closing Hymn & Prayers
12:45 PM - Casket Exit & Procession to Graveside
1:00 PM - Interment / Burial Rites
1:30 PM - Prayers at Graveside
2:00 PM - Refreshments for Guests
4:00 PM - Family Thanksgiving (Optional)`,

      bridal: `BRIDAL SHOWER PROGRAM

2:00 PM - Guests Arrival & Welcome Drinks
2:30 PM - Icebreaker Games
3:00 PM - Bride's Grand Entrance
3:15 PM - Opening Prayer & Welcome
3:30 PM - Games Round 1 (Who Knows the Bride?)
4:00 PM - Food & Drinks Service
4:30 PM - Advice Session (Guests share marriage advice)
5:00 PM - Games Round 2 (Wedding Dress Challenge)
5:30 PM - Gift Unwrapping
6:00 PM - Heartfelt Messages & Toasts
6:15 PM - Cake Cutting
6:30 PM - Photo Session
7:00 PM - Open Mingling & Music
8:00 PM - Closing & Thank You`,

      naming: `NAMING CEREMONY PROGRAM

10:00 AM - Guest Arrival & Seating
10:30 AM - Opening Prayer
10:45 AM - Welcome Address by Parents
11:00 AM - Introduction of the Child
11:15 AM - Symbolic Items Presentation (Honey, Salt, Water, etc.)
11:30 AM - Naming of the Child by Parents
11:45 AM - Blessings from Grandparents / Elders
12:00 PM - Prayers for the Child
12:15 PM - Family & Guest Tributes
12:30 PM - Food & Drinks Service
1:00 PM - Photo Session
1:30 PM - Gift Presentation
2:00 PM - Closing Prayer & Thanksgiving
2:15 PM - Departure of Guests`,

      traditional: `TRADITIONAL WEDDING PROGRAM

10:00 AM - Guests Arrival & Seating
10:30 AM - Groom's Family Arrival (Knocking on the Door)
11:00 AM - Introduction of Both Families
11:30 AM - Bride's Family Welcome Address
12:00 PM - Presentation of Proposal Letter
12:15 PM - Acceptance & Bride Price Discussion
12:30 PM - Presentation of Traditional Items
1:00 PM - Bride's Grand Entrance
1:15 PM - Acceptance by Bride
1:30 PM - Blessing of the Union by Elders
2:00 PM - Food & Drinks Service
3:00 PM - Cultural Dances & Entertainment
4:00 PM - Couple's Dance & Photo Session
4:30 PM - Gift Exchange
5:00 PM - Closing Remarks & Prayers
5:30 PM - Departure of Guests`,

      corporate: `CORPORATE EVENT PROGRAM

5:00 PM - Guest Registration & Networking
5:30 PM - Welcome Drinks & Hors d'oeuvres
6:00 PM - Opening Remarks by MC
6:15 PM - National Anthem / Opening Prayer
6:30 PM - Chairman's Welcome Address
6:45 PM - Keynote Presentation
7:15 PM - Awards / Recognition Segment
8:00 PM - Dinner Service
8:45 PM - Entertainment / Cultural Performance
9:15 PM - Vote of Thanks
9:30 PM - Closing Remarks
9:45 PM - Group Photos & Networking
10:00 PM - Departure`,

      engagement: `ENGAGEMENT CEREMONY PROGRAM

2:00 PM - Guest Arrival & Seating
2:30 PM - Introduction of Families
3:00 PM - Groom's Family Presentation
3:15 PM - Proposal & Acceptance
3:30 PM - Ring Exchange & Blessing
3:45 PM - Couple's First Public Appearance
4:00 PM - Photo Session
4:30 PM - Toasts & Congratulations
5:00 PM - Food & Drinks Service
5:30 PM - Entertainment & Music
6:30 PM - Dance Floor Opens
7:30 PM - Closing Remarks
8:00 PM - Departure`,

      anniversary: `ANNIVERSARY CELEBRATION PROGRAM

4:00 PM - Guest Arrival & Welcome Drinks
4:30 PM - Red Carpet & Photo Session
5:00 PM - Opening Prayer & Welcome Address
5:15 PM - Couple's Grand Entrance
5:30 PM - Love Story Retelling (Video / Narration)
6:00 PM - Renewal of Vows (Optional)
6:15 PM - Toasts from Children & Family
6:45 PM - Cutting of the Cake
7:00 PM - Food Service Begins
7:30 PM - Couple's Dance
7:45 PM - Open Dance Floor
9:00 PM - Couple's Thank You
9:15 PM - Group Photos & Favors
9:30 PM - Closing Remarks`,

      conference: `CONFERENCE / SEMINAR PROGRAM

8:00 AM - Registration & Welcome Coffee
9:00 AM - Opening Remarks by MC
9:15 AM - Keynote Address
10:00 AM - Panel Discussion 1
10:45 AM - Tea Break & Networking
11:15 AM - Breakout Sessions
12:30 PM - Lunch Break
1:30 PM - Panel Discussion 2
2:15 PM - Workshop / Interactive Session
3:30 PM - Coffee Break
4:00 PM - Fireside Chat / Q&A
4:45 PM - Awards / Recognition
5:00 PM - Closing Remarks & Vote of Thanks
5:15 PM - Group Photos & Networking
6:00 PM - Departure`,

      concert: `CONCERT / PARTY PROGRAM

6:00 PM - Gates Open & Guest Arrival
7:00 PM - Opening Act / DJ Set
7:45 PM - MC Welcome & Introductions
8:00 PM - Supporting Performance 1
8:45 PM - Short Break / Intermission
9:00 PM - Supporting Performance 2
9:30 PM - Main Artist Entrance
10:30 PM - Headline Performance
11:15 PM - Encore / Special Guest
11:30 PM - Crowd Interaction & Photos
12:00 AM - After-Party Begins`,
    };

    return programs[type] || programs.wedding;
  };

  const generateHighlights = (type: string): string => {
    const highlights: Record<string, string> = {
      wedding: `WEDDING HIGHLIGHT REEL CONCEPT

Opening: Slow-motion bride preparation (10s)
Scene 1: Groom's anticipation (8s)
Scene 2: Guest arrivals & excitement (15s)
Scene 3: Traditional / church ceremony (20s)
Scene 4: Vows & ring exchange (15s)
Scene 5: The kiss & cheering crowd (8s)
Scene 6: Grand reception entrance (10s)
Scene 7: Cake cutting & toasts (12s)
Scene 8: First dance (15s)
Scene 9: Emotional family moments (10s)
Scene 10: Dance floor energy (15s)
Closing: Slow-motion couple exit (8s)

Total Runtime: ~2 minutes
Music: Romantic Afro-pop or traditional fusion`,

      birthday: `BIRTHDAY HIGHLIGHT REEL CONCEPT

Opening: Countdown & venue reveal (5s)
Scene 1: Guest arrivals & red carpet (15s)
Scene 2: Celebrant's grand entrance (10s)
Scene 3: Surprise reactions (10s)
Scene 4: Cake cutting moment (12s)
Scene 5: Emotional tributes (15s)
Scene 6: Dance floor highlights (20s)
Scene 7: Group photos & laughter (10s)
Closing: Slow-motion celebration (8s)

Total Runtime: ~1.5 minutes
Music: Upbeat Afrobeat / celebratory`,

      burial: `MEMORIAL TRIBUTE VIDEO CONCEPT

Opening: Soft instrumental, photo montage of life (20s)
Scene 1: Family tributes (15s)
Scene 2: Friends & colleagues tributes (15s)
Scene 3: Service highlights (20s)
Scene 4: Final procession (15s)
Scene 5: Graveside prayers (10s)
Closing: "In Loving Memory" title card (10s)

Total Runtime: ~1.5 minutes
Music: Solemn, respectful instrumental / hymn`,

      bridal: `BRIDAL SHOWER HIGHLIGHT REEL CONCEPT

Opening: Decor & setup reveal (8s)
Scene 1: Guests arriving & greeting (10s)
Scene 2: Bride's surprise entrance (12s)
Scene 3: Games & laughter (20s)
Scene 4: Gift unwrapping reactions (15s)
Scene 5: Advice session moments (10s)
Scene 6: Toasts & emotional speeches (15s)
Closing: Group photo & well wishes (8s)

Total Runtime: ~1.5 minutes
Music: Light, fun, feel-good`,

      naming: `NAMING CEREMONY HIGHLIGHT REEL CONCEPT

Opening: Baby & decor reveal (10s)
Scene 1: Guest arrivals (8s)
Scene 2: Traditional item presentation (15s)
Scene 3: Naming moment (12s)
Scene 4: Elder's blessings (15s)
Scene 5: Family joy & reactions (10s)
Scene 6: Photo session (8s)
Closing: Blessing for the child (10s)

Total Runtime: ~90 seconds
Music: Soft, joyful, cultural`,

      traditional: `TRADITIONAL WEDDING HIGHLIGHT REEL CONCEPT

Opening: Both families arriving (10s)
Scene 1: Knocking on the door (12s)
Scene 2: Traditional items display (15s)
Scene 3: Bride's grand entrance (10s)
Scene 4: Acceptance & blessings (15s)
Scene 5: Cultural dances (20s)
Scene 6: Couple's dance (10s)
Scene 7: Joy & celebration (10s)
Closing: Family unity shot (8s)

Total Runtime: ~110 seconds
Music: Traditional drums & cultural fusion`,

      corporate: `CORPORATE EVENT HIGHLIGHT REEL CONCEPT

Opening: Venue & branding reveal (8s)
Scene 1: Guest networking (12s)
Scene 2: Keynote / presentations (15s)
Scene 3: Awards & recognition (20s)
Scene 4: Applause & reactions (10s)
Scene 5: Entertainment performance (15s)
Scene 6: Group photos (8s)
Closing: Brand logo & tagline (5s)

Total Runtime: ~90 seconds
Music: Professional, upbeat corporate`,

      engagement: `ENGAGEMENT HIGHLIGHT REEL CONCEPT

Opening: Venue & decor (8s)
Scene 1: Family introductions (10s)
Scene 2: Proposal moment (15s)
Scene 3: Ring exchange (12s)
Scene 4: Couple's first appearance (10s)
Scene 5: Joy & congratulations (15s)
Scene 6: Dance & celebration (15s)
Closing: Slow-motion couple (8s)

Total Runtime: ~90 seconds
Music: Romantic Afro-pop`,

      anniversary: `ANNIVERSARY HIGHLIGHT REEL CONCEPT

Opening: Throwback wedding photos (15s)
Scene 1: Guest arrivals & greetings (10s)
Scene 2: Couple's grand entrance (12s)
Scene 3: Love story narration with photos (20s)
Scene 4: Vow renewal moment (15s)
Scene 5: Children's tribute (12s)
Scene 6: Cake cutting & toast (10s)
Scene 7: Dance floor highlights (15s)
Closing: Slow-motion couple embrace (8s)

Total Runtime: ~2 minutes
Music: Classic love songs / nostalgic`,

      conference: `CONFERENCE HIGHLIGHT REEL CONCEPT

Opening: Venue & branding reveal (8s)
Scene 1: Registration & networking (12s)
Scene 2: Keynote highlights (15s)
Scene 3: Panel discussion moments (15s)
Scene 4: Audience engagement (10s)
Scene 5: Breakout sessions (12s)
Scene 6: Awards / recognition (15s)
Scene 7: Group photo (8s)
Closing: Brand logo & tagline (5s)

Total Runtime: ~100 seconds
Music: Professional, upbeat corporate`,

      concert: `CONCERT HIGHLIGHT REEL CONCEPT

Opening: Crowd anticipation & lights (10s)
Scene 1: Gates opening & energy (12s)
Scene 2: Opening act performance (15s)
Scene 3: Crowd reactions & dancing (20s)
Scene 4: Main artist entrance (12s)
Scene 5: Peak performance moments (20s)
Scene 6: Special guest surprise (10s)
Scene 7: Crowd singing along (15s)
Closing: Confetti & final bow (8s)

Total Runtime: ~2 minutes
Music: High-energy Afrobeat / live performance`,
    };

    return highlights[type] || highlights.wedding;
  };

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      if (activeTab === 'speech') {
        setGenerated(generateSpeech(input.eventType, input.names, input.speakerRole, speechLength));
      } else if (activeTab === 'program') {
        setGenerated(generateProgram(input.eventType));
      } else {
        setGenerated(generateHighlights(input.eventType));
      }
      setGenerating(false);
    }, 2000);
  };

  return (
    <div className="glass-card gold-border rounded-2xl p-6 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '400ms' }}>
      <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/5 to-transparent pointer-events-none" />
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center animate-pulse">
          <Sparkles size={20} className="text-gold-400" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-white">AI Event Planner</h3>
          <p className="text-white/70 text-sm">Generate speeches, programs & concepts</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 relative z-10">
        {(['speech', 'program', 'highlights'] as const).map((tab, i) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setGenerated(''); }}
            className={`flex-1 py-2 rounded-lg text-xs uppercase tracking-widest transition-all animate-pop-in ${activeTab === tab ? 'bg-gold-500/20 border border-gold-500/40 text-gold-400 shadow-lg shadow-gold-500/10' : 'bg-dark-card border border-dark-border text-white/70 hover:border-gold-500/30'}`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="space-y-3 mb-4 relative z-10">
        <select
          value={input.eventType}
          onChange={(e) => setInput({ ...input, eventType: e.target.value })}
          className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold-500/50 transition-all"
        >
          {eventOptions.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-dark-card">{opt.label}</option>
          ))}
        </select>

        {activeTab === 'speech' && (
          <>
            <input
              type="text"
              placeholder="Names (e.g., Tunde & Funke, or the celebrant's name)"
              value={input.names}
              onChange={(e) => setInput({ ...input, names: e.target.value })}
              className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-all animate-slide-in-down"
            />
            <input
              type="text"
              placeholder="Your role (e.g., Best man, Father of the bride, Friend)"
              value={input.speakerRole}
              onChange={(e) => setInput({ ...input, speakerRole: e.target.value })}
              className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
            />
            <div>
              <p className="text-white/70 text-xs mb-2">Speech Length</p>
              <div className="flex gap-2">
                {(['short', 'medium', 'long'] as const).map(len => (
                  <button
                    key={len}
                    onClick={() => setSpeechLength(len)}
                    className={`flex-1 py-1.5 rounded-lg text-xs capitalize transition-all ${speechLength === len ? 'bg-gold-500/20 border border-gold-500/40 text-gold-400' : 'bg-dark-card border border-dark-border text-white/70 hover:border-gold-500/30'}`}
                  >
                    {len}
                    <span className="block text-[9px] text-white/50 mt-0.5">
                      {len === 'short' ? '~1 min' : len === 'medium' ? '~3 min' : '~5 min'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <button onClick={generate} className="btn-gold w-full text-sm mb-4 relative z-10 hover:scale-[1.02] transition-transform" disabled={generating}>
        {generating ? (
          <span className="flex items-center gap-2 justify-center">
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
        <div className="glass-dark rounded-lg p-4 relative z-10 animate-pop-in">
          <pre className="text-white/90 text-sm whitespace-pre-wrap font-sans">{generated}</pre>
          <div className="flex gap-2 mt-4">
            <button onClick={() => navigator.clipboard.writeText(generated)} className="flex-1 btn-outline-gold text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
              <Plus size={12} className="rotate-45" />
              Copy
            </button>
            <button onClick={() => {
              const msg = `Hi BELSH! I generated this ${activeTab}: ${generated.substring(0, 200)}... Can we use this for my event?`;
              window.open(`https://wa.me/2348035672491?text=${encodeURIComponent(msg)}`, '_blank');
            }} className="flex-1 btn-gold text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
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
    { id: 'planner', label: 'Plan Event', icon: Wand2 },
    { id: 'rsvp', label: 'RSVP', icon: UserCheck },
    { id: 'memory', label: 'Memories', icon: GalleryVerticalEnd },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'ai', label: 'AI Tools', icon: Sparkles },
  ];

  const navigate = (page: Page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <Confetti style="celebration" active={showConfetti} />

      {/* Hero */}
      <section className="page-hero text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(85,33,160,0.4)_0%,transparent_70%)]" />
        <FloatingDots color="mixed" count={20} size="sm" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent" />

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="flex justify-center mb-5 opacity-0 animate-fade-in-up">
            <div className="w-14 h-14 rounded-full bg-purple-600/40 border border-gold-500/30 flex items-center justify-center">
              <Crown size={24} className="text-gold-400" />
            </div>
          </div>
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4 opacity-0 animate-fade-in-up">Event Planning Suite</p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4 opacity-0 animate-fade-in-up-2 leading-tight">
            Premium <span className="italic gold-text">Tools</span>
          </h1>
          <div className="section-divider" />
          <p className="text-white/80/80 text-base sm:text-lg max-w-xl mx-auto mt-4 opacity-0 animate-fade-in-up-3">
            Your all-in-one event planning ecosystem. Count down, create invitations, plan events, and manage guests.
          </p>
        </div>
      </section>

      {/* Section Navigation */}
      <section className="sticky top-16 md:top-20 z-40 bg-dark/90 backdrop-blur-md border-b border-dark-border py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {sections.map(({ id, label, icon: Icon }, i) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-all animate-pop-in ${activeSection === id
                  ? 'bg-gold-500/20 border border-gold-500/40 text-gold-400 shadow-lg shadow-gold-500/10'
                  : 'bg-dark-card border border-dark-border text-white/80 hover:border-gold-500/30'
                }`}
                style={{ animationDelay: `${i * 50}ms` }}
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
            {activeSection === 'invitation' && <PlanMyEvent />}
            {activeSection === 'planner' && <PlanMyEvent />}
            {activeSection === 'planner' && <RSVPManager />}
            {activeSection === 'rsvp' && <RSVPManager />}
            {activeSection === 'rsvp' && <MemoryWall />}
            {activeSection === 'memory' && <MemoryWall />}
            {activeSection === 'budget' && <BudgetCalculator />}
            {activeSection === 'budget' && <AIEventPlanner />}
            {activeSection === 'ai' && <AIEventPlanner />}
            {activeSection === 'ai' && <CountdownTimer />}
          </div>
        </div>
      </section>

      {/* Social CTA */}
      <section className="py-12 bg-purple-800/30 border-t border-dark-border text-center">
        <div className="max-w-xl mx-auto px-6">
          <p className="text-white/80 text-sm mb-4">Interested in our Ready-to-Wear services?</p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-700/50 to-gold-700/50 border border-gold-500/30 hover:border-gold-500/60 transition-all hover:scale-105 hover:shadow-lg hover:shadow-gold-500/20"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig-grad-pf)" />
              <rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="white" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="4.5" fill="none" stroke="white" strokeWidth="1.5" />
              <circle cx="17.5" cy="6.5" r="1.3" fill="white" />
              <defs>
                <linearGradient id="ig-grad-pf" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#feda75" />
                  <stop offset="0.3" stopColor="#fa7e1e" />
                  <stop offset="0.6" stopColor="#d62976" />
                  <stop offset="1" stopColor="#962fbf" />
                </linearGradient>
              </defs>
            </svg>
            <div className="text-left">
              <p className="text-gold-400 text-sm font-medium">@rtw_by_belsh</p>
              <p className="text-white/70 text-xs">Follow us or contact on Instagram</p>
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}
