import { useState, useEffect, useRef } from 'react';
import { MapPin, Send, CheckCircle, Instagram, Clock, Heart, Sparkles, Calendar, Mail } from 'lucide-react';
import Confetti from '../components/Confetti';
import FloatingDots from '../components/FloatingDots';

const emptyForm = { name: '', email: '', phone: '', eventType: '', date: '', guestCount: '', budget: '', message: '' };

const GMAIL_URL = 'https://mail.google.com/mail/?view=cm&fs=1&to=aolagbaye@gmail.com&su=Event%20Enquiry%20-%20Events%20By%20BELSH';
const WHATSAPP_URL = 'https://wa.me/2348035672491?text=Hi%20BELSH!%20I%27d%20like%20to%20inquire%20about%20planning%20my%20event.';
const INSTAGRAM_URL = 'https://www.instagram.com/events_by_belsh';

const eventTypes = [
  { value: 'Wedding', label: 'Wedding' },
  { value: 'Traditional Engagement', label: 'Traditional Engagement' },
  { value: 'Birthday Celebration', label: 'Birthday Celebration' },
  { value: 'Private Dinner', label: 'Private Dinner' },
  { value: 'Corporate Event', label: 'Corporate Event' },
  { value: 'Burial / Funeral', label: 'Burial / Funeral' },
  { value: 'Anniversary', label: 'Anniversary' },
  { value: 'Bridal Shower', label: 'Bridal Shower' },
  { value: 'Baby Shower', label: 'Baby Shower' },
  { value: 'Naming Ceremony', label: 'Naming Ceremony' },
  { value: 'Graduation Party', label: 'Graduation Party' },
  { value: 'Other', label: 'Other' },
];

const budgetRanges = [
  { value: 'under-200k', label: 'Under N200,000' },
  { value: '200k-500k', label: 'N200,000 - N500,000' },
  { value: '500k-1m', label: 'N500,000 - N1,000,000' },
  { value: '1m-3m', label: 'N1,000,000 - N3,000,000' },
  { value: '3m-plus', label: 'N3,000,000+' },
  { value: 'flexible', label: 'Flexible / Not Sure Yet' },
];

const reasons = [
  {
    icon: Heart,
    title: 'Personalized Approach',
    desc: 'We listen to your unique vision and craft celebrations that authentically reflect your style and story.',
  },
  {
    icon: Sparkles,
    title: 'Attention to Detail',
    desc: 'From the grand vision to the smallest detail, we ensure nothing is overlooked in creating your perfect event.',
  },
  {
    icon: Calendar,
    title: 'Seamless Experience',
    desc: 'We handle every logistics so you can be fully present and enjoy your celebration stress-free.',
  },
  {
    icon: CheckCircle,
    title: 'Trusted Network',
    desc: 'Access to our curated list of reliable vendors across Kwara State and beyond.',
  },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const bodyRef = useReveal();

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div>
      <Confetti style="rainbow" active={showConfetti} />
      <section className="page-hero text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(85,33,160,0.4)_0%,transparent_70%)]" />
        <FloatingDots color="rainbow" count={35} size="md" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="flex justify-center mb-5 opacity-0 animate-fade-in-up">
            <div className="w-14 h-14 rounded-full bg-purple-600/40 border border-gold-500/30 flex items-center justify-center animate-icon-wiggle">
              <Mail size={24} className="text-gold-400" />
            </div>
          </div>
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4 opacity-0 animate-fade-in-up">Let us Connect</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4 opacity-0 animate-fade-in-up-2">Contact Us</h1>
          <div className="section-divider" />
          <p className="text-white/80 text-lg max-w-xl mx-auto mt-4 opacity-0 animate-fade-in-up-3">
            Ready to bring your celebration to life? Tell us about your vision — we will reply within 24 hours.
          </p>
        </div>
      </section>

      {/* Reasons & What to Expect */}
      <section className="py-16 bg-purple-800/30 border-y border-dark-border relative overflow-hidden">
        <FloatingDots color="gold" count={20} size="sm" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Reasons */}
            <div>
              <h3 className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-6 text-center md:text-left">Why Choose BELSH</h3>
              <div className="grid gap-4">
                {reasons.map(({ icon: Icon, title, desc }, i) => (
                  <div key={title} className={`flex items-start gap-4 scroll-reveal delay-${i + 1}`}>
                    <div className="w-10 h-10 rounded-lg bg-gold-900/30 border border-gold-600/30 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-gold-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{title}</h3>
                      <p className="text-white/70 text-sm">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What to Expect */}
            <div className="glass-card gold-border rounded-xl p-6 animate-fade-in-up">
              <h3 className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-5 flex items-center gap-2">
                <CheckCircle size={14} />
                What to Expect
              </h3>
              <ul className="space-y-3">
                {[
                  { text: 'Free 30-minute discovery call', delay: '0.1s' },
                  { text: 'No-obligation consultation', delay: '0.2s' },
                  { text: 'Transparent pricing and packages', delay: '0.3s' },
                  { text: 'Personalized proposal within 48 hours', delay: '0.4s' },
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-white text-sm animate-slide-in-right"
                    style={{ animationDelay: item.delay }}
                  >
                    <span className="w-2 h-2 rounded-full bg-gold-400 shrink-0" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" ref={bodyRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-5 gap-12 lg:gap-16">

          {/* Info column */}
          <div className="lg:col-span-2 space-y-8 scroll-reveal-left">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-white mb-3">Ready to celebrate?</h2>
              <p className="text-white/80 text-sm leading-relaxed">
                Whether you have a full vision or just a feeling you want to create, we would love to hear from you.
                Every great event begins with a conversation — let's start yours.
              </p>
            </div>

            <div className="space-y-4">
              {/* Gmail */}
              <a
                href={GMAIL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 glass-card gold-border rounded-xl p-5 group hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-gold-900/40 border border-gold-600/30 flex items-center justify-center shrink-0 group-hover:border-gold-400/60 transition-colors">
                  <svg className="w-5 h-5 text-gold-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.72L12 16.64l-6.545-4.92v9.282H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819L12 8.91l6.545-5.09h3.819c.904 0 1.636.732 1.636 1.636zM12 14.18l6.545-5.09V4.82H5.455v4.27z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-widest mb-1">Email (Gmail)</p>
                  <p className="text-white text-sm">aolagbaye@gmail.com</p>
                  <p className="text-white/50 text-xs mt-1">Click to compose</p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 glass-card gold-border rounded-xl p-5 group hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-gold-900/40 border border-gold-600/30 flex items-center justify-center shrink-0 group-hover:border-gold-400/60 transition-colors">
                  <svg className="w-5 h-5 text-gold-400 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-widest mb-1">WhatsApp</p>
                  <p className="text-white text-sm">+234 803 567 2491</p>
                  <p className="text-white/50 text-xs mt-1">Click to chat</p>
                </div>
              </a>

              {/* Instagram */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 glass-card gold-border rounded-xl p-5 group hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-gold-900/40 border border-gold-600/30 flex items-center justify-center shrink-0 group-hover:border-gold-400/60 transition-colors">
                  <Instagram size={18} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-widest mb-1">Instagram</p>
                  <p className="text-white text-sm">@events_by_belsh</p>
                  <p className="text-white/50 text-xs mt-1">See our recent work</p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-start gap-4 glass-card gold-border rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-gold-900/40 border border-gold-600/30 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-widest mb-1">Based In</p>
                  <p className="text-white text-sm">Ilorin, Kwara State, Nigeria</p>
                  <p className="text-white/50 text-xs mt-1">Available for destination events</p>
                </div>
              </div>

              {/* Response Time */}
              <div className="flex items-start gap-4 glass-card gold-border rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-gold-900/40 border border-gold-600/30 flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-widest mb-1">Response Time</p>
                  <p className="text-white text-sm">Within 24 hours</p>
                  <p className="text-white/50 text-xs mt-1">Usually faster on WhatsApp</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 scroll-reveal-right">
            <div className="glass-card gold-border rounded-2xl p-8 md:p-10">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-12 gap-6">
                  <div className="w-16 h-16 rounded-full bg-gold-900/30 border border-gold-500/40 flex items-center justify-center">
                    <CheckCircle size={32} className="text-gold-400" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-white mb-2">How would you like to send your message?</h3>
                    <p className="text-white/80 max-w-sm mb-6">
                      Choose your preferred method below to send your enquiry.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold flex items-center justify-center gap-2 py-4"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      WhatsApp
                    </a>
                    <a
                      href={GMAIL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline-gold flex items-center justify-center gap-2 py-4"
                    >
                      <svg className="w-5 h-5 text-gold-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.72L12 16.64l-6.545-4.92v9.282H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819L12 8.91l6.545-5.09h3.819c.904 0 1.636.732 1.636 1.636zM12 14.18l6.545-5.09V4.82H5.455v4.27z"/>
                      </svg>
                      Gmail
                    </a>
                  </div>
                  <button
                    onClick={() => { setSubmitted(false); setForm(emptyForm); }}
                    className="text-gold-400 text-sm hover:text-gold-300 transition-colors mt-4"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl text-white mb-2">Tell Us About Your Event</h3>
                    <p className="text-white/70 text-sm">Fill in the details below and we will get back to you shortly.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/70 uppercase tracking-widest mb-2">Full Name *</label>
                      <input
                        type="text" name="name" required value={form.name} onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/70 uppercase tracking-widest mb-2">Email *</label>
                      <input
                        type="email" name="email" required value={form.email} onChange={handleChange}
                        placeholder="your@email.com"
                        className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/70 uppercase tracking-widest mb-2">Phone / WhatsApp</label>
                      <input
                        type="tel" name="phone" value={form.phone} onChange={handleChange}
                        placeholder="+234 000 000 0000"
                        className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/70 uppercase tracking-widest mb-2">Event Type *</label>
                      <select
                        name="eventType" required value={form.eventType} onChange={handleChange}
                        className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-500/50 transition-colors duration-300"
                      >
                        <option value="" className="bg-dark-card">Select event type...</option>
                        {eventTypes.map(({ value, label }) => (
                          <option key={value} value={value} className="bg-dark-card">{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-white/70 uppercase tracking-widest mb-2">Event Date</label>
                      <input
                        type="date" name="date" value={form.date} onChange={handleChange}
                        className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-500/50 transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/70 uppercase tracking-widest mb-2">Guest Count</label>
                      <input
                        type="text" name="guestCount" value={form.guestCount} onChange={handleChange}
                        placeholder="e.g. 50-100"
                        className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/70 uppercase tracking-widest mb-2">Budget Range</label>
                      <select
                        name="budget" value={form.budget} onChange={handleChange}
                        className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-500/50 transition-colors duration-300"
                      >
                        <option value="" className="bg-dark-card">Select budget...</option>
                        {budgetRanges.map(({ value, label }) => (
                          <option key={value} value={value} className="bg-dark-card">{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-white/70 uppercase tracking-widest mb-2">Tell Us About Your Vision *</label>
                    <textarea
                      name="message" required value={form.message} onChange={handleChange} rows={5}
                      placeholder="Describe your event, style preferences, venue ideas, and anything else you would like us to know..."
                      className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-colors duration-300 resize-none"
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn-gold w-full justify-center py-4">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-dark/40 border-t-dark rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <>Send Message <Send size={16} /></>
                    )}
                  </button>

                  <p className="text-white/50 text-xs text-center">
                    By submitting, you agree to our team reaching out via email or WhatsApp.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map / Location Section */}
      <section className="py-16 bg-purple-800/30 border-t border-dark-border">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4">Our Location</p>
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-4">Based in Kwara, Serving Beyond</h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            While we are proudly based in Ilorin, Kwara State, we plan events across Nigeria and are open to destination celebrations.
            Wherever your vision takes you, we are ready to follow.
          </p>
          <div className="glass-card gold-border rounded-xl p-8 max-w-md mx-auto">
            <MapPin size={32} className="text-gold-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-1">Ilorin, Kwara State</p>
            <p className="text-white/70 text-sm">Nigeria</p>
          </div>
        </div>
      </section>
    </div>
  );
}
