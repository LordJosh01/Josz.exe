import { useState, useEffect, useRef } from 'react';
import {
  Calendar, Users, Sparkles, Camera, Heart, Clock,
  CheckCircle, Bell, Gift, Crown, Wand2,
  MessageCircle, Plus, Trash2, Mail, Phone,
  PartyPopper, UserCheck, GalleryVerticalEnd,
  RefreshCw, Play, Image, Instagram, Upload, X, Star
} from 'lucide-react';
import Confetti from '../components/Confetti';
import FloatingDots from '../components/FloatingDots';

type Page = 'home' | 'services' | 'portfolio' | 'about' | 'faq' | 'contact' | 'premium' | 'eventai';

interface PremiumFeaturesProps {
  onNavigate: (page: Page) => void;
}

const WHATSAPP_URL = 'https://wa.me/2348035672491?text=Hi%20BELSH!%20I%27d%20like%20to%20inquire%20about%20planning%20my%20event.';
const INSTAGRAM_URL = 'https://www.instagram.com/rtw_by_belsh';

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

          <button onClick={() => { setCountdown(null); setEventDate(''); }} className="text-sm text-white/70 hover:text-gold-300 transition-colors w-full text-center">
            Reset Countdown
          </button>
        </div>
      )}

      {savedEvents.length > 0 && (
        <div className="mt-6 pt-6 border-t border-dark-border relative z-10">
          <p className="text-white/70 text-xs uppercase tracking-widest mb-3">My Events</p>
          <div className="space-y-2">
            {savedEvents.map((event, i) => (
              <div key={i} className="flex items-center justify-between glass-dark rounded-lg p-3 hover:border-gold-500/30 transition-all group">
                <div>
                  <p className="text-white text-sm">{event.name}</p>
                  <p className="text-white/70 text-xs">{new Date(event.date).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEventName(event.name); setEventDate(event.date); }} className="text-white/70 hover:text-gold-400">
                    <Play size={14} />
                  </button>
                  <button onClick={() => removeEvent(i)} className="text-white/70 hover:text-red-400">
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
    theme: 'elegant',
    primaryColor: '#d4a017',
    photo: '',
    style: 'classic',
  });
  const [customBg, setCustomBg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const templates = [
    { id: 'wedding', name: 'Wedding Classic', icon: Heart, preview: 'Elegant wedding invitation with romantic details' },
    { id: 'birthday', name: 'Birthday Bash', icon: PartyPopper, preview: 'Fun and colorful birthday celebration' },
    { id: 'corporate', name: 'Corporate Event', icon: Gift, preview: 'Professional and sophisticated business event' },
    { id: 'traditional', name: 'Traditional', icon: Crown, preview: 'Cultural celebration with traditional styling' },
    { id: 'baby', name: 'Baby Shower', icon: Sparkles, preview: 'Soft and sweet baby shower invitation' },
    { id: 'engagement', name: 'Engagement', icon: Star, preview: 'Romantic engagement party invitation' },
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
    const text = `${invitation.title}%0A%0A${invitation.event}%0ADate: ${invitation.date}%0ATime: ${invitation.time}%0AVenue: ${invitation.venue}%0A%0A${invitation.message}%0A%0A- ${invitation.host}`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`You're Invited to ${invitation.event}!`);
    const body = encodeURIComponent(`${invitation.title}\n\n${invitation.event}\nDate: ${invitation.date}\nTime: ${invitation.time}\nVenue: ${invitation.venue}\n\n${invitation.message}\n\n- ${invitation.host}`);
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
    const bgColor = themes.find(t => t.id === invitation.theme)?.colors[1] || '#150829';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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

          // Draw text
          ctx.textAlign = 'center';
          ctx.fillStyle = '#d4a017';
          ctx.font = '24px Georgia, serif';
          ctx.fillText(invitation.title.toUpperCase(), canvas.width / 2, 300);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 48px Georgia, serif';
          ctx.fillText(invitation.event || 'Your Event', canvas.width / 2, 400);

          ctx.font = '24px sans-serif';
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
            ctx.fillStyle = '#d4a017';
            ctx.fillText(`Hosted by ${invitation.host}`, canvas.width / 2, 850);
          }

          // Download
          const link = document.createElement('a');
          link.download = `invitation-${invitation.event || 'event'}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
          resolve();
        };
        img.onerror = () => resolve();
      });
    } else {
      // Draw text without background image
      ctx.textAlign = 'center';
      ctx.fillStyle = '#d4a017';
      ctx.font = '24px Georgia, serif';
      ctx.fillText(invitation.title.toUpperCase(), canvas.width / 2, 300);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Georgia, serif';
      ctx.fillText(invitation.event || 'Your Event', canvas.width / 2, 400);

      ctx.font = '24px sans-serif';
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
        ctx.fillStyle = '#d4a017';
        ctx.fillText(`Hosted by ${invitation.host}`, canvas.width / 2, 850);
      }

      // Download
      const link = document.createElement('a');
      link.download = `invitation-${invitation.event || 'event'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
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
            placeholder="Venue"
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
          </div>

          {/* Background */}
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
            className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl hover:shadow-gold-500/20 transition-shadow duration-500"
            style={{ backgroundColor: activeTheme?.colors[1] || '#150829' }}
          >
            {activeBackground && (
              <img src={activeBackground} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            )}

            {/* Style-based layouts */}
            <div className="absolute inset-0 p-6">
              {invitation.style === 'classic' && (
                <div className="h-full flex flex-col items-center justify-center text-center">
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
              )}

              {invitation.style === 'modern' && (
                <div className="h-full flex">
                  <div className="flex-1 flex flex-col justify-center text-left">
                    <p className="text-gold-400 text-xs tracking-widest uppercase mb-2">{invitation.title}</p>
                    <h2 className="font-serif text-3xl text-white">{invitation.event || 'Your Event'}</h2>
                  </div>
                  <div className="flex-1 flex flex-col justify-center items-end text-right">
                    <p className="text-white/80 text-sm mb-1">{invitation.date}</p>
                    <p className="text-white/80 text-sm mb-1">{invitation.time}</p>
                    <p className="text-white/80 text-sm">{invitation.venue}</p>
                    {invitation.host && (
                      <p className="text-gold-400 text-xs mt-4">- {invitation.host}</p>
                    )}
                  </div>
                </div>
              )}

              {invitation.style === 'minimal' && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <h2 className="font-serif text-3xl text-white mb-6">{invitation.event || 'Your Event'}</h2>
                  <div className="w-16 h-px bg-gold-500/50 mb-6" />
                  <div className="text-white/80 text-sm space-y-1">
                    <p>{invitation.date} | {invitation.time}</p>
                    <p>{invitation.venue}</p>
                  </div>
                </div>
              )}

              {invitation.style === 'floral' && (
                <div className="h-full flex flex-col items-center justify-center text-center border-2 border-gold-500/30 m-4 rounded-xl p-4">
                  <div className="absolute top-2 left-2 text-gold-400/50 text-2xl">❀</div>
                  <div className="absolute top-2 right-2 text-gold-400/50 text-2xl">❀</div>
                  <div className="absolute bottom-2 left-2 text-gold-400/50 text-2xl">❀</div>
                  <div className="absolute bottom-2 right-2 text-gold-400/50 text-2xl">❀</div>
                  <p className="text-gold-400 text-xs tracking-widest uppercase mb-2">{invitation.title}</p>
                  <h2 className="font-serif text-2xl text-white mb-4">{invitation.event || 'Your Event'}</h2>
                  <div className="space-y-2">
                    <p className="text-white/80 text-sm">{invitation.date}</p>
                    <p className="text-white/80 text-sm">{invitation.time}</p>
                    <p className="text-white/80 text-sm">{invitation.venue}</p>
                  </div>
                  {invitation.host && (
                    <p className="text-gold-400 text-xs mt-4">~ {invitation.host}</p>
                  )}
                </div>
              )}

              {invitation.style === 'bold' && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <h2 className="font-serif text-5xl text-white mb-6 leading-tight">{invitation.event || 'Your Event'}</h2>
                  <p className="text-gold-400 text-lg tracking-widest uppercase">{invitation.date}</p>
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
    const msg = `Hi BELSH Events! I'd like to plan a ${plan.eventType} for ${plan.guestCount} guests on ${plan.date}. My preferred style is ${plan.style}. Venue: ${plan.venue}, Entertainment: ${plan.entertainment}, Meals: ${plan.meals}. Can we discuss further?`;
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
                {['Wedding', 'Birthday', 'Corporate', 'Anniversary', 'Baby Shower', 'Naming Ceremony'].map((type) => (
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
                {['Indoor Hall', 'Outdoor Garden', 'Hotel Ballroom', 'Traditional Setting', 'Beach/Lakeside', 'Private Residence'].map((venue) => (
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
                {['Classic Elegant', 'Modern Minimalist', 'Traditional Nigerian', 'Bohemian', 'Luxury Glam', 'Rustic Charm'].map((style) => (
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
                <p className="text-sm text-white/80 mb-2">Do you need entertainment?</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Live Band', 'DJ', 'Cultural Performers', 'Comedian/MC'].map((ent) => (
                    <button
                      key={ent}
                      onClick={() => setPlan({ ...plan, entertainment: ent })}
                      className={`py-3 px-4 rounded-lg text-sm transition-all hover:scale-[1.02] ${plan.entertainment === ent ? 'bg-gold-500/20 border border-gold-500 text-gold-400 shadow-lg shadow-gold-500/10' : 'bg-dark-card border border-dark-border text-white/80 hover:border-gold-500/40'}`}
                    >
                      {ent}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-white/80 mb-2">Meal service preference?</p>
                <div className="grid grid-cols-3 gap-3">
                  {['Buffet', 'Plated', 'Cocktail'].map((meal) => (
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
              <div className="glass-dark rounded-xl p-4 space-y-4 animate-pop-in">
                {[
                  { label: 'Event', value: plan.eventType },
                  { label: 'Guests', value: plan.guestCount },
                  { label: 'Date', value: plan.date },
                  { label: 'Venue', value: plan.venue },
                  { label: 'Style', value: plan.style },
                  { label: 'Entertainment', value: plan.entertainment },
                  { label: 'Meals', value: plan.meals },
                ].map((item, i) => (
                  <div key={item.label} className="flex items-center gap-2 animate-slide-in-left" style={{ animationDelay: `${i * 100}ms` }}>
                    <CheckCircle size={16} className="text-gold-400" />
                    <span className="text-sm text-white/80">{item.label}: <span className="text-white">{item.value}</span></span>
                  </div>
                ))}
              </div>

              <button onClick={sharePlan} className="btn-gold w-full text-sm hover:scale-[1.02] transition-all hover:shadow-lg hover:shadow-gold-500/20">
                <MessageCircle size={16} className="mr-2" />
                Book This Plan on WhatsApp
              </button>

              <button onClick={() => { setStep(1); setGenerated(false); setPlan({ eventType: '', guestCount: '', date: '', venue: '', style: '', meals: '', entertainment: '' }); }} className="text-sm text-white/70 hover:text-gold-300 w-full text-center transition-colors">
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

  const removeGuest = (index: number) => {
    setGuests(guests.filter((_, i) => i !== index));
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
          placeholder="Guest Name"
          value={newGuest.name}
          onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
          className="bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
        />
        <input
          type="tel"
          placeholder="Phone (e.g., +234...)"
          value={newGuest.phone}
          onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
          className="bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
        />
      </div>
      <button onClick={addGuest} className="btn-gold w-full text-sm mb-6 relative z-10 hover:scale-[1.02] transition-transform">
        <Plus size={14} />
        Add Guest
      </button>

      {/* Guest List */}
      <div className="space-y-2 max-h-64 overflow-y-auto relative z-10">
        {guests.map((guest, i) => (
          <div key={i} className="flex items-center justify-between glass-dark rounded-lg p-3 hover:border-gold-500/30 transition-all group animate-slide-in-right" style={{ animationDelay: `${i * 50}ms` }}>
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
                onChange={(e) => updateStatus(i, e.target.value as any)}
                className="bg-dark-card border border-dark-border rounded px-2 py-1 text-xs text-white focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="attending">Attending</option>
                <option value="declined">Declined</option>
              </select>
              <button onClick={() => sendReminder(guest.phone, guest.name)} className="text-white/70 hover:text-gold-400 transition-colors">
                <MessageCircle size={14} />
              </button>
              <button onClick={() => removeGuest(i)} className="text-white/70 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
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
  const [memories, setMemories] = useState<{ id: string; name: string; message: string; photo: string; date: string }[]>([]);
  const [newMemory, setNewMemory] = useState({ name: '', message: '' });
  const [newPhoto, setNewPhoto] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load memories from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('belsh_memories');
    if (saved) {
      setMemories(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever memories change
  useEffect(() => {
    localStorage.setItem('belsh_memories', JSON.stringify(memories));
  }, [memories]);

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

  const addMemory = () => {
    if (newMemory.name && newMemory.message) {
      const memory = {
        id: Date.now().toString(),
        name: newMemory.name,
        message: newMemory.message,
        photo: newPhoto,
        date: new Date().toLocaleDateString(),
      };
      setMemories([memory, ...memories]);
      setNewMemory({ name: '', message: '' });
      setNewPhoto('');
    }
  };

  const removeMemory = (id: string) => {
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
              <p className="text-white0 text-[10px]">{memory.date}</p>
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

// 6. VIP CLIENT PORTAL with Contact Button
function VIPPortal({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const exclusiveOffers = [
    { title: 'Priority Booking', desc: 'Book your dates before anyone else', icon: Crown },
    { title: 'Private Consultation', desc: '1-on-1 session with our lead planner', icon: Calendar },
    { title: 'Exclusive Discounts', desc: 'Special rates on premium packages', icon: Gift },
    { title: 'VIP Support', desc: '24/7 dedicated support line', icon: Phone },
  ];

  return (
    <div className="glass-card gold-border rounded-2xl p-6 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '350ms' }}>
      <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl" />

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-full bg-gold-900/40 flex items-center justify-center animate-icon-bounce">
          <Crown size={20} className="text-gold-400" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-white">VIP Client Portal</h3>
          <p className="text-white/70 text-sm">Exclusive benefits for premium clients</p>
        </div>
      </div>

      <div className="text-center py-6 relative z-10">
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 bg-gold-500/20 rounded-full blur-xl animate-pulse" />
          <Crown size={48} className="text-gold-400 relative z-10 animate-float" />
        </div>
        <p className="text-white/80 mb-4">Access exclusive tools and benefits</p>

        <button
          onClick={() => onNavigate('contact')}
          className="btn-gold text-sm hover:scale-105 transition-all hover:shadow-lg hover:shadow-gold-500/30"
        >
          <Sparkles size={14} className="mr-2" />
          Get VIP Access
        </button>
        <p className="text-white0 text-xs mt-3">Contact us to become a VIP client</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6 relative z-10">
        {exclusiveOffers.map(({ title, desc, icon: Icon }, i) => (
          <div
            key={title}
            className="glass-dark rounded-lg p-3 hover:border-gold-500/40 transition-all animate-pop-in hover:scale-[1.02] hover:shadow-md"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <Icon size={20} className="text-gold-400 mb-2" />
            <p className="text-white text-sm">{title}</p>
            <p className="text-white/70 text-xs">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 7. AI EVENT PLANNER
function AIEventPlanner() {
  const [activeTab, setActiveTab] = useState<'speech' | 'program' | 'highlights'>('speech');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState('');
  const [input, setInput] = useState({ eventType: '', names: '' });

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
5:00 PM - Closing Remarks & Departure`);
      } else {
        setGenerated(`EVENT HIGHLIGHT REEL CONCEPT

Opening: Aerial shot of venue (5s)
Scene 1: Guest arrivals (15s)
Scene 2: Main ceremony (20s)
Scene 3: Emotional moments (10s)
Scene 4: Dance floor energy (15s)
Closing: Slow-motion celebration (5s)

Total Runtime: ~70 seconds`);
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
        <input
          type="text"
          placeholder="Event Type (e.g., Wedding, Birthday)"
          value={input.eventType}
          onChange={(e) => setInput({ ...input, eventType: e.target.value })}
          className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
        />
        {activeTab === 'speech' && (
          <input
            type="text"
            placeholder="Names (e.g., Tunde & Funke)"
            value={input.names}
            onChange={(e) => setInput({ ...input, names: e.target.value })}
            className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-all animate-slide-in-down"
          />
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
    { id: 'vip', label: 'VIP', icon: Crown },
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
            {activeSection === 'memory' && <VIPPortal onNavigate={navigate} />}
            {activeSection === 'vip' && <VIPPortal onNavigate={navigate} />}
            {activeSection === 'vip' && <AIEventPlanner />}
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
            <Instagram size={20} className="text-gold-400" />
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
