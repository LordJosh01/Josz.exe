import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Instagram, Clock, MessageCircle, Sparkles, Heart, Calendar } from 'lucide-react';

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
  const bodyRef = useReveal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div>
      <section className="page-hero text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(85,33,160,0.4)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4 opacity-0 animate-fade-in-up">Let us Connect</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-purple-50 mb-4 opacity-0 animate-fade-in-up-2">Contact Us</h1>
          <div className="section-divider" />
          <p className="text-purple-300/80 text-lg max-w-xl mx-auto mt-4 opacity-0 animate-fade-in-up-3">
            Ready to bring your celebration to life? Tell us about your vision — we will reply within 24 hours.
          </p>
        </div>
      </section>

      {/* Reasons */}
      <section className="py-16 bg-purple-900/30 border-y border-dark-border">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {reasons.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className={`text-center scroll-reveal delay-${i + 1}`}>
                <div className="w-12 h-12 rounded-full bg-gold-900/30 border border-gold-600/30 flex items-center justify-center mx-auto mb-4">
                  <Icon size={20} className="text-gold-400" />
                </div>
                <h3 className="text-purple-100 font-medium mb-2">{title}</h3>
                <p className="text-purple-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" ref={bodyRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-5 gap-12 lg:gap-16">

          {/* Info column */}
          <div className="lg:col-span-2 space-y-8 scroll-reveal-left">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-purple-50 mb-3">Ready to celebrate?</h2>
              <p className="text-purple-300/80 text-sm leading-relaxed">
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
                  <Mail size={18} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-purple-400 text-xs uppercase tracking-widest mb-1">Email (Gmail)</p>
                  <p className="text-purple-100 text-sm">aolagbaye@gmail.com</p>
                  <p className="text-purple-500 text-xs mt-1">Click to compose</p>
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
                  <Phone size={18} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-purple-400 text-xs uppercase tracking-widest mb-1">WhatsApp</p>
                  <p className="text-purple-100 text-sm">+234 803 567 2491</p>
                  <p className="text-purple-500 text-xs mt-1">Click to chat</p>
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
                  <p className="text-purple-400 text-xs uppercase tracking-widest mb-1">Instagram</p>
                  <p className="text-purple-100 text-sm">@events_by_belsh</p>
                  <p className="text-purple-500 text-xs mt-1">See our recent work</p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-start gap-4 glass-card gold-border rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-gold-900/40 border border-gold-600/30 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-purple-400 text-xs uppercase tracking-widest mb-1">Based In</p>
                  <p className="text-purple-100 text-sm">Ilorin, Kwara State, Nigeria</p>
                  <p className="text-purple-500 text-xs mt-1">Available for destination events</p>
                </div>
              </div>

              {/* Response Time */}
              <div className="flex items-start gap-4 glass-card gold-border rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-gold-900/40 border border-gold-600/30 flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-purple-400 text-xs uppercase tracking-widest mb-1">Response Time</p>
                  <p className="text-purple-100 text-sm">Within 24 hours</p>
                  <p className="text-purple-500 text-xs mt-1">Usually faster on WhatsApp</p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3.5 rounded-sm bg-green-700 hover:bg-green-600 text-white text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 w-full justify-center"
            >
              <MessageCircle size={18} className="shrink-0" />
              Chat on WhatsApp
            </a>

            {/* Quick Info */}
            <div className="pt-6 border-t border-dark-border">
              <p className="text-purple-400 text-xs uppercase tracking-widest mb-4">What to Expect</p>
              <ul className="space-y-2 text-sm text-purple-300/80">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-gold-400 shrink-0 mt-2" />
                  Free 30-minute discovery call
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-gold-400 shrink-0 mt-2" />
                  No-obligation consultation
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-gold-400 shrink-0 mt-2" />
                  Transparent pricing and packages
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-gold-400 shrink-0 mt-2" />
                  Personalized proposal within 48 hours
                </li>
              </ul>
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
                    <h3 className="font-serif text-2xl text-purple-50 mb-2">Message Received!</h3>
                    <p className="text-purple-300/80 max-w-sm">
                      Thank you for reaching out. We will be in touch within 24 hours to discuss your celebration.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSubmitted(false); setForm(emptyForm); }}
                    className="btn-outline-gold text-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl text-purple-50 mb-2">Tell Us About Your Event</h3>
                    <p className="text-purple-400 text-sm">Fill in the details below and we will get back to you shortly.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">Full Name *</label>
                      <input
                        type="text" name="name" required value={form.name} onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">Email *</label>
                      <input
                        type="email" name="email" required value={form.email} onChange={handleChange}
                        placeholder="your@email.com"
                        className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">Phone / WhatsApp</label>
                      <input
                        type="tel" name="phone" value={form.phone} onChange={handleChange}
                        placeholder="+234 000 000 0000"
                        className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">Event Type *</label>
                      <select
                        name="eventType" required value={form.eventType} onChange={handleChange}
                        className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 text-sm focus:outline-none focus:border-gold-500/50 transition-colors duration-300"
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
                      <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">Event Date</label>
                      <input
                        type="date" name="date" value={form.date} onChange={handleChange}
                        className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 text-sm focus:outline-none focus:border-gold-500/50 transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">Guest Count</label>
                      <input
                        type="text" name="guestCount" value={form.guestCount} onChange={handleChange}
                        placeholder="e.g. 50-100"
                        className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">Budget Range</label>
                      <select
                        name="budget" value={form.budget} onChange={handleChange}
                        className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 text-sm focus:outline-none focus:border-gold-500/50 transition-colors duration-300"
                      >
                        <option value="" className="bg-dark-card">Select budget...</option>
                        {budgetRanges.map(({ value, label }) => (
                          <option key={value} value={value} className="bg-dark-card">{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">Tell Us About Your Vision *</label>
                    <textarea
                      name="message" required value={form.message} onChange={handleChange} rows={5}
                      placeholder="Describe your event, style preferences, venue ideas, and anything else you would like us to know..."
                      className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-colors duration-300 resize-none"
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn-gold w-full justify-center">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-dark/40 border-t-dark rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <>Send Message <Send size={16} /></>
                    )}
                  </button>

                  <p className="text-purple-500 text-xs text-center">
                    By submitting, you agree to our team reaching out via email or WhatsApp.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map / Location Section */}
      <section className="py-16 bg-purple-900/30 border-t border-dark-border">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4">Our Location</p>
          <h2 className="font-serif text-2xl md:text-3xl text-purple-50 mb-4">Based in Kwara, Serving Beyond</h2>
          <p className="text-purple-300/70 max-w-xl mx-auto mb-8">
            While we are proudly based in Ilorin, Kwara State, we plan events across Nigeria and are open to destination celebrations.
            Wherever your vision takes you, we are ready to follow.
          </p>
          <div className="glass-card gold-border rounded-xl p-8 max-w-md mx-auto">
            <MapPin size={32} className="text-gold-400 mx-auto mb-4" />
            <p className="text-purple-100 font-medium mb-1">Ilorin, Kwara State</p>
            <p className="text-purple-400 text-sm">Nigeria</p>
          </div>
        </div>
      </section>
    </div>
  );
}
